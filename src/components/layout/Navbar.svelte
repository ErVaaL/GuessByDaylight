<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { EyeOff, Footprints, Home, Music4, Skull, Smile } from 'lucide-svelte';
	import { writable } from 'svelte/store';

	const isOpen = writable(false);

	const toggleMenu = () => {
		isOpen.update((open) => !open);
	};

	const handleNavButtonClick = (type: string) => {
		let path: string = '/guess';

		switch (type) {
			case 'blind':
				path = path + '/blind';
				break;
			case 'emote':
				path = path + '/emotes';
				break;
			case 'survivor':
				path = path + '/perk-survivor';
				break;
			case 'killer':
				path = path + '/perk-killer';
				break;
			case 'terror':
				path = path + '/terror';
				break;
			default:
				console.warn('Unknown nav type:', type);
				return;
		}

		isOpen.set(false);
		goto(path);
	};
	$: currentPath = $page.url.pathname;

	const handleButton = () => {
		const last = sessionStorage.getItem('lastGuessRoute');
		goto(last || '/');
	};
</script>

<nav class="flex h-14 w-full items-center gap-x-4 px-0 text-white">
	<div class="flex h-14 w-1/3 items-center gap-x-4 px-4 text-white">
		<button onclick={() => goto('/')} class="flex cursor-pointer items-center gap-1">
			<Home />
		</button>

		<button
			class="transition-colors duration-150 hover:text-gray-400"
			onclick={toggleMenu}
			aria-label="Toggle menu"
		>
			<div class="burger" class:open={$isOpen}>
				<div class="burger-line line1"></div>
				<div class="burger-line line2"></div>
				<div class="burger-line line3"></div>
			</div>
		</button>

		<div class="dropdown" class:open={$isOpen}>
			<h2 class="text-center font-bold">Choose Game:</h2>
			<button class="flex gap-1" onclick={() => handleNavButtonClick('blind')}
				><EyeOff /><span>Blind</span></button
			>
			<button class="flex gap-1" onclick={() => handleNavButtonClick('emote')}
				><Smile /><span>Emote</span></button
			>
			<button class="flex gap-1" onclick={() => handleNavButtonClick('survivor')}
				><Footprints /><span>Survivor Perk</span></button
			>
			<button class="flex gap-1" onclick={() => handleNavButtonClick('killer')}
				><Skull /><span>Killer Perk</span></button
			>
			<button class="flex gap-1" onclick={() => handleNavButtonClick('terror')}
				><Music4 /><span>Terror</span></button
			>
		</div>
	</div>
	<div class="flex h-14 w-1/3 items-center justify-center px-4">
		<button
			onclick={handleButton}
			class="h-10 rounded p-2 transition duration-200"
			class:active-nav={currentPath === '/' || currentPath.startsWith('/guess')}
			>Guess by Daylight</button
		>
	</div>
</nav>

<style>
	.burger {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 20px;
		width: 30px;
		cursor: pointer;
	}
	.burger-line {
		height: 2px;
		background-color: white;
		transition:
			transform 0.3s ease,
			opacity 0.3s ease;
	}

	.burger.open .line1 {
		transform: rotate(45deg) translateY(12.5px);
	}
	.burger.open .line2 {
		opacity: 0;
	}
	.burger.open .line3 {
		transform: rotate(-45deg) translateY(-12.5px);
	}

	.dropdown {
		position: absolute;
		top: 3.5rem;
		left: 0;
		display: flex;
		flex-direction: column;
		background-color: rgba(0, 0, 0, 0.85);
		padding: 0.5rem;
		opacity: 0;
		pointer-events: none;
		transform: translateY(-10px);
		transition:
			opacity 0.3s ease,
			transform 0.3s ease;
	}
	.dropdown.open {
		opacity: 1;
		transform: translateY(0);
		pointer-events: auto;
	}
	.dropdown button {
		padding: 0.25rem;
		text-align: left;
		cursor: pointer;
		transition: background 0.2s;
	}
	.dropdown button:hover {
		background-color: rgba(255, 255, 255, 0.1);
		border-radius: 0.25rem;
	}

	button.active-nav {
		background-color: #373737;
		border-radius: 0.5rem;
	}
</style>
