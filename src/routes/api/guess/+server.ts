import type { RequestHandler } from '@sveltejs/kit';
import { killers } from '$lib/data/killers';

type Killer = {
	id: string;
	name: string;
	altNames: string[];
	sex: string;
	speed: number[];
	height: string;
	terrorRadius: number[];
	attackType: string[];
	origin: string;
	releaseYear: number;
};

const correctKillerName = 'Mastermind';
const correctKiller = killers.find((killer) => killer.id === correctKillerName.toLowerCase());
if (!correctKiller) {
	throw new Error(`Killer ${correctKillerName} not found`);
}

function compareArrayStat<T extends string | number>(
	guessedValue: T[],
	correctValue: T[]
): 'correct' | 'partial' | 'incorrect' {
	const allMatch = guessedValue.every((value) => correctValue.includes(value));
	if (allMatch && guessedValue.length === correctValue.length) return 'correct';

	const anyMatch = guessedValue.some((value) => correctValue.includes(value));
	return anyMatch ? 'partial' : 'incorrect';
}

export const POST: RequestHandler = async ({ request }) => {
	const { guess } = await request.json();
	const guessedKiller = killers.find((killer) => killer.id === guess.toLowerCase());
	if (!guessedKiller)
		return new Response(JSON.stringify({ error: 'Killer not found' }), { status: 404 });

	const result = {
		name: guessedKiller.name,
		guess,
		stats: {
			sex: guessedKiller.sex === correctKiller.sex ? 'correct' : 'incorrect',
			speed: compareArrayStat(guessedKiller.speed, correctKiller.speed),
			height: guessedKiller.height === correctKiller.height ? 'correct' : 'incorrect',
			terrorRadius: compareArrayStat(guessedKiller.terrorRadius, correctKiller.terrorRadius),
			attackType: compareArrayStat(guessedKiller.attackType, correctKiller.attackType),
			origin: guessedKiller.origin === correctKiller.origin ? 'correct' : 'incorrect',
			releaseYear: guessedKiller.releaseYear === correctKiller.releaseYear ? 'correct' : 'incorrect'
		},
		isCorrect: guessedKiller.id === correctKiller?.id
	};

	return new Response(JSON.stringify(result), {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
