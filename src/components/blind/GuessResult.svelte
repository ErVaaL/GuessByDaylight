<script lang="ts">
	import { killers } from '$lib/data/killers';
	import type { KillerBlind, KillerResponse } from '$lib/types';

	export let guessed: string;
	export let serverResponse: KillerResponse;

	const guessedKiller: KillerBlind = killers.find((killer) => killer.id === guessed.toLowerCase())!;
	if (!guessedKiller) {
		throw new Error(`Killer with ID ${guessed} not found`);
	}
	console.log(`Guessed: ${guessedKiller}`);

	const setBg = (indicator: string) => {
		switch (indicator) {
			case 'correct':
				return 'bg-green-500';
			case 'incorrect':
				return 'bg-red-500';
			case 'partial':
				return 'bg-orange-400';
		}
	};
</script>

<tr>
	<td
		class={`h-16 w-16 border rounded text-center text-xs font-bold text-white ${setBg(serverResponse.name)}`}
		>{guessedKiller.name}</td
	>
	<td
		class={`h-16 w-16 border rounded text-center text-xs font-bold text-white ${setBg(serverResponse.stats.sex)}`}
	>
		{guessedKiller.sex}
	</td>

	<td
		class={`h-16 w-16 border rounded text-center text-xs font-bold text-white ${setBg(serverResponse.stats.terrorRadius)}`}
		>{guessedKiller.terrorRadius.map((t) => `${t}m`).join('m, ')}</td
	>
	<td
		class={`h-16 w-16 border rounded text-center text-xs font-bold text-white ${setBg(serverResponse.stats.speed)}`}
		>{guessedKiller.speed.map((s) => `${s}m/s`).join(', ')}</td
	>
	<td
		class={`h-16 w-16 border rounded text-center text-xs font-bold text-white ${setBg(serverResponse.stats.attackType)}`}
		>{guessedKiller.attackType.join(', ')}</td
	>
	<td
		class={`h-16 w-16 border rounded text-center text-xs font-bold text-white ${setBg(serverResponse.stats.height)}`}
		>{guessedKiller.height}</td
	>
	<td
		class={`h-16 w-16 border rounded text-center text-xs font-bold text-white ${setBg(serverResponse.stats.origin)}`}
		>{guessedKiller.origin}</td
	>
	<td
		class={`h-16 w-16 border rounded text-center text-xs font-bold text-white ${setBg(serverResponse.stats.releaseYear)}`}
		>{guessedKiller.releaseYear}</td
	>
</tr>
