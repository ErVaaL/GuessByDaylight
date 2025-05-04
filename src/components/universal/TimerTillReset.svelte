<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	export let today: string;

	let hours = 0;
	let minutes = 0;
	let seconds = 0;
	let intervalId: ReturnType<typeof setInterval>;

	const calculateTime = () => {
		const now = new Date();
		const target = new Date(`${today}T00:00:00Z`);
		target.setUTCDate(target.getUTCDate() + 1);

		const diffMs = target.getTime() - now.getTime();
		const diffSeconds = Math.floor(diffMs / 1000);

		if (diffSeconds <= 0) {
			window.location.href = '/';
			return;
		}

		hours = Math.floor(diffSeconds / 3600);
		minutes = Math.floor((diffSeconds % 3600) / 60);
		seconds = diffSeconds % 60;
	};

	onMount(() => {
		calculateTime();
		intervalId = setInterval(() => {
			calculateTime();
		}, 1000);
	});

	onDestroy(() => {
		clearInterval(intervalId);
	});
</script>

<div class="flex flex-col items-center text-center">
	<p class="text-green-200">New guesses in:</p>
	<p>
		{hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}:{seconds
			.toString()
			.padStart(2, '0')}
	</p>
</div>
