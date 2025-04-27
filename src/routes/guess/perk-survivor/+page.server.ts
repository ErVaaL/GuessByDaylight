import type { PageServerLoad } from './$types';

const survivorPerkUrl = '/api/guess/perk-survivor';

export const load: PageServerLoad = async ({ fetch }) => {
	const res = await fetch(survivorPerkUrl);
	const data = await res.json();

	if (!res.ok) throw new Error(`Failed to fetch survivor perks: ${data.error}`);

	return {
		survivorPerks: data,
	};
};
