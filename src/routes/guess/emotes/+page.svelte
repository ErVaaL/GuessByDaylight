<script lang="ts">
	import { useGuessingGame } from '$lib/utils/useGuessingGame';
	import GuessingInput from '../../../components/universal/GuessingInput.svelte';
	import { onMount } from 'svelte';
	import axios from 'axios';
	import { useExcludedKillers } from '$lib/utils/useExcludedKillers';
	import EmoteGuessResult from '../../../components/emotes/EmoteGuessResult.svelte';
	import { goto } from '$app/navigation';

	let emojiTable: string[] = [];
	let revealDone = false;

	const fromUnicodeToEmoji = (code: string) => {
		return String.fromCodePoint(parseInt(code.replace('U+', ''), 16));
	};

	const { guesses, hasCompletedToday, submitGuess } = useGuessingGame({
		apiEndpoint: '/api/guess/emotes',
		storageKey: 'emotes_guess',
		storageDateKey: 'emotes_guess_correct',
	});

	const { excludedKillers } = useExcludedKillers(guesses);

	onMount(async () => {
		try {
			const res = await axios.get('/api/guess/emotes');
			emojiTable = res.data;
		} catch (error) {
			console.error('Error fetching emoji data:', error);
		}
	});
</script>

<h1 class="p-4 text-2xl font-bold">Guess the killer from the emotes</h1>
<div class="grid h-40 w-4/5 grid-cols-3 items-center border-y-2 border-y-red-300">
	{#each emojiTable as code (code)}
		<div
			class="flex h-14 w-14 items-center justify-center place-self-center rounded-full bg-gray-600"
		>
			<span class="self-center text-4xl text-black">{fromUnicodeToEmoji(code)}</span>
		</div>
	{/each}
</div>
{#if !$hasCompletedToday}
	<GuessingInput killers={$excludedKillers} {submitGuess} />
{:else if revealDone || $hasCompletedToday}
	<button
		class="mt-4 h-12 w-40 rounded-lg bg-green-600 font-bold text-white transition hover:bg-green-700"
		on:click={() => goto('/guess/perk-survivor')}
	>
		Next game →
	</button>
{/if}
<div class="flex flex-col-reverse gap-y-2">
	{#each $guesses as guess (guess.guess)}
		<EmoteGuessResult
			guessed={guess.guess}
			serverResponse={guess}
			onDoneReveal={() => {
				revealDone = true;
			}}
		/>
	{/each}
</div>
