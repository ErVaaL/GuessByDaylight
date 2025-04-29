<script lang="ts">
	import '../app.css';
	import { cleanLocalStorage } from '$lib/utils/cleanLocalStorage';
	import { loading } from '$lib/stores/loading';

	let { children, data } = $props();

	$effect(() => {
		const serverDate = data.answers_date;
		const lastResetDate = localStorage.getItem('lastResetDate');
		if (lastResetDate !== serverDate) {
			cleanLocalStorage(serverDate);
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
				{@render children?.()}
			</div>
		</div>
	</main>
	<footer
		class="fixed right-0 bottom-0 left-0 border-t border-gray-800 bg-black p-0 text-center text-xs text-gray-400 opacity-70"
	>
		<p class="px-2 pt-2">
			This is an unofficial fan-made game inspired by <strong>Dead by Daylight</strong>.<br />
			All characters, icons, perks, and associated media belong to
			<strong>Behaviour Interactive Inc.</strong>.<br />
			No affiliation or endorsement is implied.
		</p>
    <p class="text-left px-2 pb-2 text-gray-200 font-bold">version: beta-1.0</p>
	</footer>
</div>
