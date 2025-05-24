<script lang="ts">
	import { MinusCircle, PlusCircle, Repeat } from 'lucide-svelte';
	import PerkSet from '../../components/roulette/PerkSet.svelte';

	let { data } = $props();

	let perkSets = $state(1);
	let listPerkSets = $state([{ set: data.perks, styles: 'col-2 row-1' }]);

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

	/*
    TODO: Perk lottry logic

    Add global button that will initiate draw on all sets

    Each perk set will have one central button to initiate
    new perk draw for itself

    + button to flip the side killer : survivor
    + individual perk click redraws single perk
    + +/- buttons to adjust the number of perks drawn in the entire set

    pass whole perk list to PerkSet, drawing logic also there

    flipping button in this page

    +/- buttons inside PerkSet
  
   */
</script>

<div class="flex h-full grow justify-center">
	<div class="flex w-10/12 flex-col items-center bg-[rgba(0,0,0,0.7)]">
		<h1 class="p-3 text-xl font-bold">Roll for random perks</h1>
		<div class="grid grid-cols-3 grid-rows-2 place-items-center gap-8">
			{#each listPerkSets as set, i (i)}
				<PerkSet styles={set.styles} />
			{/each}
			<div class="col-2 row-2 flex flex-col items-center justify-center">
				<div>
					<button
						onclick={removeSet}
						class={`transition-colors duration-200 hover:text-gray-400 ${perkSets === 1 ? `cursor-not-allowed text-gray-400` : `cursor-pointer`}`}
						><MinusCircle />
					</button>
					<button
						onclick={addSet}
						class={`transition-colors duration-200 hover:text-gray-400 ${perkSets === 5 ? `cursor-not-allowed text-gray-400` : `cursor-pointer`}`}
						><PlusCircle />
					</button>
				</div>
				<button
					class="w-40 h-40 flex items-center justify-center rounded-full border-4 border-green-900 bg-green-600 p-4 transition-colors duration-200 hover:cursor-pointer hover:border-green-700 hover:bg-green-800"
					><Repeat size=50 /></button
				>
			</div>
		</div>
	</div>
</div>
