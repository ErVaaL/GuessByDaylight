<script lang="ts">
	import { killers } from '$lib/data/killers';
	import { goto } from '$app/navigation';
	import axios from 'axios';
	import type { KillerResponse } from '$lib/types';
	import GuessResult from '../../../components/blind/GuessResult.svelte';
	import GuessingInput from '../../../components/blind/GuessingInput.svelte';
	import { onMount } from 'svelte';
	import ScratchMarkLoader from '../../../components/ui/ScratchMarkLoader.svelte';

	type Killer = {
		name: string;
		altNames: string[];
	};

	let revealDone = false;

	const headers = [
		{ val: 'Name' },
		{ val: 'Sex' },
		{ val: 'Terror Radius' },
		{ val: 'Speed' },
		{ val: 'Attack Type' },
		{ val: 'Height' },
		{ val: 'Origin' },
		{ val: 'Release Year' },
	];

	let guesses: KillerResponse[] = [];
	let hasCompletedToday = false;
	let loading = true;

	$: isCorrect = guesses.some((item) => item.isCorrect);

	const killerMatches: Killer[] = killers.map((killer) => ({
		name: killer.name,
		altNames: killer.altNames,
	}));

	$: guessedKillerIds = guesses.map((guess) => guess.name.toLowerCase());

	$: excludedKillers = killerMatches.filter(
		(killer) => !guessedKillerIds.includes(killer.name.toLowerCase())
	);

	onMount(() => {
		const today = new Date().toISOString().split('T')[0];
		const storedDate = localStorage.getItem('blind_guess_correct');
		const storedGuesses = localStorage.getItem('blind_guesses');

		if (storedDate === today && storedGuesses) {
			try {
				guesses = JSON.parse(storedGuesses);
				hasCompletedToday = true;
			} catch {
				console.warn('Failed to parse saved guesses.');
			}
		} else {
			localStorage.removeItem('blind_guesses');
			localStorage.removeItem('blind_guess_correct');
		}
		loading = false;
	});

	const submitGuess = async (input: string) => {
		if (!input) return;
		try {
			const res = await axios.post('/api/guess', { guess: input.toLowerCase().trim() });
			const data = res.data;
			guesses = [...guesses, data];

			if (data.isCorrect) {
				const today = new Date().toISOString().split('T')[0];
				localStorage.setItem('blind_guess_correct', today);
				localStorage.setItem('blind_guesses', JSON.stringify(guesses));
			}

			input = '';
		} catch (error) {
			if (axios.isAxiosError(error) && error.response) {
				console.error('Error response:', error.response.data);
			} else {
				console.error('Unexpected error:', error);
			}
		}
	};
</script>

<div class="flex justify-center">
	<div class="flex min-h-screen w-4xl flex-col items-center gap-y-10 bg-[rgba(0,0,0,0.7)]">
		{#if loading}
			<div class="flex h-screen w-full items-center justify-center">
				<ScratchMarkLoader />
			</div>
		{:else}
			<h1 class="p-4 text-center text-2xl font-bold">Guess the killer</h1>
			{#if !isCorrect && !hasCompletedToday}
				<GuessingInput killers={excludedKillers} {submitGuess} />
			{:else if revealDone || hasCompletedToday}
				<button
					class="mt-4 h-12 w-40 rounded-lg bg-green-600 font-bold text-white transition hover:bg-green-700"
					on:click={() => {
						goto('/guess/emotes');
					}}>Next game →</button
				>
			{/if}
			<table class="table-fixed border-separate border-spacing-2">
				<thead>
					<tr>
						{#each headers as header (header.val)}
							<th class="h-16 w-16 border-b text-center text-sm font-bold">{header.val}</th>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each guesses as guess (guess.guess)}
						<GuessResult
							guessed={guess.guess}
							serverResponse={guess}
							onDoneReveal={() => {
								if (guess.isCorrect) {
									revealDone = true;
								}
							}}
						/>
					{/each}
				</tbody>
			</table>
		{/if}
	</div>
</div>
