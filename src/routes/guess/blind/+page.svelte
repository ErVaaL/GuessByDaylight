<script lang="ts">
	import { onMount } from 'svelte';
	import { killers } from '$lib/data/killers';
	import axios from 'axios';
	import SuggestionList from '../../../components/blind/SuggestionList.svelte';
	import type { KillerResponse } from '$lib/types';
	import GuessResult from '../../../components/blind/GuessResult.svelte';

	type Killer = {
		name: string;
		altNames: string[];
	};

	let input = '';
	let guesses: KillerResponse[] = [];

	const killerMatches: Killer[] = killers.map((killer) => ({
		name: killer.name,
		altNames: killer.altNames
	}));

	async function submitGuess() {
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
	}
</script>

<div class="flex justify-center">
	<div class="flex min-h-screen w-4xl flex-col items-center gap-y-10 bg-[rgba(0,0,0,0.7)]">
		<h1 class="p-4 text-center text-2xl font-bold">Guess the killer</h1>
		<div class="flex justify-center gap-1">
			<div class="flex flex-col">
				<input
					type="text"
					bind:value={input}
					placeholder="Enter your guess"
					class="my-4 h-10 w-64 rounded-lg bg-gray-600 p-2 text-white"
				/>
				<SuggestionList
					killers={killerMatches}
					query={input}
					onSelect={(name) => {
						input = name;
						submitGuess();
					}}
				/>
			</div>

			<button
				class="my-4 h-10 w-10 rounded-lg bg-gray-600 transition-all duration-150 hover:cursor-pointer hover:bg-gray-800"
				on:click={submitGuess}>→</button
			>
		</div>
		<table class="table-fixed border-separate border-spacing-2">
			<thead class="">
				<tr class="">
					<th class="h-16 w-16 border-b text-center text-sm font-bold ">Name</th>
					<th class="h-16 w-16 border-b text-center text-sm font-bold ">Sex</th>
					<th class="h-16 w-16 border-b text-center text-sm font-bold ">Terror Radius</th>
					<th class="h-16 w-16 border-b text-center text-sm font-bold ">Speed</th>
					<th class="h-16 w-16 border-b text-center text-sm font-bold ">Attack Type</th>
					<th class="h-16 w-16 border-b text-center text-sm font-bold ">Height</th>
					<th class="h-16 w-16 border-b text-center text-sm font-bold ">Origin</th>
					<th class="h-16 w-16 border-b text-center text-sm font-bold ">Release Year</th>
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
