import type { RequestHandler } from '@sveltejs/kit';
import { perks } from '$lib/data/perks';

const correctPerkName = 'Distressing';
const correctPerk = perks.find((perk) => perk.name.toLowerCase() === correctPerkName.toLowerCase());

if (!correctPerk) {
	throw new Error(`Perk ${correctPerkName} not found`);
}

export const GET: RequestHandler = async () => {
	return new Response(JSON.stringify(correctPerk), {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
		},
	});
};

export const POST: RequestHandler = async ({ request }) => {
	const { guess } = await request.json();
	const guessedPerk = perks.find((perk) => perk.name.toLowerCase() === guess.toLowerCase());
	if (!guessedPerk)
		return new Response(JSON.stringify({ error: 'Perk not found' }), { status: 404 });

	const result = {
		name: guessedPerk.name,
		guess,
		isCorrect: guessedPerk.name.toLowerCase() === correctPerk.name.toLowerCase(),
	};

	return new Response(JSON.stringify(result), {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
		},
	});
};
