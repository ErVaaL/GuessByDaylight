<script lang="ts">
	import { goto } from '$app/navigation';

	export let location: string;
	export let text: string = 'Next game →';
</script>

<button
	class="mt-4 h-12 w-40 rounded-lg bg-green-600 font-bold text-white transition hover:cursor-pointer hover:bg-green-700"
	on:click={() => goto(location)}
>
	{text}
</button>
