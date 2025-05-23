<script lang="ts">
	import PerkCard from '../../../components/perk/PerkCard.svelte';
	import { ENDPOINTS } from '$lib/endopoints';
	import GuessingInput from '../../../components/universal/GuessingInput.svelte';
	import { useGuessingGame } from '$lib/utils/useGuessingGame';
	import { useExcludedPerks } from '$lib/utils/useExcludedPerks';
	import StandardGuessResult from '../../../components/universal/StandardGuessResult.svelte';
	import GoNext from '../../../components/universal/GoNext.svelte';
	import type { PageProps } from './$types';
	import CorrectPortrait from '../../../components/universal/CorrectPortrait.svelte';

	const perkEndpoint = `${ENDPOINTS.BASE_GUESS}/perk-killer`;

	if (typeof window !== 'undefined' && location.pathname.startsWith('/guess')) {
		sessionStorage.setItem('lastGuessRoute', location.pathname);
	}

	let { data }: PageProps = $props();

	let onDoneReveal = $state(false);

	const { guesses, hasCompletedToday, submitGuess, killerPerkObscureLevel } = useGuessingGame({
		apiEndpoint: perkEndpoint,
		storageKey: 'killer_perks_guess',
		storageDateKey: 'killer_perks_guess_correct',
	});

	const perk = data.killerPerks;

	const { excludedPerks } = useExcludedPerks(guesses, data.killerPerks.side, data.perks);
</script>

<h1 class="text-2xl font-bold">Guess the killer perk</h1>
{#if perk && perk !== null}
	<PerkCard {perk} obscureLevel={$killerPerkObscureLevel} />
	{#if !$hasCompletedToday && !onDoneReveal}
		<GuessingInput list={$excludedPerks} {submitGuess} />
	{:else}
		<CorrectPortrait guessed={$guesses[$guesses.length - 1].guess} owners={data.killers} />
		<GoNext location="/guess/terror" />
	{/if}
	<div class="my-2 flex flex-col-reverse gap-y-2">
		{#each $guesses as guess (guess.name)}
			<StandardGuessResult
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
