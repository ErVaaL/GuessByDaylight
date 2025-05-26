export const MAX_SLOTS = 4;
export const MIN_SLOTS = 1;

export const addPerkSlot = (current: number): number => {
	return current < MAX_SLOTS ? current + 1 : current;
};

export const removePerkSlot = (current: number): number => {
	return current > MIN_SLOTS ? current - 1 : current;
};

