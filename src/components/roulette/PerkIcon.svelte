<script lang="ts">
	import type { PerkFromDb } from '$lib/types';
	import { scale } from 'svelte/transition';

	let { perk, disabled }: { perk: PerkFromDb | null; disabled: boolean } = $props();
	const perkBg = '/images/perk-bg.png';
	const blankPerkBg = '/images/perk-blank-bg.png';
	const blankPerk = '/images/questionmark.svg';
	const cross = '/images/cross.svg';

	let imageLoaded = $state(false);

	let imageSrc = $derived.by(() => {
		if (disabled) return cross;
		if (perk === null) return blankPerk;
		return perk.icon;
	});

	$effect(() => {
		imageLoaded = false;
	});
</script>

<div
	class="relative flex h-[5.5rem] w-[5.5rem] items-center justify-center"
	title={perk?.name ?? ''}
>
	<img src={disabled ? blankPerkBg : perkBg} alt="" class="perk-icon" />
	<img
		src={imageSrc}
		alt=""
		class={`absolute ${perk !== null ? 'h-20 w-20' : 'h-8 w-8'} ${imageLoaded ? '' : 'opacity-0'}`}
		onload={() => (imageLoaded = true)}
		in:scale={{ duration: 200 }}
	/>
</div>

<style>
	.perk-icon {
		height: 100%;
		width: 100%;
	}
</style>
