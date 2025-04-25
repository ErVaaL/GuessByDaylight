<script lang="ts">
	import { useGuessingGame } from '$lib/utils/useGuessingGame';
	import GuessingInput from '../../../components/universal/GuessingInput.svelte';
	import { onMount } from 'svelte';
	import axios from 'axios';
	import { useExcludedKillers } from '$lib/utils/useExcludedKillers';
	import { ENDPOINTS } from '$lib/endopoints';
	import StandardGuessResult from '../../../components/universal/StandardGuessResult.svelte';
	import GoNext from '../../../components/universal/GoNext.svelte';

	const accessEmotes = `${ENDPOINTS.BASE_GUESS}/emotes`;

	let emojiTable: string[] = [];
	let revealDone = false;

	const fromUnicodeToEmoji = (code: string) => {
		return String.fromCodePoint(parseInt(code.replace('U+', ''), 16));
	};

	const { guesses, hasCompletedToday, submitGuess, emotesRevealed } = useGuessingGame({
		apiEndpoint: accessEmotes,
		storageKey: 'emotes_guess',
		storageDateKey: 'emotes_guess_correct',
	});

	const { excludedKillers } = useExcludedKillers(guesses);

	onMount(async () => {
		try {
			const res = await axios.get(accessEmotes);
			emojiTable = res.data;

			const max = emojiTable.length;
			const current = parseInt(localStorage.getItem('emotes_guess_revealed') || '1', 10);
			if (current > max) {
				localStorage.setItem('emotes_revealed', max.toString());
				emotesRevealed?.set(max);
			}
		} catch (error) {
			console.error('Error fetching emoji data:', error);
		}
	});
</script>

<h1 class="p-4 text-2xl font-bold">Guess the killer from the emotes</h1>
<div class="grid h-40 w-4/5 grid-cols-3 items-center border-y-2 border-y-red-300">
	{#each emojiTable as code, i (code)}
		<div
			class="flex h-14 w-14 items-center justify-center place-self-center rounded-full bg-gray-400"
		>
			{#if i < $emotesRevealed! || $hasCompletedToday}
				<span class="self-center text-4xl text-black emoji-text">{fromUnicodeToEmoji(code)}</span>
			{:else}
				<span class="text-4xl text-gray-400">?</span>
			{/if}
		</div>
	{/each}
</div>
{#if !$hasCompletedToday}
	<GuessingInput list={$excludedKillers} {submitGuess} />
{:else if revealDone || $hasCompletedToday}
	<p class="text-md font-bold text-green-500">Congratulations, you guessed right!</p>
	<GoNext location="/guess/perk-survivor" />
{/if}
<div class="flex flex-col-reverse gap-y-2">
	{#each $guesses as guess (guess.guess)}
		<StandardGuessResult
			guessed={guess.guess}
			serverResponse={guess}
			onDoneReveal={() => {
				revealDone = true;
			}}
		/>
	{/each}
</div>
