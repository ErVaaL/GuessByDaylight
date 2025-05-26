import { describe, it, expect } from 'vitest';
import { drawUniquePerksPure } from './draw';

const fakePerks = [
	{ id: 1, name: 'Perk 1', side: 'survivor' },
	{ id: 2, name: 'Perk 2', side: 'survivor' },
	{ id: 3, name: 'Perk 3', side: 'survivor' },
	{ id: 4, name: 'Perk 4', side: 'survivor' },
	{ id: 5, name: 'Perk 5', side: 'survivor' },
	{ id: 6, name: 'Perk 6', side: 'survivor' },
];

describe('drawUniquePerksPure', () => {
	it('returns the correct number of selected perks', () => {
		const { selected } = drawUniquePerksPure(fakePerks, 3, 0);
		expect(selected.length).toBe(3);
	});

	it('returns excluded perks based on count', () => {
		const { excluded } = drawUniquePerksPure(fakePerks, 4, 2);
		expect(excluded.length).toBe(2);
	});
});
