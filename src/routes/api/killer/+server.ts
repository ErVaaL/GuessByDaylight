import type { RequestHandler } from '@sveltejs/kit';
import { supabaseServer } from '$lib/supabaseServer';
import type { KillerFromDb } from '$lib/types';
import type { PostgrestError } from '@supabase/supabase-js';

export const GET: RequestHandler = async () => {
	try {
		const { data, error }: { data: KillerFromDb[] | null; error: PostgrestError | null } =
			await supabaseServer.from('Killers').select('*');

		if (error) {
			console.error('Error fetching data:', error);
			return new Response(JSON.stringify({ error: 'Failed to fetch data' }), { status: 500 });
		}

		return new Response(JSON.stringify(data), {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	} catch (error) {
		console.error('Error processing request:', error);
		return new Response(JSON.stringify({ error: (error as Error).message }), { status: 500 });
	}
};
