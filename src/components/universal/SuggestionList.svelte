<script lang="ts">
	export let suggestionList: Array<{ name: string; altNames?: string[] }> = [];
	export let query: string;
	export let onSelect: (name: string) => void;

	$: suggestions =
		query.trim().length === 0
			? []
			: suggestionList.filter((item) => {
					const lower = query.toLowerCase();
					return (
						item.name.toLowerCase().includes(lower) ||
						item.altNames?.some((alt: string) => alt.toLowerCase().includes(lower))
					);
				});

	function highlightMatch(name: string) {
		const lowerQuery = query.toLowerCase();
		return name.split('').map((char, i) => ({
			char,
			match: i < lowerQuery.length && char.toLowerCase() === lowerQuery[i],
		}));
	}
</script>

{#if suggestions.length > 0}
	<div class="flex flex-col gap-y-0.5">
		{#each suggestions as item (item.name)}
			<button
				class="h-full w-full cursor-pointer rounded-lg bg-gray-600 p-2 text-left hover:bg-gray-800"
				on:click={() => onSelect(item.name)}
			>
				<span class="text-white">
					{#each highlightMatch(item.name) as { char, match }, i (i)}
						<span class={match ? 'text-yellow-400' : ''}>
							{char}
						</span>
					{/each}
				</span>
			</button>
		{/each}
	</div>
{/if}
