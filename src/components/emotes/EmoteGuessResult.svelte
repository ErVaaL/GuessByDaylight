<script lang="ts">
	import { scale } from 'svelte/transition';
	import type { EmoteKillerResponse } from '$lib/types';

	export let guessed: string;
	export let serverResponse: EmoteKillerResponse;
	export let onDoneReveal: () => void = () => {};

	const answerColor = (indicator: boolean) => {
		switch (indicator) {
			case true:
				return 'bg-green-500';
			case false:
				return 'bg-red-500';
		}
	};
</script>

{#if serverResponse.name !== '' && serverResponse.name.toLowerCase() === guessed}
	<div
		class={`flex h-10 w-64 items-center justify-center rounded-lg ${answerColor(
			serverResponse.isCorrect
		)} text-white`}
		in:scale={{ duration: 200 }}
		on:introend={() => {
			if (serverResponse.isCorrect) {
				onDoneReveal();
			}
		}}
	>
		{serverResponse.name}
	</div>
{/if}
