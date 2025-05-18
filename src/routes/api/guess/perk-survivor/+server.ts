import type { RequestHandler } from '@sveltejs/kit';
import type { PerkFromDb } from '$lib/types';
import { getDailyAnswer } from '$lib/utils/getDailyAnswer';

const correctPerk: PerkFromDb | null = null;
const game = 'perk-survivor';

export const GET: RequestHandler = async () => {
	try {
		const correct = (await getDailyAnswer(correctPerk, game)) as PerkFromDb;
		if (!correct)
			return new Response(JSON.stringify({ error: 'No correct answer found' }), { status: 404 });

		return new Response(JSON.stringify(correct), {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	} catch (error) {
		console.error('Error fetching correct answer:', error);
		return new Response(JSON.stringify({ error: 'Failed to fetch correct answer' }), {
			status: 500,
		});
	}
};

export const POST: RequestHandler = async ({ request }) => {
	const correct = await getDailyAnswer(correctPerk, game);
	const { guess: guessedPerk } = await request.json();

	if (!guessedPerk || !guessedPerk.id)
		return new Response(JSON.stringify({ error: 'Perk not found' }), { status: 404 });

	const result = {
		name: guessedPerk.name,
		guess: guessedPerk,
		isCorrect: guessedPerk.id === correct.id,
	};

	return new Response(JSON.stringify(result), {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
		},
	});
};
