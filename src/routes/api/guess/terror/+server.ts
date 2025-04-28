import { supabaseServer } from '$lib/supabaseServer';
import type { KillerFromDb } from '$lib/types';
import { getDailyAnswer } from '$lib/utils/getDailyAnswer';
import type { RequestHandler } from '@sveltejs/kit';

const correctKiller: KillerFromDb | null = null;
const game = 'terror';

export const GET: RequestHandler = async () => {
	try {
		const correct = (await getDailyAnswer(correctKiller, game)) as KillerFromDb;
		if (!correct)
			return new Response(JSON.stringify({ error: 'No killer found' }), { status: 404 });

		const randomKillerTerrors: string[] = [
			correct.terror_far,
			correct.terror_mid,
			correct.terror_near,
			correct.terror_chase,
		];

		return new Response(JSON.stringify(randomKillerTerrors), {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	} catch (error) {
		return new Response(
			JSON.stringify({ error: `Failed to fetch daily killer, error: ${error}` }),
			{ status: 500 }
		);
	}
};

export const POST: RequestHandler = async ({ request }) => {
	const correct = await getDailyAnswer(correctKiller, game);
	const { guess } = await request.json();
	const { data: guessedKiller, error }: { data: KillerFromDb | null; error: Error | null } =
		await supabaseServer.from('Killers').select('*').eq('id', guess.toLowerCase()).single();

	if (!guessedKiller || error)
		return new Response(JSON.stringify({ error: 'Killer not found' }), { status: 404 });

	const result = {
		name: guessedKiller.name,
		guess,
		isCorrect: guessedKiller.id === correct.id,
	};

	return new Response(JSON.stringify(result), {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
		},
	});
};
