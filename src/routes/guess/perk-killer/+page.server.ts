import type { PageServerLoad } from './$types';

const killerPerkUrl = '/api/guess/perk-killer';

export const load: PageServerLoad = async ({ fetch }) => {
	const res = await fetch(killerPerkUrl);
	const data = await res.json();

	if (!res.ok) throw new Error(`Failed to fetch killer perks: ${data.error}`);

	return {
		killerPerks: data,
	};
};
