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

	const today = new Date().toISOString().split('T')[0];

	onMount(() => {
		const storedCompletion = localStorage.getItem(options.storageDateKey);
		const storedGuesses = localStorage.getItem(options.storageKey);

		if (storedCompletion === today && storedGuesses) {
			try {
				const parsedGuesses = JSON.parse(storedGuesses);
				guesses.set(parsedGuesses);
				hasCompletedToday.set(true);
			} catch (error) {
				console.error('Error parsing stored guesses:', error);
			}
		} else {
			localStorage.removeItem(options.storageDateKey);
			localStorage.removeItem(options.storageKey);
		}
	});

	const submitGuess = async (guess: string) => {
		if (!guess) return;
		const res = await axios.post(options.apiEndpoint, { guess: guess.toLowerCase().trim() });
		const data: BlindKillerResponse | EmoteKillerResponse = res.data;
		guesses.update((prev) => {
			const updated = [...prev, data];
			localStorage.setItem(options.storageKey, JSON.stringify(updated));
			if (data.isCorrect) {
				localStorage.setItem(options.storageDateKey, today);
				hasCompletedToday.set(true);
			}
			return updated;
		});
		options.onGuess?.(data);
	};

	return {
		guesses,
		hasCompletedToday,
		submitGuess,
	};
};
