import { derived, readable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { KillerFromDb } from '$lib/types';
import { normalizeName } from './normalizeName';

export function useExcludedKillers(
	guesses: Writable<{ name: string }[]>,
	killersArray: KillerFromDb[]
) {
	const killers = readable(killersArray);
	const excludedKillers = derived([guesses, killers], ([$guesses, $killers]) => {
		const guessedKillerIds = $guesses.map((guess) => normalizeName(guess.name));
		return $killers.filter((killer) => !guessedKillerIds.includes(normalizeName(killer.id)));
	});
	return { excludedKillers };
}
