import { derived } from 'svelte/store';
import { killers } from '$lib/data/killers';
import type { Writable } from 'svelte/store';

type Killer = {
	name: string;
	altNames: string[];
};

export function useExcludedKillers(guesses: Writable<{ name: string }[]>) {
	const excludedKillers = derived(guesses, ($guesses) => {
		const guessedKillerIds = $guesses.map((guess) => guess.name.toLowerCase());
		const killerMatches: Killer[] = killers.map((killer) => ({
			name: killer.name,
			altNames: killer.altNames,
		}));

		return killerMatches.filter((killer) => !guessedKillerIds.includes(killer.name.toLowerCase()));
	});

	return { excludedKillers };
}
