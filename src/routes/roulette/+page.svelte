<script lang="ts">
	import { MinusCircle, PlusCircle, Repeat } from 'lucide-svelte';
	import PerkSet from '../../components/roulette/PerkSet.svelte';

	interface PerkSetComponent {
		drawPerks: () => void;
	}

	let { data } = $props();

	let perkSets = $state(1);
	let listPerkSets = $state([{ set: data.perks, styles: 'col-2 row-1' }]);
	let perkSetRefs = $state<Array<PerkSetComponent | null>>([]);

	const addSet = () => {
		switch (perkSets) {
			case 1:
				listPerkSets = [...listPerkSets, { set: data.perks, styles: 'col-1 row-1' }];
				perkSets++;
				break;
			case 2:
				listPerkSets = [...listPerkSets, { set: data.perks, styles: 'col-3 row-1' }];
				perkSets++;
				break;
			case 3:
				listPerkSets = [...listPerkSets, { set: data.perks, styles: 'col-1 row-2' }];
				perkSets++;
				break;
			case 4:
				listPerkSets = [...listPerkSets, { set: data.perks, styles: 'col-3 row-2' }];
				perkSets++;
				break;
			default:
				break;
		}
	};

	const removeSet = () => {
		if (perkSets > 1) {
			listPerkSets.pop();
			perkSets--;
		}
	};

	const drawAllPerks = () => {
		for (const ref of perkSetRefs) {
			ref?.drawPerks();
		}
	};
</script>

<div class="flex h-full grow justify-center">
	<div class="flex w-10/12 flex-col items-center bg-[rgba(0,0,0,0.7)]">
		<h1 class="p-3 text-xl font-bold">Roll for random perks</h1>
		<div class="grid grid-cols-3 grid-rows-2 place-items-center gap-8">
			{#each listPerkSets as set, i (i)}
				<PerkSet styles={set.styles} perks={data.perks} bind:this={perkSetRefs[i]} />
			{/each}
			<div class="col-2 row-2 flex flex-col items-center justify-center">
				<div>
					<button
						onclick={removeSet}
						title="Remove perk set"
						class={`transition-colors duration-200 hover:text-gray-400 ${perkSets === 1 ? `cursor-not-allowed text-gray-400` : `cursor-pointer`}`}
						><MinusCircle />
					</button>
					<button
						onclick={addSet}
						title="Add perk set"
						class={`transition-colors duration-200 hover:text-gray-400 ${perkSets === 5 ? `cursor-not-allowed text-gray-400` : `cursor-pointer`}`}
						><PlusCircle />
					</button>
				</div>
				<button
					class="hover:bg-from-red-600 focus:outsine-none flex h-20 w-40 items-center justify-center rounded-full border-4 border-red-900 bg-gradient-to-r from-red-500 to-red-700 p-4 text-2xl font-bold transition-colors duration-200 hover:cursor-pointer hover:border-red-700 hover:to-red-800"
					onclick={drawAllPerks}
					title="Draw perks for all sets">DRAW</button
				>
				<p class="p-2">SHIFT + CLICK to redraw a single perk</p>
			</div>
		</div>
	</div>
</div>
