import { onMount } from 'svelte';
import { writable, type Writable } from 'svelte/store';
import type { BlindKillerResponse, StandardResponse } from '$lib/types';
import axios from 'axios';

type UseGuessingGameOptions = {
	apiEndpoint: string;
	storageKey: string;
	storageDateKey: string;
	todayKey?: string;
	onGuess?: (guess: BlindKillerResponse | StandardResponse) => void;
};

export const useGuessingGame = (options: UseGuessingGameOptions) => {
	const guesses: Writable<BlindKillerResponse[] | StandardResponse[]> = writable([]);
	const hasCompletedToday: Writable<boolean> = writable(false);
	const emotesRevealed: Writable<number> = writable(1);
	const survivorPerkObscureLevel: Writable<number> = writable(0);
	const killerPerkObscureLevel: Writable<number> = writable(0);

	const isEmoteGame = options.apiEndpoint.includes('/emotes');
	const isSurvivorPerkGame = options.apiEndpoint.includes('/perk-survivor');
	const isKillerPerkGame = options.apiEndpoint.includes('/perk-killer');

	const today = new Date().toISOString().split('T')[0];

	onMount(() => {
		const storedCompletion = localStorage.getItem(options.storageDateKey);
		const storedGuesses = localStorage.getItem(options.storageKey);

		if (storedGuesses) {
			try {
				const parsedGuesses = JSON.parse(storedGuesses);
				guesses.set(parsedGuesses);

				if (storedCompletion === today) hasCompletedToday.set(true);

				if (isEmoteGame) {
					const storedRevealed = localStorage.getItem('emotes_revealed');
					if (storedRevealed) emotesRevealed.set(parseInt(storedRevealed));
				}

				if (isSurvivorPerkGame) {
					const storedLevel = localStorage.getItem('survivor_perk_obscure_level');
					if (storedLevel) survivorPerkObscureLevel.set(parseInt(storedLevel));
				}

				if (isKillerPerkGame) {
					const storedLevel = localStorage.getItem('killer_perk_obscure_level');
					if (storedLevel) killerPerkObscureLevel.set(parseInt(storedLevel));
				}
			} catch (error) {
				console.error('Error parsing stored guesses:', error);
			}
		} else {
			localStorage.removeItem(options.storageDateKey);
			localStorage.removeItem(options.storageKey);
			if (isEmoteGame) localStorage.removeItem('emotes_revealed');
		}
	});

	const submitGuess = async (guess: string) => {
		if (!guess) return;

		try {
			const res = await axios.post(options.apiEndpoint, { guess: guess.toLowerCase().trim() });
			const data: BlindKillerResponse | StandardResponse = res.data;

			guesses.update((prev) => {
				const updated = [...prev, data];
				localStorage.setItem(options.storageKey, JSON.stringify(updated));
				return updated;
			});

			if (isEmoteGame) {
				emotesRevealed.update((prev) => {
					const next = prev + 1;
					localStorage.setItem('emotes_revealed', next.toString());
					return next;
				});
			}

			if (isSurvivorPerkGame) {
				survivorPerkObscureLevel.update((prev) => {
					const next = prev + 1;
					localStorage.setItem('survivor_perk_obscure_level', next.toString());
					return next;
				});
			}

			if (isKillerPerkGame) {
				killerPerkObscureLevel.update((prev) => {
					const next = prev + 1;
					localStorage.setItem('killer_perk_obscure_level', next.toString());
					return next;
				});
			}

			if (data.isCorrect) {
				localStorage.setItem(options.storageDateKey, today);
				if (isEmoteGame) localStorage.setItem('emotes_revealed', '3');
				if (isSurvivorPerkGame) {
					localStorage.setItem('survivor_perk_obscure_level', '5');
					survivorPerkObscureLevel.set(5);
				}
        if (isKillerPerkGame) {
          localStorage.setItem('killer_perk_obscure_level', '5');
          killerPerkObscureLevel.set(5);
        }
				hasCompletedToday.set(true);
			}

			options.onGuess?.(data);
		} catch (error) {
			console.error('Error submitting guess:', error);
		}
	};

	return {
		guesses,
		hasCompletedToday,
		submitGuess,
		...(isEmoteGame && { emotesRevealed }),
		...(isSurvivorPerkGame && { survivorPerkObscureLevel }),
    ...(isKillerPerkGame && { killerPerkObscureLevel }),
	};
};
