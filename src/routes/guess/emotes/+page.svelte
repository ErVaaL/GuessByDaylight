<script lang="ts">
	import GuessingInput from "../../../components/universal/GuessingInput.svelte";

</script>

<h1 class="p-4 text-2xl font-bold">Guess the killer from the emotes</h1>
<div class="grid h-40 w-4/5 grid-cols-3 items-center border-y-2 border-y-red-300">
	<button class="">placeholder</button>
	<button class="">placeholder</button>
	<button class="">placeholder</button>
</div>
<GuessingInput killers={excludedKillers} {submitGuess} />
