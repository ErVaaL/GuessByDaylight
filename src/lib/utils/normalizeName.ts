export const normalizeName = (name: string) => {
	return name
		.replace(/[^a-zA-Z]/g, '')
		.toLowerCase()
		.replace(/'/g, '');
};
