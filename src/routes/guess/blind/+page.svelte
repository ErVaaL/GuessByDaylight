<script lang="ts">
	import { killers } from '$lib/data/killers';
	import axios from 'axios';
	import type { KillerResponse } from '$lib/types';
	import GuessResult from '../../../components/blind/GuessResult.svelte';
	import GuessingInput from '../../../components/blind/GuessingInput.svelte';

	type Killer = {
		name: string;
		altNames: string[];
	};

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

	const killerMatches: Killer[] = killers.map((killer) => ({
		name: killer.name,
		altNames: killer.altNames,
	}));

	$: guessedKillerIds = guesses.map((guess) => guess.name.toLowerCase());

	$: excludedKillers = killerMatches.filter(
		(killer) => !guessedKillerIds.includes(killer.name.toLowerCase())
	);

	const submitGuess = async (input: string) => {
		if (!input) return;
		try {
			const res = await axios.post('/api/guess', { guess: input.toLowerCase().trim() });
			const data = res.data;
			guesses = [...guesses, data];
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
		<h1 class="p-4 text-center text-2xl font-bold">Guess the killer</h1>
		<GuessingInput killers={excludedKillers} {submitGuess} />
		<table class="table-fixed border-separate border-spacing-2">
			<thead class="">
				<tr class="">
					{#each headers as header (header.val)}
						<th class="h-16 w-16 border-b text-center text-sm font-bold">{header.val}</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each guesses as guess (guess.guess)}
					<GuessResult guessed={guess.guess} serverResponse={guess} />
				{/each}
			</tbody>
		</table>
	</div>
</div>
