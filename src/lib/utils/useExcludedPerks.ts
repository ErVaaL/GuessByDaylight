import { derived } from 'svelte/store';
import { perks } from '$lib/data/perks';
import type { Writable } from 'svelte/store';
import type { Perk } from '$lib/types';

export function useExcludedPerks(
	guesses: Writable<{ name: string }[]>,
	currentSide: Writable<'killer' | 'survivor'>
) {
	const excludedPerks = derived([guesses, currentSide], ([$guesses, $currentSide]) => {
		const guessedPerkNames = $guesses.map((guess) => guess.name.toLowerCase());

		return perks
			.filter((perk: Perk) => perk.side === $currentSide)
			.filter((perk: Perk) => !guessedPerkNames.includes(perk.name.toLowerCase()));
	});

	return { excludedPerks };
}
