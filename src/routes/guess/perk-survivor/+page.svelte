<script lang="ts">
	import PerkCard from '../../../components/perk/PerkCard.svelte';
	import { ENDPOINTS } from '$lib/endopoints';
	import GuessingInput from '../../../components/universal/GuessingInput.svelte';
	import { useGuessingGame } from '$lib/utils/useGuessingGame';
	import { useExcludedPerks } from '$lib/utils/useExcludedPerks';
	import StandardGuessResult from '../../../components/universal/StandardGuessResult.svelte';
	import GoNext from '../../../components/universal/GoNext.svelte';
	import type { PageProps } from './$types';

	const perkEndpoint = `${ENDPOINTS.BASE_GUESS}/perk-survivor`;

	let { data }: PageProps = $props();

	let onDoneReveal = $state(false);

	const { guesses, hasCompletedToday, submitGuess, survivorPerkObscureLevel } = useGuessingGame({
		apiEndpoint: perkEndpoint,
		storageKey: 'survivor_perks_guess',
		storageDateKey: 'survivor_perks_guess_correct',
	});
	const perk = data.survivorPerks;

	const { excludedPerks } = useExcludedPerks(guesses, data.survivorPerks.side, data.perks);
</script>

<h1 class="text-2xl font-bold">Guess the survivor perk</h1>
{#if perk && perk !== null}
	<PerkCard {perk} obscureLevel={$survivorPerkObscureLevel} />
	{#if !$hasCompletedToday && !onDoneReveal}
		<GuessingInput list={$excludedPerks} {submitGuess} />
	{:else}
		<p class="text-md font-bold text-green-500">Congratulations, you guessed right!</p>
		<GoNext location="/guess/perk-killer" />
	{/if}
	<div class="flex flex-col-reverse gap-y-2">
		{#each $guesses as guess (guess.name)}
			<StandardGuessResult
				guessed={guess.name}
				serverResponse={guess}
				onDoneReveal={() => {
					if (guess.isCorrect) {
						onDoneReveal = true;
					}
				}}
			/>
		{/each}
	</div>
{/if}
