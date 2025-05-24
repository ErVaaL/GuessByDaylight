<script lang="ts">
	import { goto } from '$app/navigation';
	import TimerTillReset from '../components/universal/TimerTillReset.svelte';

	let { data } = $props();

	const handleStartGame = () => {
		goto('/guess/blind');
	};
</script>

<div class="flex h-full grow justify-center">
	<div class="flex w-4xl flex-col items-center gap-y-8 bg-[rgba(0,0,0,0.7)]">
		<h1 class="mt-2 px-4 text-center text-3xl font-bold">Guess by Daylight</h1>
		<TimerTillReset today={data.today} />
		<div class="flex flex-grow flex-col gap-y-64 self-center">
			<div class="m-auto grow p-10">
				<button
					class="h-20 w-44 rounded-lg bg-gray-600 transition-all duration-150 hover:cursor-pointer hover:bg-gray-800"
					onclick={handleStartGame}>Let's play</button
				>
			</div>
		</div>
	</div>
</div>
