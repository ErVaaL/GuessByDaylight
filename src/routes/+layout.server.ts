import { supabaseServer } from '$lib/supabaseServer';

export const load = async () => {
	const today = new Date().toISOString().split('T')[0];

	const { data: dailyPick, error } = await supabaseServer
		.from('DailyAnswers')
		.select('answers_date')
		.eq('answers_date', today)
		.single();

	if (error) console.error('Error fetching daily pick:', error);

	if (!dailyPick) {
		const { data: killers, error: killersError } = await supabaseServer.from('Killers').select('*');

		const { data: perks, error: perksError } = await supabaseServer.from('Perks').select('*');

		if (killersError) console.error('Error fetching killers:', killersError);
		if (perksError) console.error('Error fetching perks:', perksError);
		if (!killers || killers.length === 0) throw new Error('Failed to fetch killers');
		if (!perks || perks.length === 0) throw new Error('Failed to fetch perks');

		const randomBlind = killers[Math.floor(Math.random() * killers.length)];
		const randomEmotes = killers[Math.floor(Math.random() * killers.length)];
		const randomSurvivorPerk = perks[Math.floor(Math.random() * perks.length)];
		const randomKillerPerk = perks[Math.floor(Math.random() * perks.length)];
		const randomTerror = killers[Math.floor(Math.random() * killers.length)];

		const { error: insertError } = await supabaseServer.from('DailyAnswers').insert([
			{
				answers_date: today,
				blind_killer_id: randomBlind.id,
				emotes_killer_id: randomEmotes.id,
				survivor_perk_id: randomSurvivorPerk.id,
				killer_perk_id: randomKillerPerk.id,
				terror_killer_id: randomTerror.id,
			},
		]);

		if (insertError) {
			console.error('Error inserting daily pick:', insertError);
			throw new Error('Failed to insert daily pick');
		}
	}

	return {
		answers_date: today,
	};
};
