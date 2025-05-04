import { initiateDailyAnswers } from '$lib/server/initiateDailyAnswers';

export const POST = async () => {
	try {
		const { inserted, dailyPick } = await initiateDailyAnswers();
		return new Response(JSON.stringify({ inserted, dailyPick }), {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	} catch (error) {
		return new Response(
			JSON.stringify({ error: `Failed to initiate daily answers, error: ${error}` }),
			{ status: 500 }
		);
	}
};
