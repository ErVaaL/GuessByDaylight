import { initiateDailyAnswers } from '$lib/server/initiateDailyAnswers';
import { supabaseServer } from '$lib/supabaseServer';
import type { KillerFromDb, PerkFromDb, SurvivorFromDb } from '$lib/types';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
	const {
		data: killers,
		error: killersError,
	}: { data: KillerFromDb[] | null; error: Error | null } = await supabaseServer
		.from('Killers')
		.select('*');

	const { data: perks, error: perksError }: { data: PerkFromDb[] | null; error: Error | null } =
		await supabaseServer.from('Perks').select('*');

	const {
		data: survivors,
		error: survivorsError,
	}: { data: SurvivorFromDb[] | null; error: Error | null } = await supabaseServer
		.from('Survivors')
		.select('*');

	if (killersError || !killers) console.error(`Error fetching killers: ${killersError?.message}`);
	// throw new Error(`Failed to fetch killers: ${killersError?.message}`);
	if (perksError || !perks) console.error(`Error fetching perks: ${perksError?.message}`);
	// throw new Error(`Failed to fetch perks: ${perksError?.message}`);
	if (survivorsError || !survivors)
		console.error(`Error fetching surviviors: ${survivorsError?.message}`);
	// throw new Error(`Failed to fetch survivors: ${survivorsError?.message}`);

	const { dailyPick } = await initiateDailyAnswers();
	const today = dailyPick.answers_date;

	cookies.set('lastResetDate', today, {
		path: '/',
		httpOnly: false,
		sameSite: 'lax',
		secure: true,
		maxAge: 60 * 60 * 24,
	});

	return {
		killers: killers,
		survivors: survivors,
		perks: perks,
		today,
	};
};
