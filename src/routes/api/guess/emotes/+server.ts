import type { RequestHandler } from '@sveltejs/kit';
import type { KillerFromDb } from '$lib/types';
import { getDailyAnswer } from '$lib/utils/getDailyAnswer';

const correctKiller: KillerFromDb | null = null;
const game = 'emotes';

export const GET: RequestHandler = async () => {
	try {
		const correct = (await getDailyAnswer(correctKiller, game)) as KillerFromDb;

		if (!correct)
			return new Response(JSON.stringify({ error: 'No killer found' }), { status: 404 });
		const randomKillerEmotes = correct.emotes;

		return new Response(JSON.stringify(randomKillerEmotes), {
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
	const { guess: guessedKiller } = await request.json();
	if (!guessedKiller || !guessedKiller.id)
		return new Response(JSON.stringify({ error: 'Invalid killer' }), { status: 400 });

	const result = {
		name: guessedKiller.name,
		guess: guessedKiller.id,
		isCorrect: guessedKiller.id === correct.id,
	};

	return new Response(JSON.stringify(result), {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
		},
	});
};
