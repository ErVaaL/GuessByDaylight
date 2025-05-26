import { describe, it, expect } from 'vitest';
import { addPerkSlot, removePerkSlot } from './perkSlots';

describe('addPerkSlot', () => {
	it('increases slots if below max', () => {
		expect(addPerkSlot(2)).toBe(3);
	});

	it('does not increase above max', () => {
		expect(addPerkSlot(4)).toBe(4);
	});
});

describe('removePerkSlot', () => {
	it('decreases slots if above min', () => {
		expect(removePerkSlot(3)).toBe(2);
	});

	it('does not decrease below min', () => {
		expect(removePerkSlot(1)).toBe(1);
	});
});
