<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	export let suggestionList: Array<{ name: string; altNames?: string[] }> = [];
	export let query: string;
	export let onSelect: (name: string) => void;
	export let inputRef: HTMLInputElement | null = null;
	let availableHeight = 300;

	let resizeObserver: ResizeObserver;

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

	function updateAvailableHeight() {
		if (typeof window !== 'undefined' && inputRef) {
			const rect = inputRef.getBoundingClientRect();
			const spaceBelow = window.innerHeight - rect.bottom;
			availableHeight = Math.max(spaceBelow - 20, 200);
		}
	}

	onMount(() => {
		window.addEventListener('resize', updateAvailableHeight);

		if (inputRef) {
			resizeObserver = new ResizeObserver(updateAvailableHeight);
			resizeObserver.observe(inputRef);
		}

		setTimeout(() => {
			updateAvailableHeight();
		}, 0);
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('resize', updateAvailableHeight);
		}
		if (resizeObserver && inputRef) {
			resizeObserver.disconnect();
		}
	});

	function highlightMatch(name: string) {
		const lowerQuery = query.toLowerCase();
		return name.split('').map((char, i) => ({
			char,
			match: i < lowerQuery.length && char.toLowerCase() === lowerQuery[i],
		}));
	}
</script>

<div
	class="absolute top-full left-0 z-50 mt-1 w-full overflow-auto"
	style="max-height: {availableHeight}px;"
>
	{#if suggestions.length === 0 && query.trim().length > 0}
		<div class="flex h-10 w-full items-center justify-center rounded-lg bg-gray-600 text-white">
			No results found
		</div>
	{/if}
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
</div>
