import { derived, readable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { PerkFromDb } from '$lib/types';

export function useExcludedPerks(
	guesses: Writable<{ name: string }[]>,
	perkSide: string,
	perksArray: PerkFromDb[]
) {
	const perks = readable(perksArray);
	const excludedPerks = derived([guesses, perks], ([$guesses, $perks]) => {
		const guessedPerkNames = $guesses.map((guess) => guess.name.toLowerCase());

		return $perks
			.filter((perk: PerkFromDb) => perk.side === perkSide)
			.filter((perk: PerkFromDb) => !guessedPerkNames.includes(perk.name.toLowerCase()));
	});

	return { excludedPerks };
}
