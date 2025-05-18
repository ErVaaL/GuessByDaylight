<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import TimerTillReset from '../components/universal/TimerTillReset.svelte';
	import { cleanLocalStorage } from '$lib/utils/cleanLocalStorage';
	import Navbar from '../components/layout/Navbar.svelte';
	import { Github } from 'lucide-svelte';

	let { children, data } = $props();

	let header: HTMLElement;
	let observerTarget: HTMLElement;
	let isFloating = $state(false);

	onMount(() => {
		const lastReset = localStorage.getItem('lastResetDate');
		if (lastReset != data.today) {
			cleanLocalStorage(data.today);
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				isFloating = !entry.isIntersecting;
			},
			{ threshold: 0 }
		);

		if (observerTarget) {
			observer.observe(observerTarget);
		}
	});
</script>

<svelte:head>
	<title>Guess by Daylight</title>
	<link rel="icon" href="/favicon.jpg" />
	<meta name="description" content="A fan-made Dead by Daylight guessing game." />
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />

	<meta property="og:title" content="Guess by Daylight" />
	<meta
		property="og:description"
		content="Can you guess the killer or perk from Dead by Daylight?"
	/>
	<meta name="author" content="ErVaL" />
	<meta name="keywords" content="dead by daylight, guessing game, dbd, perks, killers" />
</svelte:head>

<div
	class="flex h-full min-h-screen flex-col bg-black font-sans text-white"
	style="background-image: url('https://vjqeedywtzxnglyznele.supabase.co/storage/v1/object/public/images/misc/dbd-background.png'); background-size: cover; background-position: center; background-attachment: fixed;"
>
	<div class="h-14" class:hidden={!isFloating}></div>
	<header
		bind:this={header}
		class="z-40 flex h-14 items-center gap-x-4 border-b border-gray-800 bg-[rgba(0,0,0,0.7)] p-2 text-white transition-all duration-300"
		class:floating={isFloating}
	>
		<Navbar />
	</header>

	<div bind:this={observerTarget} class="h-0 w-full"></div>

	<div class="flex h-full grow justify-center">
		<div class="flex w-4xl flex-col items-center gap-y-8 bg-[rgba(0,0,0,0.7)]">
			<h1 class="mt-2 px-4 text-center text-3xl font-bold">Guess by Daylight</h1>
			<TimerTillReset today={data.today} />
			{@render children?.()}
		</div>
	</div>
	<footer
		class="relative border-t border-gray-800 bg-black p-0 text-center text-xs text-gray-400 opacity-70"
	>
		<p class="px-2 pt-2">
			This is an unofficial fan-made game inspired by <strong>Dead by Daylight</strong>.<br />
			All characters, icons, perks, and associated media belong to
			<strong>Behaviour Interactive Inc.</strong>.<br />
			No affiliation or endorsement is implied.
		</p>
		<div class="flex w-full">
			<div class="grow px-2 pb-2 text-left font-bold text-gray-200">version: 1.0.1</div>
			<div class="flex-end w-min self-end px-2 pb-2 text-right font-bold text-white">
				<a
					href="https://github.com/ErVaaL/GuessByDaylight"
					target="_blank"
					rel="noopener noreferrer"
					title="Visit official GitHub!"
					class="transition-colors duration-150 hover:text-gray-400"><Github /></a
				>
			</div>
		</div>
	</footer>
</div>

<style>
	header.floating {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		backdrop-filter: blur(4px);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
	}
</style>
