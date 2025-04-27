import { derived, readable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { KillerFromDb } from '$lib/types';

export function useExcludedKillers(
	guesses: Writable<{ name: string }[]>,
	killersArray: KillerFromDb[]
) {
	const killers = readable(killersArray);
	const excludedKillers = derived([guesses, killers], ([$guesses, $killers]) => {
		const guessedKillerIds = $guesses.map((guess) => guess.name.toLowerCase());
		return $killers.filter((killer) => !guessedKillerIds.includes(killer.id));
	});
	return { excludedKillers };
}
