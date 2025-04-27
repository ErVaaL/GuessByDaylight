import { supabaseServer } from '$lib/supabaseServer';
import type { KillerFromDb, PerkFromDb } from '$lib/types';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	const { data: killers, error }: { data: KillerFromDb[] | null; error: Error | null } =
		await supabaseServer.from('Killers').select('*');
  const { data: perks, error: perksError }: { data: PerkFromDb[] | null; error: Error | null } =
    await supabaseServer.from('Perks').select('*');

	if (error || !killers) {
		throw new Error(`Failed to fetch killers: ${error?.message}`);
	}

  if (perksError || !perks) {
    throw new Error(`Failed to fetch perks: ${perksError?.message}`);
  }

	return { killers: killers, perks: perks };
};
