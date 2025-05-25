<script lang="ts">
	import type { PerkFromDb } from '$lib/types';
	import { Img } from 'flowbite-svelte';
	import { MinusCircle, PlusCircle } from 'lucide-svelte';
	import PerkIcon from './PerkIcon.svelte';

	const { styles, perks } = $props();
	const fullStyles = `${styles} border-dotted border-2 border-red-800 grid grid-cols-3 grid-rows-3 gap-0`;

	const skull = '/images/skull.svg';
	const mouse = '/images/mouse.svg';
	const repeat = '/images/repeat.svg';

	let side = $state(false);
	let perkSlots = $state(4);
	let perkLoading = $state(false);

	const survivorPerks = $state(perks.filter((perk: PerkFromDb) => perk.side === 'survivor'));
	const killerPerks = $state(perks.filter((perk: PerkFromDb) => perk.side === 'killer'));

	let chosenPerks: (PerkFromDb | null)[] = $state([null, null, null, null]);

	const flipSide = () => (side = !side);
	const addPerkSlot = () => (perkSlots < 4 ? perkSlots++ : null);
	const removePerkSlot = () => (perkSlots > 1 ? perkSlots-- : null);

	const fisherYatesShuffle = <T,>(a: T[]): T[] => {
		const result = [...a];
		for (let i = result.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[result[i], result[j]] = [result[j], result[i]];
		}
		return result;
	};

	const drawUniquePerks = (perks: PerkFromDb[], slots: number): (PerkFromDb | null)[] => {
		const shuffled = fisherYatesShuffle(perks);
		const selected: (PerkFromDb | null)[] = shuffled.slice(0, slots);

		while (selected.length < slots) selected.push(null);

		return selected;
	};

	const redrawSinglePerk = (event: MouseEvent, index: number) => {
		if (!event.shiftKey || event.button !== 0) return;
		if (perkLoading) return;
		perkLoading = true;
		if (side) {
			chosenPerks[index] = drawUniquePerks(killerPerks, perkSlots)[index];
		} else {
			chosenPerks[index] = drawUniquePerks(survivorPerks, perkSlots)[index];
		}
		setTimeout(() => {
			perkLoading = false;
		}, 500);
	};

	export const drawPerks = () => {
		if (perkLoading) return;
		chosenPerks = side
			? drawUniquePerks(killerPerks, perkSlots)
			: drawUniquePerks(survivorPerks, perkSlots);
	};
</script>

<div class={fullStyles}>
	<button class="col-span-3 place-self-center" onclick={(e) => redrawSinglePerk(e, 0)}>
		<PerkIcon perk={chosenPerks[0] || null} disabled={false} />
	</button>
	<button class="" onclick={(e) => redrawSinglePerk(e, 1)}>
		<PerkIcon perk={chosenPerks[1] || null} disabled={perkSlots < 2} />
	</button>
	<div class="flex place-self-center">
		<button
			class="hover:bg-from-red-600 focus:outline-none rounded-full border-4 border-red-900 bg-gradient-to-r from-red-500 to-red-700 p-2 transition-colors duration-200 hover:cursor-pointer hover:border-red-700 hover:to-red-800"
			title="Draw perks for this set"
			onclick={drawPerks}><img src={repeat} alt="" class="h-6 w-6" /></button
		>
	</div>
	<button class="" onclick={(e) => redrawSinglePerk(e, 2)}>
		<PerkIcon perk={chosenPerks[2] || null} disabled={perkSlots < 3} />
	</button>
	<button class="col-2 grid place-self-center" onclick={(e) => redrawSinglePerk(e, 3)}>
		<PerkIcon perk={chosenPerks[3] || null} disabled={perkSlots < 4} />
	</button>
	<div class="col-1 row-3 flex items-center justify-center">
		<button
			class="flex h-16 w-16 items-center justify-center rounded-full border-4 border-gray-800 transition-colors duration-200 hover:cursor-pointer hover:border-gray-600"
			title={side ? 'Currently drawing killer perks' : 'Currently drawing survivor perks'}
			onclick={flipSide}
		>
			{#if side}
				<Img src={skull} alt="K" class="max-w-10" />
			{:else}
				<Img src={mouse} alt="S" class="max-w-10" />
			{/if}
		</button>
	</div>
	<div class="col-3 grid h-full w-full grid-cols-3 grid-rows-3 place-self-center-safe p-2">
		<button
			class={`col-2 row-1 flex items-center justify-center transition-colors duration-200 hover:text-gray-400 ${perkSlots === 4 ? `cursor-not-allowed text-gray-400` : `cursor-pointer`}`}
			title="Increase how many perks to draw"
			onclick={addPerkSlot}
		>
			<PlusCircle />
		</button>

		<button
			class={`col-1 row-2 flex items-center justify-center transition-colors duration-200 hover:text-gray-400 ${perkSlots === 1 ? `cursor-not-allowed text-gray-400` : `cursor-pointer`}`}
			title="Decrease how many perks to draw"
			onclick={removePerkSlot}
		>
			<MinusCircle />
		</button>
	</div>
</div>
