import { onMount } from 'svelte';
import { writable, type Writable } from 'svelte/store';
import type { BlindKillerResponse, EmoteKillerResponse } from '$lib/types';
import axios from 'axios';

type UseGuessingGameOptions = {
	apiEndpoint: string;
	storageKey: string;
	storageDateKey: string;
	todayKey?: string;
	onGuess?: (guess: BlindKillerResponse | EmoteKillerResponse) => void;
};

export const useGuessingGame = (options: UseGuessingGameOptions) => {
	const guesses: Writable<BlindKillerResponse[] | EmoteKillerResponse[]> = writable([]);
	const hasCompletedToday: Writable<boolean> = writable(false);
	const emotesRevealed: Writable<number> = writable(1);

	const isEmoteGame = options.apiEndpoint.includes('/emotes');

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
			const data: BlindKillerResponse | EmoteKillerResponse = res.data;

			guesses.update((prev) => {
				const updated = [...prev, data];
				localStorage.setItem(options.storageKey, JSON.stringify(updated));
				return updated;
			});

			if (isEmoteGame && 'emotesRevealed' in data && typeof data.emotesRevealed === 'number') {
				emotesRevealed.update((prev) => {
					const next = prev + 1;
					localStorage.setItem('emotes_revealed', next.toString());
					return next;
				});
			}

			if (data.isCorrect) {
				localStorage.setItem(options.storageDateKey, today);
        if (isEmoteGame) localStorage.setItem('emotes_revealed', '3');
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
	};
};
