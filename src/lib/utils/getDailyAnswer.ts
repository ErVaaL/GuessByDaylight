import { supabaseServer } from '$lib/supabaseServer';
import type { KillerFromDb, PerkFromDb } from '$lib/types';

async function getAnswer(game: string, answerId: string): Promise<KillerFromDb | null> {
	if (game === 'perk-survivor' || game === 'perk-killer') {
		const { data: perk, error } = await supabaseServer
			.from('Perks')
			.select('*')
			.eq('id', answerId)
			.single();

		if (error || !perk) {
			throw new Error(`Failed to fetch perk: ${error?.message}`);
		}

		return perk;
	} else {
		const { data: killer, error } = await supabaseServer
			.from('Killers')
			.select('*')
			.eq('id', answerId)
			.single();

		if (error || !killer) {
			throw new Error(`Failed to fetch killer: ${error?.message}`);
		}

		return killer;
	}
}

export async function getDailyAnswer(
	correctAnswer: KillerFromDb | PerkFromDb | null,
	game: string
): Promise<KillerFromDb | PerkFromDb> {
	if (correctAnswer) return correctAnswer;
	const today = new Date().toISOString().split('T')[0];
	const { data: correct, error } = await supabaseServer
		.from('DailyAnswers')
		.select('*')
		.eq('answers_date', today)
		.single();

	if (error || !correct) {
		throw new Error(`Failed to fetch daily killer: ${error?.message}`);
	}

	let answerId: string | null = null;

	switch (game) {
		case 'blind':
			answerId = correct.blind_killer_id;
			break;
		case 'emotes':
			answerId = correct.emotes_killer_id;
			break;
		case 'perk-survivor':
			answerId = correct.survivor_perk_id;
			break;
		case 'perk-killer':
			answerId = correct.killer_perk_id;
			break;
		case 'terror':
			answerId = correct.terror_killer_id;
			break;
		default:
			throw new Error(`Invalid game type: ${game}`);
	}

	if (!answerId) throw new Error(`No answer ID found for game type: ${game}`);

	const answer = await getAnswer(game, answerId);
	if (!answer) throw new Error(`No answer found for game type: ${game}`);
	return answer;
}
