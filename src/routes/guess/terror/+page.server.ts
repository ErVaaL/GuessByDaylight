import { ENDPOINTS } from '$lib/endopoints';
import type { PageServerLoad } from './$types';

const terrorUrl = `${ENDPOINTS.BASE_GUESS}/terror`;

export const load: PageServerLoad = async ({ fetch }) => {
	const res = await fetch(terrorUrl);
	const data = await res.json();

	if (!res.ok) throw new Error(`Failed to fetch emotes: ${data.error}`);

	return {
		terror: data,
	};
};
