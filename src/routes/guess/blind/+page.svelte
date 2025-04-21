<script lang="ts">
	import { goto } from '$app/navigation';
	import BlindGuessResult from '../../../components/blind/BlindGuessResult.svelte';
	import GuessingInput from '../../../components/universal/GuessingInput.svelte';
	import { useGuessingGame } from '$lib/utils/useGuessingGame';
	import { useExcludedKillers } from '$lib/utils/useExcludedKillers';
	import { loading } from '$lib/stores/loading';
	import { onMount } from 'svelte';
	import { ENDPOINTS } from '$lib/endopoints';
	import GoNext from '../../../components/universal/GoNext.svelte';

	const blindGuessEndpoint = `${ENDPOINTS.BASE_GUESS}/blind`;

	const { guesses, hasCompletedToday, submitGuess } = useGuessingGame({
		apiEndpoint: blindGuessEndpoint,
		storageKey: 'blind_guesses',
		storageDateKey: 'blind_guess_correct',
	});

	const headers = [
		{ val: 'Name' },
		{ val: 'Sex' },
		{ val: 'Terror Radius' },
		{ val: 'Speed' },
		{ val: 'Attack Type' },
		{ val: 'Height' },
		{ val: 'Origin' },
		{ val: 'Release Year' },
	];

	let revealDone = false;
	let isCorrect = false;

	const { excludedKillers } = useExcludedKillers(guesses);

	$: isCorrect = $guesses.some((g) => g.isCorrect);

	onMount(() => {
		loading.set(false);
	});
</script>

<h1 class="p-4 text-center text-2xl font-bold">Guess the killer</h1>
{#if !isCorrect && !$hasCompletedToday}
	<GuessingInput list={$excludedKillers} {submitGuess} />
{:else if revealDone || $hasCompletedToday}
	<p class="text-md font-bold text-green-500">Congratulations, you guessed right!</p>
	<GoNext location="/guess/emotes" />
{/if}

<table class="table-fixed border-separate border-spacing-2">
	<thead>
		<tr>
			{#each headers as header (header.val)}
				<th class="h-16 w-16 border-b text-center text-sm font-bold">{header.val}</th>
			{/each}
		</tr>
	</thead>
	<tbody>
		{#each $guesses as guess (guess.guess)}
			<BlindGuessResult
				guessed={guess.guess}
				serverResponse={guess}
				onDoneReveal={() => {
					revealDone = true;
				}}
			/>
		{/each}
	</tbody>
</table>
