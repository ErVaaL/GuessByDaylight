<script lang="ts">
	import { scale } from 'svelte/transition';
	import { ArrowBigDown, ArrowBigUp } from 'lucide-svelte';
	import type { BlindKillerResponse, KillerFromDb } from '$lib/types';

	export let guessed: string;
	export let serverResponse: BlindKillerResponse;
	export let killers: KillerFromDb[] = [];
	export let onDoneReveal: () => void = () => {};

	const guessedKiller: KillerFromDb = killers.find(
		(killer) => killer.id === guessed.toLowerCase()
	)!;
	if (!guessedKiller) {
		throw new Error(`Killer with ID ${guessed} not found`);
	}

	let mounted = false;
	let delayBase = 300;

	const releaseYearDiff = serverResponse.stats.releaseYear;

	const answers = [
		{ val: guessedKiller.portrait, type: 'image', status: serverResponse.name },
		{ val: guessedKiller.sex, type: 'text', status: serverResponse.stats.sex },
		{
			val: guessedKiller.terrorRadius.map((t) => `${t}m`).join(', '),
			type: 'text',
			status: serverResponse.stats.terrorRadius,
		},
		{
			val: guessedKiller.speed.map((s) => `${s}m/s`).join(', '),
			type: 'text',
			status: serverResponse.stats.speed,
		},
		{
			val: guessedKiller.attackType.join(', '),
			type: 'text',
			status: serverResponse.stats.attackType,
		},
		{ val: guessedKiller.height, type: 'text', status: serverResponse.stats.height },
		{ val: guessedKiller.origin, type: 'text', status: serverResponse.stats.origin },
		{
			val: `${guessedKiller.releaseYear}`,
			type: 'text',
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
				class={`relative h-16 w-16 overflow-hidden rounded border text-center font-bold text-white ${setBg(cell.status)}`}
				on:introend={() => {
					if (serverResponse.isCorrect && i === answers.length - 1) {
						onDoneReveal();
					}
				}}
			>
				{#if cell.type === 'image'}
					<img
						src={cell.val}
						alt=""
						class="h-full w-full rounded object-cover"
						loading="lazy"
						on:load={() => {
							if (i === answers.length - 1) {
								onDoneReveal();
							}
						}}
					/>
				{:else if cell.type === 'text'}
					<span class="relative z-10 text-[0.85rem] font-bold">{cell.val}</span>
				{/if}

				{#if i === answers.length - 1}
					{#if releaseYearDiff === 'earlier'}
						<ArrowBigDown class="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none text-black" />
					{:else if releaseYearDiff === 'later'}
						<ArrowBigUp class="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none text-black" />
					{/if}
				{/if}
			</td>
		{/if}
	{/each}
</tr>
