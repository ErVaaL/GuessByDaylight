<script lang="ts">
	import SuggestionList from './SuggestionList.svelte';
	export let list: Array<{ name: string; altNames?: string[] }> = [];
	export let submitGuess: (input: string) => void;
	let input = '';
</script>

<div class="flex justify-center gap-1">
	<div class="flex flex-col">
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
				input = name;
				submitGuess(input);
				input = '';
			}}
		/>
	</div>

	<button
		class="my-4 h-10 w-10 rounded-lg bg-gray-600 transition-all duration-150 hover:cursor-pointer hover:bg-gray-800"
		on:click={() => submitGuess(input)}>→</button
	>
</div>
