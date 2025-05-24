<script lang="ts">
	import TimerTillReset from '../../components/universal/TimerTillReset.svelte';

	let { children, data } = $props();
</script>

<div class="flex h-full grow justify-center">
	<div class="flex w-4xl flex-col items-center gap-y-8 bg-[rgba(0,0,0,0.7)]">
		<h1 class="mt-2 px-4 text-center text-3xl font-bold">Guess by Daylight</h1>
		<TimerTillReset today={data.today} />
		{@render children?.()}
	</div>
</div>
