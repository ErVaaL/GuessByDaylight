import { supabaseServer } from '$lib/supabaseServer';
import type { DailyPick } from '$lib/types';
import type { PostgrestError } from '@supabase/supabase-js';

export const getDailyAnswers = async () => {
	const today = new Date().toISOString().split('T')[0];

	const { data: dailyPick, error }: { data: DailyPick | null; error: PostgrestError | null } =
		await supabaseServer.from('DailyAnswers').select('*').eq('answers_date', today).single();

	if (error) throw new Error(`Failed to fetch daily pick: ${error.message}`);

	if (!dailyPick) throw new Error('No daily pick found');

	return {
		id: dailyPick.answers_date,
		blind_killer_id: dailyPick.blind_killer_id,
		emotes_killer_id: dailyPick.emotes_killer_id,
		survivor_perk_id: dailyPick.survivor_perk_id,
		killer_perk_id: dailyPick.killer_perk_id,
		terror_killer_id: dailyPick.terror_killer_id,
	};
};
