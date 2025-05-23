<script lang="ts">
	import { MinusCircle, PlusCircle } from 'lucide-svelte';
	import PerkSet from '../../components/roulette/PerkSet.svelte';

	let { data } = $props();

	let perkSets = $state(1);
	let listPerkSets = $state([{ set: data.perks }]);

	const addSet = () => {
		if (perkSets < 5) {
			listPerkSets = [...listPerkSets, { set: data.perks }];
			perkSets++;
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
		<div class="flex gap-x-3">
			{#each listPerkSets as set, i (i)}
				<PerkSet />
			{/each}
		</div>
	</div>
</div>
