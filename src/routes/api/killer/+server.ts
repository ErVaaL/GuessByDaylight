import type { RequestHandler } from '@sveltejs/kit';
import { killers } from '$lib/data/killers';

export const GET: RequestHandler = async ({ url }) => {
	const id = url.searchParams.get('id');

	if (!id) {
		return new Response(JSON.stringify({ error: 'No killer ID provided' }), { status: 400 });
	}

	const killer = killers.find((k) => k.id === id.toLowerCase());

	if (!killer) {
		return new Response(JSON.stringify({ error: 'Killer not found' }), { status: 404 });
	}

	return new Response(JSON.stringify(killer), {
		headers: { 'Content-Type': 'application/json' }
	});
};
