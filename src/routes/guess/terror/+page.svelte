<script lang="ts">
	import { ENDPOINTS } from '$lib/endopoints';
	import { useExcludedKillers } from '$lib/utils/useExcludedKillers';
	import { useGuessingGame } from '$lib/utils/useGuessingGame';
	import { Play, Pause, Lock } from 'lucide-svelte';
	import GuessingInput from '../../../components/universal/GuessingInput.svelte';
	import GoNext from '../../../components/universal/GoNext.svelte';
	import StandardGuessResult from '../../../components/universal/StandardGuessResult.svelte';
	import type { PageProps } from './$types';
	import { onMount } from 'svelte';

	const accessTerror = `${ENDPOINTS.BASE_GUESS}/terror`;

	let { data }: PageProps = $props();

	let volume = $state(0.3);
	let currentPlaying: keyof typeof audioFiles | null = $state(null);
	let revealDone = $state(false);
	let audioFiles: Record<string, HTMLAudioElement> = $state({});

	onMount(async () => {
		try {
			const terrorRadiusTable = await data.terror;
			audioFiles = terrorRadiusTable.reduce(
				(acc: Record<string, HTMLAudioElement>, path: string, i: number) => {
					acc[i] = new Audio(path);
					acc[i].volume = volume;
					return acc;
				},
				{} as Record<string, HTMLAudioElement>
			);

			const max = terrorRadiusTable.length;
			const current = parseInt(localStorage.getItem('terror_guess_revealed') || '1', 10);
			if (current > max) {
				localStorage.setItem('terror_revealed', max.toString());
				terrorLayerUnlocked?.set(max);
			}
		} catch (error) {
			console.error('Error fetching terror data:', error);
		}
	});

	const { guesses, hasCompletedToday, submitGuess, terrorLayerUnlocked } = useGuessingGame({
		apiEndpoint: accessTerror,
		storageDateKey: 'terror_guess_correct',
		storageKey: 'terror_guess',
		onGuess(guess) {
			if (guess.isCorrect) {
				stopAllAudio();
				revealDone = true;
			}
		},
	});
	const stopAllAudio = () => {
		for (const audio of Object.values(audioFiles)) {
			audio.pause();
			audio.currentTime = 0;
		}
		currentPlaying = null;
	};

	$effect(() => {
		for (const audio of Object.values(audioFiles)) {
			audio.volume = volume;
		}
	});

	const { excludedKillers } = useExcludedKillers(guesses, data.killers);

	const playSound = (layer: string) => {
		for (const [key, audio] of Object.entries(audioFiles)) {
			if (key !== layer) audio.pause();
		}

		if (currentPlaying === layer) {
			audioFiles[layer].pause();
			audioFiles[layer].currentTime = 0;
			currentPlaying = null;
		} else {
			audioFiles[layer].currentTime = 0;
			audioFiles[layer].play();
			currentPlaying = layer;

			audioFiles[layer].onended = () => {
				if (currentPlaying === layer) currentPlaying = null;
			};
		}
	};

	const labels: string[] = ['Far', 'Mid', 'Near', 'Chase'];
</script>

<h1 class="p-2 text-2xl font-bold">Guess the killer from terror</h1>
<div class="grid min-h-fit w-4/5 grid-cols-4 items-center border-y-2 border-y-red-300">
	{#each labels as label (label)}
		<div class="flex items-center justify-center place-self-center p-4 font-bold text-white">
			{label}
		</div>
	{/each}
	{#each Object.keys(audioFiles) as layer, i (layer)}
		<button
			class="flex h-14 w-14 items-center justify-center place-self-center rounded-full bg-gray-700 p-4
      {i < ($terrorLayerUnlocked ?? 0)
				? 'bg-gray-700 text-white hover:bg-gray-600'
				: 'cursor-not-allowed bg-gray-500 text-gray-400'}"
			onclick={() => {
				if (i < ($terrorLayerUnlocked ?? 0)) playSound(layer);
			}}
			disabled={i >= ($terrorLayerUnlocked ?? 0)}
			><span class="text-xl">
				{#if currentPlaying === layer}
					<Pause class="inline" />
				{:else if i >= ($terrorLayerUnlocked ?? 0)}
					<Lock class="inline" />
				{:else}
					<Play class="inline" />
				{/if}
			</span></button
		>
	{/each}
	<div class="col-span-4 mt-2 flex flex-col items-center justify-center gap-2 p-2">
		<label for="volume" class="text-white">Volume</label>
		<input
			id="volume"
			type="range"
			min="0"
			max="1"
			step="0.01"
			bind:value={volume}
			class="w-1/2 accent-red-500"
		/>
	</div>
</div>
{#if !$hasCompletedToday && !revealDone}
	<GuessingInput list={$excludedKillers} {submitGuess} />
{:else}
	<p class="text-md font-bold text-green-500">Congratulations, you guessed right!</p>
	<GoNext location="/" />
{/if}
<div class="flex flex-col-reverse gap-y-2">
	{#each $guesses as guess (guess.guess)}
		<StandardGuessResult
			serverResponse={guess}
			onDoneReveal={() => {
				stopAllAudio();
				revealDone = true;
			}}
		/>
	{/each}
</div>
