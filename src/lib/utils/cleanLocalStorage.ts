export const cleanLocalStorage = (serverDate: string) => {
	localStorage.removeItem('emotes_guess');
	localStorage.removeItem('emotes_guess_correct');
	localStorage.removeItem('blind_guesses');
	localStorage.removeItem('blind_guess_correct');
	localStorage.removeItem('survivor_perks_guess');
	localStorage.removeItem('survivor_perks_guess_correct');
	localStorage.removeItem('killer_perks_guess');
	localStorage.removeItem('killer_perks_guess_correct');
	localStorage.removeItem('terror_guess');
	localStorage.removeItem('terror_guess_correct');
	localStorage.removeItem('emotes_revealed');
	localStorage.removeItem('survivor_perk_obscure_level');
	localStorage.removeItem('killer_perk_obscure_level');
	localStorage.removeItem('terror_layer_unlocked');
	localStorage.removeItem('perk_random_tilt');

	localStorage.setItem('lastResetDate', serverDate);
};
