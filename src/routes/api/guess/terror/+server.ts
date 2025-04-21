import type { RequestHandler } from '@sveltejs/kit';
import { killers } from '$lib/data/killers';

const correctKillerName = 'Mastermind';
const correctKiller = killers.find((killer) => killer.name === correctKillerName);
if (!correctKiller) throw new Error(`Killer with name "${correctKillerName}" not found.`);

export const GET: RequestHandler = async () => {
	const randomKiller = killers[2];
	if (!randomKiller)
		return new Response(JSON.stringify({ error: 'No killer found' }), { status: 404 });
	const randomKillerTerrorLayers: string[] = randomKiller.terrorRadiusSound;
	return new Response(JSON.stringify(randomKillerTerrorLayers), {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
		},
	});
};

export const POST: RequestHandler = async ({ request }) => {
	const { guess } = await request.json();
	const guessedKiller = killers.find((killer) => killer.name.toLowerCase() === guess.toLowerCase());

	if (!guessedKiller)
		return new Response(JSON.stringify({ error: 'Killer not found' }), { status: 404 });

	const result = {
		name: guessedKiller.name,
		guess,
		isCorrect: guessedKiller.id === correctKiller.id,
	};

	return new Response(JSON.stringify(result), {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
		},
	});
};
