<script lang="ts">
	import type { PerkFromDb } from '$lib/types';
	import { Img } from 'flowbite-svelte';
	import { MinusCircle, PlusCircle } from 'lucide-svelte';
	import PerkIcon from './PerkIcon.svelte';

	const { styles, perks } = $props();
	const fullStyles = `${styles} w-64 aspect-square border-dotted border-2 border-red-800 grid grid-cols-3 grid-rows-3 gap-0`;

	const skull = '/images/skull.svg';
	const mouse = '/images/surv.svg';
	const repeat = '/images/repeat.svg';
	const lockOpen = '/images/lock-open.svg';
	const lockClosed = '/images/lock-closed.svg';

	let side = $state(false);
	let perkSlots = $state(4);
	let perkLoading = $state(false);

	const survivorPerks = $state(perks.filter((perk: PerkFromDb) => perk.side === 'survivor'));
	const killerPerks = $state(perks.filter((perk: PerkFromDb) => perk.side === 'killer'));

	let chosenPerks: (PerkFromDb | null)[] = $state([null, null, null, null]);
	let excludePerksCount = $state(0);
	let excludedSurvivorPerks: PerkFromDb[] = $state(survivorPerks);
	let excludedKillerPerks: PerkFromDb[] = $state(killerPerks);
	let excludedPerks: (PerkFromDb | null)[] = $state([]);

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

	const updateExcludedPools = () => {
		excludedSurvivorPerks = survivorPerks.filter(
			(perk: PerkFromDb) => !excludedPerks.includes(perk)
		);
		excludedKillerPerks = killerPerks.filter((perk: PerkFromDb) => !excludedPerks.includes(perk));
	};

	const drawUniquePerks = (perks: PerkFromDb[], slots: number): (PerkFromDb | null)[] => {
		const shuffled = fisherYatesShuffle(perks);
		const selected: (PerkFromDb | null)[] = shuffled.slice(0, slots);

		if (excludePerksCount > 0) {
			for (let i = 0; i < excludePerksCount; i++) {
				if (selected[i] !== null) excludedPerks = [...excludedPerks, selected[i]];
			}
		}
		updateExcludedPools();

		while (selected.length < slots) selected.push(null);

		return selected;
	};

	const redrawSinglePerk = (event: MouseEvent, index: number) => {
		if (!event.shiftKey || event.button !== 0) return;
		if (perkLoading) return;
		perkLoading = true;
		if (side) {
			chosenPerks[index] = drawUniquePerks(excludedKillerPerks, perkSlots)[index];
		} else {
			chosenPerks[index] = drawUniquePerks(excludedSurvivorPerks, perkSlots)[index];
		}
		setTimeout(() => {
			perkLoading = false;
		}, 500);
	};

	const switchPerkExclude = () =>
		excludePerksCount < 4 ? excludePerksCount++ : (excludePerksCount = 0);

	export const drawPerks = () => {
		if (perkLoading) return;
		if (excludedSurvivorPerks.length < 4 || excludedKillerPerks.length < 4) {
			excludedSurvivorPerks = survivorPerks;
			excludedKillerPerks = killerPerks;
			excludedPerks = [];
		}
		chosenPerks = side
			? drawUniquePerks(excludedKillerPerks, perkSlots)
			: drawUniquePerks(excludedSurvivorPerks, perkSlots);
	};
</script>

<div class={fullStyles}>
	<button
		class="col-1 row-1 flex h-14 w-14 items-center justify-center place-self-center rounded-full border-4 border-gray-800 transition-colors duration-200 hover:cursor-pointer hover:border-gray-600"
		onclick={switchPerkExclude}
	>
		<img src={excludePerksCount > 0 ? lockClosed : lockOpen} alt="" class="h-9 w-9" />
		{#if excludePerksCount > 0}
			<span class="absolute translate-y-1/4 font-bold text-black">{excludePerksCount}</span>
		{/if}
	</button>
	<button class="place-self-center" onclick={(e) => redrawSinglePerk(e, 0)}>
		<PerkIcon perk={chosenPerks[0] || null} disabled={false} />
	</button>
	<div class="col-3 row-1"></div>
	<button class="" onclick={(e) => redrawSinglePerk(e, 1)}>
		<PerkIcon perk={chosenPerks[1] || null} disabled={perkSlots < 2} />
	</button>
	<div class="flex place-self-center">
		<button
			class="hover:bg-from-red-600 rounded-full border-4 border-red-900 bg-gradient-to-r from-red-500 to-red-700 p-2 transition-colors duration-200 hover:cursor-pointer hover:border-red-700 hover:to-red-800 focus:outline-none"
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
			class="flex h-12 w-12 items-center justify-center rounded-full border-4 border-gray-800 transition-colors duration-200 hover:cursor-pointer hover:border-gray-600"
			title={side ? 'Currently drawing killer perks' : 'Currently drawing survivor perks'}
			onclick={flipSide}
		>
			{#if side}
				<Img src={skull} alt="K" class="max-w-8" />
			{:else}
				<Img src={mouse} alt="S" class="max-w-8" />
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
