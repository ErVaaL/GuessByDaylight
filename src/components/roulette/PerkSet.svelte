<script lang="ts">
	import { MinusCircle, PlusCircle, Repeat } from 'lucide-svelte';
	const perkBg = '/images/perk-bg.png';
	const { styles } = $props();
	const fullStyles = `${styles} grid grid-cols-3 grid-rows-3 gap-0`;

	let side = $state(false);
	let perkSlots = $state(4);

	const flipSide = () => {
		side = !side;
	};
</script>

<div class={fullStyles}>
	<div class="col-span-3 place-self-center">
		<img src={perkBg} alt="" class="perk-icon" />
	</div>
	<div class=""><img src={perkBg} alt="" class="perk-icon" /></div>
	<div class="flex place-self-center">
		<button
			class="rounded-full border-4 border-blue-900 bg-blue-600 p-2 transition-colors duration-200 hover:cursor-pointer hover:border-blue-700 hover:bg-blue-800"
			><Repeat /></button
		>
	</div>
	<div class=""><img src={perkBg} alt="" class="perk-icon" /></div>
	<div class="col-2 grid place-self-center">
		<img src={perkBg} alt="" class="perk-icon" />
	</div>
	<div class="col-1 row-3 flex items-center justify-center">
		<button
			class="h-16 w-16 rounded-full border-4 border-gray-800 transition-colors duration-200 hover:cursor-pointer hover:border-gray-600"
			onclick={flipSide}
		>
			{#if side}
				K
			{:else}
				S
			{/if}
		</button>
	</div>
	<div class="col-3 grid h-full w-full grid-cols-3 grid-rows-3 place-self-center-safe p-2">
		<PlusCircle class="col-2 row-1" />
		<MinusCircle class="col-1 row-2" />
	</div>
</div>

<style>
	.perk-icon {
		height: 7.5rem;
		width: 7.5rem;
	}
</style>
