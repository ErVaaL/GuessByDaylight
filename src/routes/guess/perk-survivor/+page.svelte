<script lang="ts">
	import PerkCard from '../../../components/perk-surv/PerkCard.svelte';
	import type { Perk } from '$lib/types';
	import { onMount } from 'svelte';
	import axios from 'axios';
	import { ENDPOINTS } from '$lib/endopoints';
	import GuessingInput from '../../../components/universal/GuessingInput.svelte';
	import { useGuessingGame } from '$lib/utils/useGuessingGame';
	import { useExcludedPerks } from '$lib/utils/useExcludedPerks';
	import { writable } from 'svelte/store';
	import StandardGuessResult from '../../../components/universal/StandardGuessResult.svelte';
	import GoNext from '../../../components/universal/GoNext.svelte';

	const perkEndpoint = `${ENDPOINTS.BASE_GUESS}/perk-survivor`;

	let perk: Perk | null = null;
	let onDoneReveal = false;
	const perkSide = writable<'killer' | 'survivor'>('survivor');

	const { guesses, hasCompletedToday, submitGuess, survivorPerkObscureLevel } = useGuessingGame({
		apiEndpoint: perkEndpoint,
		storageKey: 'survivor_perks_guess',
		storageDateKey: 'survivor_perks_guess_correct',
	});

	onMount(async () => {
		try {
			const res = await axios.get(perkEndpoint);
			perk = res.data;
			perkSide.set(perk.side);
		} catch (error) {
			console.error('Error fetching perk:', error);
		}
	});

	const { excludedPerks } = useExcludedPerks(guesses, perkSide);
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
{/if}
