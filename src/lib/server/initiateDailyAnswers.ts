import { supabaseServer } from '$lib/supabaseServer';
import type { DailyPick, PerkFromDb } from '$lib/types';

function randomItem<T>(array: T[]) {
	return array[Math.floor(Math.random() * array.length)];
}

export const initiateDailyAnswers = async (): Promise<{
	inserted: boolean;
	dailyPick: DailyPick;
}> => {
	const today = new Date().toISOString().split('T')[0];

	const { data: dailyPick }: { data: DailyPick | null } = await supabaseServer
		.from('DailyAnswers')
		.select('*')
		.eq('answers_date', today)
		.single();

	if (dailyPick) return { inserted: false, dailyPick };

	const { data: killers, error: killersError } = await supabaseServer.from('Killers').select('*');
	const { data: perks, error: perksError } = await supabaseServer.from('Perks').select('*');
	if (killersError || !killers)
		throw new Error(`Failed to fetch killers: ${killersError?.message}`);
	if (perksError || !perks) throw new Error(`Failed to fetch perks: ${perksError?.message}`);
	const survivorPerk = perks.filter((perk: PerkFromDb) => perk.side === 'survivor');
	const killerPerk = perks.filter((perk: PerkFromDb) => perk.side === 'killer');

	const payload = {
		answers_date: today,
		blind_killer_id: randomItem(killers).id,
		emotes_killer_id: randomItem(killers).id,
		survivor_perk_id: randomItem(survivorPerk).id,
		killer_perk_id: randomItem(killerPerk).id,
		terror_killer_id: randomItem(killers).id,
	};

	const { error: insertError } = await supabaseServer.from('DailyAnswers').insert([payload]);
	if (insertError) throw new Error(`Failed to insert daily pick: ${insertError.message}`);

	return { inserted: true, dailyPick: payload as DailyPick };
};
