import { supabaseServer } from '$lib/supabaseServer';
import type { KillerFromDb, PerkFromDb } from '$lib/types';
import type { PostgrestError } from '@supabase/supabase-js';

const answerCache: Record<string, { date: string; answer: KillerFromDb | PerkFromDb }> = {};

async function getAnswer(game: string, answerId: string): Promise<KillerFromDb | PerkFromDb> {
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
		const { data: killer, error }: { data: KillerFromDb | null; error: PostgrestError | null } =
			await supabaseServer
				.from('Killers')
				.select(
					`
        id,
				name,
        altNames,
				sex,
				terrorRadius,
				speed,
				attackType,
				height,
				origin,
				releaseYear,
				portrait,
				terror_far(file_path),
				terror_mid(file_path),
				terror_near(file_path),
				terror_chase(file_path),
				emotes
       `
				)
				.eq('id', answerId)
				.single();

		if (error || !killer) throw new Error(`Failed to fetch killer: ${error?.message}`);

		return {
			...killer,
			terror_far: killer.terror_far?.file_path ?? '',
			terror_mid: killer.terror_mid?.file_path ?? '',
			terror_near: killer.terror_near?.file_path ?? '',
			terror_chase: killer.terror_chase?.file_path ?? '',
		} as KillerFromDb;
	}
}

export async function getDailyAnswer(
	correctAnswer: KillerFromDb | PerkFromDb | null,
	game: string
): Promise<KillerFromDb | PerkFromDb> {
	if (correctAnswer) return correctAnswer;

	const today = new Date().toISOString().split('T')[0];

	const cached = answerCache[game];
	if (cached && cached.date === today) return cached.answer;

	const { data: correct, error } = await supabaseServer
		.from('DailyAnswers')
		.select('*')
		.eq('answers_date', today)
		.single();

	if (error || !correct) throw new Error(`Failed to fetch daily killer: ${error?.message}`);

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

	answerCache[game] = { date: today, answer };
	return answer;
}
