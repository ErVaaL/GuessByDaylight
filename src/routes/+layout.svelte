<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import TimerTillReset from '../components/universal/TimerTillReset.svelte';
	import { cleanLocalStorage } from '$lib/utils/cleanLocalStorage';

	let { children, data } = $props();

	onMount(() => {
		const lastReset = localStorage.getItem('lastResetDate');
		if (lastReset != data.today) {
			cleanLocalStorage(data.today);
		}
	});
</script>

<div
	class="flex h-full min-h-screen flex-col bg-black font-sans text-white"
	style="background-image: url('/images/dbd-background.webp'); background-size: cover; background-position: center;"
>
	<div class="flex h-full grow justify-center">
		<div class="flex w-4xl flex-col items-center gap-y-8 bg-[rgba(0,0,0,0.7)]">
			<h1 class="mt-2 px-4 text-center text-3xl font-bold">Guess by Daylight</h1>
			<TimerTillReset today={data.today} />
			{@render children?.()}
		</div>
	</div>
	<footer
		class="relative border-t border-gray-800 bg-black p-0 text-center text-xs text-gray-400 opacity-70"
	>
		<p class="px-2 pt-2">
			This is an unofficial fan-made game inspired by <strong>Dead by Daylight</strong>.<br />
			All characters, icons, perks, and associated media belong to
			<strong>Behaviour Interactive Inc.</strong>.<br />
			No affiliation or endorsement is implied.
		</p>
		<p class="px-2 pb-2 text-left font-bold text-gray-200">version: beta-1.4</p>
	</footer>
</div>
