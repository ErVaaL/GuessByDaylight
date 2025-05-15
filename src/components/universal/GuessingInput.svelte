<script lang="ts">
	import type { KillerFromDb, PerkFromDb } from '$lib/types';
	import ScratchMarkLoader from '../ui/ScratchMarkLoader.svelte';
	import SuggestionList from './SuggestionList.svelte';
	export let list: Array<{ name: string; altNames?: string[] }> = [];
	export let submitGuess: (item: KillerFromDb | PerkFromDb) => void;
	let input = '';
	let loading = false;
</script>

<div class="flex justify-center gap-1">
	<div class="relative flex flex-col">
		{#if loading}
			<ScratchMarkLoader />
		{:else}
			<input
				type="text"
				bind:value={input}
				placeholder="Enter your guess"
				class="my-4 h-10 w-64 rounded-lg bg-gray-600 p-2 text-white"
			/>
			<SuggestionList
				suggestionList={list}
				query={input}
				onSelect={(name) => {
					loading = true;
					input = name;
					const item = list.find((item) => item.name === name);
					submitGuess(item);
					input = '';
					loading = false;
				}}
			/>
		{/if}
	</div>

	<button
		class="my-4 h-10 w-10 rounded-lg bg-gray-600 transition-all duration-150 hover:cursor-pointer hover:bg-gray-800"
		on:click={() => {
			const item = list.find((item) => item.name === input);
			submitGuess(item);
		}}>→</button
	>
</div>
