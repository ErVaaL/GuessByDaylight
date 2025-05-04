import { initiateDailyAnswers } from '$lib/server/initiateDailyAnswers';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	const { dailyPick } = await initiateDailyAnswers();
	return { dailyPick };
};

