<script lang="ts">
	import { useGuessingGame } from '$lib/utils/useGuessingGame';
	import GuessingInput from '../../../components/universal/GuessingInput.svelte';
	import { onMount } from 'svelte';
	import axios from 'axios';
	import { useExcludedKillers } from '$lib/utils/useExcludedKillers';

	let emojiTable: string[] = [];

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
<GuessingInput killers={$excludedKillers} {submitGuess} />
