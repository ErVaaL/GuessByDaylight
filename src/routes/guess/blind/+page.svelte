<script lang="ts">
	import { killers } from '$lib/data/killers';
	import { goto } from '$app/navigation';
	import GuessResult from '../../../components/blind/GuessResult.svelte';
	import GuessingInput from '../../../components/universal/GuessingInput.svelte';
	import { useGuessingGame } from '$lib/utils/useGuessingGame';
	import { loading } from '$lib/stores/loading';

	type Killer = {
		name: string;
		altNames: string[];
	};

	//TODO fix up the types so there are no warnings

	const { guesses, hasCompletedToday, submitGuess } = useGuessingGame({
		apiEndpoint: '/api/guess',
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
	let guessedKillerIds: string[] = [];
	let excludedKillers: Killer[] = [];

	const killerMatches: Killer[] = killers.map((killer) => ({
		name: killer.name,
		altNames: killer.altNames,
	}));

	$: isCorrect = $guesses.some((g) => g.isCorrect);
	$: guessedKillerIds = $guesses.map((g) => g.name.toLowerCase());
	$: excludedKillers = killerMatches.filter(
		(k) => !guessedKillerIds.includes(k.name.toLowerCase())
	);

	$: loading.set(false);
</script>

<h1 class="p-4 text-center text-2xl font-bold">Guess the killer</h1>
{#if !isCorrect && !$hasCompletedToday}
	<GuessingInput killers={excludedKillers} {submitGuess} />
{:else if revealDone || $hasCompletedToday}
	<button
		class="mt-4 h-12 w-40 rounded-lg bg-green-600 font-bold text-white transition hover:bg-green-700"
		on:click={() => goto('/guess/emotes')}
	>
		Next game →
	</button>
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
			<GuessResult
				guessed={guess.guess}
				serverResponse={guess}
				onDoneReveal={() => {
					if (guess.isCorrect) revealDone = true;
				}}
			/>
		{/each}
	</tbody>
</table>
