<script lang="ts">
	export let killers: { name: string; altNames: string[] }[] = [];
	export let query: string;
	export let onSelect: (name: string) => void;

	type KillerMatches = {
		name: string;
		altNames: string[];
	};
	let suggestions: KillerMatches[] = [];

	$: updateSuggestions(query, killers);

	function updateSuggestions(query: string, killers: KillerMatches[]) {
		const lower = query.toLowerCase();
		if (!lower) {
			suggestions = [];
			return;
		}

		const regex = new RegExp(lower, 'i');
		suggestions = killers.filter(
			(killer) =>
				regex.test(killer.name.toLowerCase()) ||
				killer.altNames.some((name) => regex.test(name.toLowerCase()))
		);
	}
</script>

{#if suggestions.length > 0}
	<div class="flex flex-col gap-y-0.5">
		{#each suggestions as killer (killer.name)}
			<button
				class="h-full w-full cursor-pointer rounded-lg bg-gray-600 p-2 text-left hover:bg-gray-800"
				on:click={() => onSelect(killer.name)}
			>
				<span class="text-white">
					{#each killer.name.split('') as char, i (i)}
						<span
							class={i < query.length && char.toLowerCase() === query[i].toLowerCase()
								? 'text-yellow-400'
								: ''}
						>
							{char}
						</span>
					{/each}
				</span>
			</button>
		{/each}
	</div>
{/if}
