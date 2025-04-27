import type { RequestHandler } from '@sveltejs/kit';
import { supabaseServer } from '$lib/supabaseServer';
import type { BlindKillerResponse, KillerFromDb } from '$lib/types';
import type { PostgrestError } from '@supabase/supabase-js';
import { getDailyAnswer } from '$lib/utils/getDailyAnswer';

const correctKiller: KillerFromDb | null = null;
const game = 'blind';

getDailyAnswer(correctKiller, game);

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { guess } = await request.json();
		const {
			data: guessedKiller,
			error,
		}: { data: KillerFromDb | null; error: PostgrestError | null } = await supabaseServer
			.from('Killers')
			.select('*')
			.eq('id', guess.toLowerCase())
			.single();

		if (error || !guessedKiller) {
			return new Response(JSON.stringify({ error: 'Killer not found' }), { status: 404 });
		}

		const correct = await getDailyAnswer(correctKiller, game);

		const compareArrayStat = (a: Array<string | number>, b: Array<string | number>) => {
			if (JSON.stringify(a) === JSON.stringify(b)) return 'correct';
			return a.some((val) => b.includes(val)) ? 'partial' : 'incorrect';
		};

		const result: BlindKillerResponse = {
			name: guessedKiller.name,
			guess: guess,
			stats: {
				sex: guessedKiller.sex === correct.sex ? 'correct' : 'incorrect',
				terrorRadius: compareArrayStat(guessedKiller.terrorRadius, correct.terrorRadius),
				speed: compareArrayStat(guessedKiller.speed, correct.speed),
				attackType: compareArrayStat(guessedKiller.attackType, correct.attackType),
				height: guessedKiller.height === correct.height ? 'correct' : 'incorrect',
				origin: guessedKiller.origin === correct.origin ? 'correct' : 'incorrect',
				releaseYear:
					guessedKiller.releaseYear === correct.releaseYear
						? 'correct'
						: guessedKiller.releaseYear < correct.releaseYear
							? 'later'
							: 'earlier',
			},
			portrait: guessedKiller.portrait,
			isCorrect: guessedKiller.id === correct.id,
		};

		return new Response(JSON.stringify(result), {
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
