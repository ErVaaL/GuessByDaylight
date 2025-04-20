<script lang="ts">
	import { scale } from 'svelte/transition';
	import { killers } from '$lib/data/killers';
	import type { KillerBlind, BlindKillerResponse } from '$lib/types';

	export let guessed: string;
	export let serverResponse: BlindKillerResponse;
	export let onDoneReveal: () => void = () => {};

	const guessedKiller: KillerBlind = killers.find((killer) => killer.id === guessed.toLowerCase())!;
	if (!guessedKiller) {
		throw new Error(`Killer with ID ${guessed} not found`);
	}

	let mounted = false;
	let delayBase = 300;

	const releaseYearDiff =
		serverResponse.stats.releaseYear === 'earlier'
			? '↓'
			: serverResponse.stats.releaseYear === 'later'
				? '↑'
				: '';

	const answers = [
		{ val: guessedKiller.name, status: serverResponse.name },
		{ val: guessedKiller.sex, status: serverResponse.stats.sex },
		{
			val: guessedKiller.terrorRadius.map((t) => `${t}m`).join('m, '),
			status: serverResponse.stats.terrorRadius,
		},
		{
			val: guessedKiller.speed.map((s) => `${s}m/s`).join(', '),
			status: serverResponse.stats.speed,
		},
		{ val: guessedKiller.attackType.join(', '), status: serverResponse.stats.attackType },
		{ val: guessedKiller.height, status: serverResponse.stats.height },
		{ val: guessedKiller.origin, status: serverResponse.stats.origin },
		{
			val: `${guessedKiller.releaseYear} ${releaseYearDiff}`,
			status: serverResponse.stats.releaseYear,
		},
	];

	import { onMount } from 'svelte';
	onMount(() => {
		mounted = true;
	});

	const setBg = (indicator: string) => {
		switch (indicator) {
			case 'correct':
				return 'bg-green-500';
			case 'incorrect':
			case 'earlier':
			case 'later':
				return 'bg-red-500';
			case 'partial':
				return 'bg-orange-400';
		}
	};
</script>

<tr>
	{#each answers as cell, i (i)}
		{#if mounted}
			<td
				in:scale={{ delay: i * delayBase, duration: 200 }}
				class={`h-16 w-16 rounded border text-center text-xs font-bold text-white ${setBg(cell.status)}`}
				on:introend={() => {
					if (serverResponse.isCorrect && i === answers.length - 1) {
						onDoneReveal();
					}
				}}
			>
				{cell.val}
				{#if i === answers.length - 1 && releaseYearDiff}
					<span class="pointer-events-none absolute top-1 right-1 text-sm opacity-40">
						{releaseYearDiff}
					</span>
				{/if}
			</td>
		{/if}
	{/each}
</tr>
