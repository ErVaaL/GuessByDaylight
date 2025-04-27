import { supabaseServer } from '$lib/supabaseServer';
import type { KillerFromDb } from '$lib/types';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	const { data: killers, error }: { data: KillerFromDb[] | null; error: Error | null } =
		await supabaseServer.from('Killers').select('*');

	if (error || !killers) {
		throw new Error(`Failed to fetch killers: ${error?.message}`);
	}

	return { killers };
};
