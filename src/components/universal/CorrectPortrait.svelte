<script lang="ts">
	import type { KillerFromDb, PerkFromDb, SurvivorFromDb } from '$lib/types';

	export let guessed: KillerFromDb | PerkFromDb;
	export let owners: KillerFromDb[] | SurvivorFromDb[] = [];

	const defaultImage =
		'https://vjqeedywtzxnglyznele.supabase.co/storage/v1/object/public/images/misc/uniimage.jpg';

	if (guessed == null || !guessed) throw new Error('guessed is null');

	function isKiller(item: KillerFromDb | PerkFromDb): item is KillerFromDb {
		return 'portrait' in item && 'terrorRadius' in item;
	}

	const correct: KillerFromDb | SurvivorFromDb | null = isKiller(guessed)
		? guessed
		: owners.find((item) => {
				const itemId =
					guessed.survivor_id != null
						? guessed.survivor_id
						: guessed.killer_id != null
							? guessed.killer_id
							: 'none';
				if (itemId === 'none') return null;
				return item.id === itemId;
			});
</script>

<div class="flex flex-col items-center justify-center">
	<h1 class="text-center text-2xl font-bold">Correct!</h1>
	<p class="text-center text-lg">You guessed {guessed.name}</p>
	{#if correct}
		<div class="flex flex-col items-center justify-center">
			{#if !isKiller(guessed)}
				<p class="text-center text-lg">Belongs to: {correct.name}</p>
			{/if}
			<img
				src={correct.portrait}
				alt=""
				class="m-2 h-32 w-32 rounded-full border-4 border-gray-300"
			/>
		</div>
	{:else}
		<div class="flex flex-col items-center justify-center">
			<img src={defaultImage} alt="" class="h-32 w-32 rounded-full border-4 border-gray-300" />
		</div>
	{/if}
</div>
