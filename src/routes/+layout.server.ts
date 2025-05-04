import { supabaseServer } from '$lib/supabaseServer';
import type { KillerFromDb, PerkFromDb } from '$lib/types';

export const load = async () => {
	const {
		data: killers,
		error: killersError,
	}: { data: KillerFromDb[] | null; error: Error | null } = await supabaseServer
		.from('Killers')
		.select('*');
	const { data: perks, error: perksError }: { data: PerkFromDb[] | null; error: Error | null } =
		await supabaseServer.from('Perks').select('*');

	if (killersError || !killers)
		throw new Error(`Failed to fetch killers: ${killersError?.message}`);
	if (perksError || !perks) throw new Error(`Failed to fetch perks: ${perksError?.message}`);

	return {
		killers: killers,
		perks: perks,
	};
};
