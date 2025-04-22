<script lang="ts">
	import '../app.css';
	import ScratchMarkLoader from '../components/ui/ScratchMarkLoader.svelte';
	import { loading } from '$lib/stores/loading';
	import { onDestroy, onMount } from 'svelte';

	let isLoading = true;
	const loadingStore = loading.subscribe((value: boolean) => {
		isLoading = value;
	});
	onDestroy(loadingStore);

	onMount(() => {
		const today = new Date().toISOString().split('T')[0];
		const lastResetDate = localStorage.getItem('lastResetDate');
		if (lastResetDate !== today) {
			localStorage.removeItem('emotes_guess');
			localStorage.removeItem('emotes_guess_correct');
			localStorage.removeItem('blind_guesses');
			localStorage.removeItem('blind_guess_correct');
			localStorage.removeItem('survivor_perks_guess');
			localStorage.removeItem('survivor_perks_guess_correct');
			localStorage.removeItem('killer_perks_guess');
			localStorage.removeItem('killer_perks_guess_correct');
			localStorage.removeItem('terror_guess');
			localStorage.removeItem('terror_guess_correct');
			localStorage.removeItem('emotes_revealed');
			localStorage.removeItem('survivor_perk_obscure_level');
			localStorage.removeItem('killer_perk_obscure_level');
			localStorage.removeItem('terror_layer_unlocked');
			localStorage.removeItem('perk_random_tilt');

			localStorage.setItem('lastResetDate', today);
		}
		loading.set(false);
	});
</script>

<div
	class="min-h-screen bg-black font-sans text-white"
	style="background-image: url('/images/dbd-background.webp'); background-size: cover; background-position: center;"
>
	<main class="grow">
		<div class="flex justify-center">
			<div class="flex min-h-screen w-4xl flex-col items-center gap-y-10 bg-[rgba(0,0,0,0.7)]">
				{#if isLoading}
					<div class="flex h-screen w-full items-center justify-center">
						<ScratchMarkLoader />
					</div>
				{:else}
					<slot />
				{/if}
			</div>
		</div>
	</main>
	<footer
		class="fixed right-0 bottom-0 left-0 border-t border-gray-800 bg-black px-4 py-6 text-center text-xs text-gray-400 opacity-70"
	>
		<p>
			This is an unofficial fan-made game inspired by <strong>Dead by Daylight</strong>.<br />
			All characters, icons, perks, and associated media belong to
			<strong>Behaviour Interactive Inc.</strong>.<br />
			No affiliation or endorsement is implied.
		</p>
	</footer>
</div>
