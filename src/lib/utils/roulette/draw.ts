const fisherYatesShuffle = <T>(a: T[]): T[] => {
	const result = [...a];
	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[result[i], result[j]] = [result[j], result[i]];
	}
	return result;
};

export const drawUniquePerksPure = <T>(
	perks: T[],
	slots: number,
	excludePerksCount: number
): { selected: (T | null)[]; excluded: T[] } => {
	const shuffled = fisherYatesShuffle(perks);
	const selected: (T | null)[] = shuffled.slice(0, slots);

	const excluded: T[] = [];
	if (excludePerksCount > 0) {
		for (let i = 0; i < excludePerksCount; i++) {
			if (selected[i] !== null) excluded.push(selected[i]!);
		}
	}

	while (selected.length < slots) selected.push(null);

	return { selected, excluded };
};
