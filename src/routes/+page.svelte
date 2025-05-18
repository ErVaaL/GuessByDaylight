<script lang="ts">
	import { goto } from '$app/navigation';

	const handleStartGame = () => {
		goto('/guess/blind');
	};
</script>

<div class="flex flex-grow flex-col gap-y-64 self-center">
	<div class="m-auto grow p-10">
		<button
			class="h-20 w-44 rounded-lg bg-gray-600 transition-all duration-150 hover:cursor-pointer hover:bg-gray-800"
			onclick={handleStartGame}>Let's play</button
		>
	</div>
</div>
