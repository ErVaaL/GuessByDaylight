<script lang="ts">
	import BlindGuessResult from '../../../components/blind/BlindGuessResult.svelte';
	import GuessingInput from '../../../components/universal/GuessingInput.svelte';
	import { useGuessingGame } from '$lib/utils/useGuessingGame';
	import { useExcludedKillers } from '$lib/utils/useExcludedKillers';
	import { loading } from '$lib/stores/loading';
	import { ENDPOINTS } from '$lib/endopoints';
	import GoNext from '../../../components/universal/GoNext.svelte';
	import type { BlindKillerResponse } from '$lib/types';
	import type { PageProps } from './$types';
	import ScratchMarkLoader from '../../../components/ui/ScratchMarkLoader.svelte';
	import CorrectPortrait from '../../../components/universal/CorrectPortrait.svelte';

	const blindGuessEndpoint = `${ENDPOINTS.BASE_GUESS}/blind`;

	let { data }: PageProps = $props();

	const { guesses, hasCompletedToday, submitGuess } = useGuessingGame({
		apiEndpoint: blindGuessEndpoint,
		storageKey: 'blind_guesses',
		storageDateKey: 'blind_guess_correct',
	});

	const headers = [
		{ val: 'Killer' },
		{ val: 'Sex' },
		{ val: 'Terror Radius' },
		{ val: 'Speed' },
		{ val: 'Attack Type' },
		{ val: 'Height' },
		{ val: 'Origin' },
		{ val: 'Release Year' },
	];

	let revealDone = $state(false);
	let isCorrect = $state(false);

	const { excludedKillers } = useExcludedKillers(guesses, data.killers);

	$effect(() => {
		isCorrect = $guesses.some((g) => g.isCorrect);
		loading.set(false);
	});
</script>

<h1 class="p-4 text-center text-2xl font-bold">Guess the killer</h1>
<div class="flex h-min flex-col items-center">
	{#if $loading}
		<ScratchMarkLoader />
	{:else if !isCorrect && !$hasCompletedToday}
		<GuessingInput list={$excludedKillers} {submitGuess} />
	{:else if revealDone || $hasCompletedToday}
		<CorrectPortrait guessed={$guesses[$guesses.length - 1].guess} owners={data.killers} />
		<GoNext location="/guess/emotes" />
	{/if}
</div>

<table class="border-separate border-spacing-2 overflow-auto">
	<thead>
		<tr>
			{#each headers as header (header.val)}
				<th class="h-16 w-16 border-b text-center text-sm font-bold">{header.val}</th>
			{/each}
		</tr>
	</thead>
	<tbody class="table-auto overflow-scroll">
		{#each $guesses as guess (guess.guess)}
			<BlindGuessResult
				guessed={guess.guess.id}
				serverResponse={guess as BlindKillerResponse}
				killers={data.killers}
				onDoneReveal={() => {
					revealDone = true;
				}}
			/>
		{/each}
	</tbody>
</table>
