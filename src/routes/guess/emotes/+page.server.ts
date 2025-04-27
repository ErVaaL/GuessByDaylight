import type { PageServerLoad } from './$types';

const emotesUrl = '/api/guess/emotes';

export const load: PageServerLoad = async ({ fetch }) => {
	const res = await fetch(emotesUrl);
	const data = await res.json();

	if (!res.ok) throw new Error(`Failed to fetch emotes: ${data.error}`);

	return {
		emotes: data,
	};
};
