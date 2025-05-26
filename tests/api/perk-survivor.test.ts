import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '../../src/routes/api/guess/perk-survivor/+server';
import * as answerModule from '../../src/lib/utils/getDailyAnswer';

describe('GET /api/guess/perk-survivor', () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	const mockEvent = {
		request: new Request('http://localhost'),
	} as any;

	it('returns correct perk with status 200', async () => {
		const mockPerk = {
			id: 1,
			name: 'Borrowed Time',
			icon: 'https://example.com/icon.png',
			side: 'survivor',
		};

		vi.spyOn(answerModule, 'getDailyAnswer').mockResolvedValue(mockPerk);

		const res = await GET(mockEvent);
		expect(res.status).toBe(200);

		const json = await res.json();
		expect(json).toMatchObject(mockPerk);
	});

	it('returns 404 if no correct answer', async () => {
		vi.spyOn(answerModule, 'getDailyAnswer').mockResolvedValue(null);

		const res = await GET(mockEvent);
		expect(res.status).toBe(404);

		const json = await res.json();
		expect(json).toHaveProperty('error');
	});
});
