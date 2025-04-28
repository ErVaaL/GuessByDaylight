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
	const terrorLayerUnlocked: Writable<number> = writable(1);

	const isEmoteGame = options.apiEndpoint.includes('/emotes');
	const isSurvivorPerkGame = options.apiEndpoint.includes('/perk-survivor');
	const isKillerPerkGame = options.apiEndpoint.includes('/perk-killer');
	const isTerrorGame = options.apiEndpoint.includes('/terror');

	const today = new Date().toISOString().split('T')[0];

	onMount(() => {
		const storedCompletion = localStorage.getItem(options.storageDateKey);
		const storedGuesses = localStorage.getItem(options.storageKey);

		if (storedCompletion && storedCompletion !== today) {
			localStorage.removeItem(options.storageDateKey);
			localStorage.removeItem(options.storageKey);
			localStorage.removeItem('emotes_revealed');
			localStorage.removeItem('survivor_perk_obscure_level');
			localStorage.removeItem('killer_perk_obscure_level');
			localStorage.removeItem('terror_layer_unlocked');
			localStorage.removeItem('perk_random_tilt');
		}

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

				if (isTerrorGame) {
					const storedLevel = localStorage.getItem('terror_layer_unlocked');
					if (storedLevel) terrorLayerUnlocked.set(parseInt(storedLevel));
				}
			} catch (error) {
				console.error('Error parsing stored guesses:', error);
			}
		}
	});

	const submitGuess = async (guess: string) => {
		if (!guess) return;

		let input = guess.trim();

		if (guess.trim() === 'Good Guy') input = 'Goodguy';
		if (guess.trim() === 'Ghost Face') input = 'Ghostface';
		if (guess.trim() === 'Skull Merchant') input = 'Skullmerchant';
		if (guess.trim() === 'Dark Lord') input = 'Darklord';


		try {
			const res = await axios.post(options.apiEndpoint, { guess: input });
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

			if (isTerrorGame) {
				terrorLayerUnlocked.update((prev) => {
					const next = prev + 1;
					localStorage.setItem('terror_layer_unlocked', next.toString());
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
				if (isTerrorGame) {
					localStorage.setItem('terror_layer_unlocked', '4');
					terrorLayerUnlocked.set(4);
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
		...(isTerrorGame && { terrorLayerUnlocked }),
	};
};
