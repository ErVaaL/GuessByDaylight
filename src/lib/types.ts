export type BlindKillerResponse = {
	name: string;
	guess: string;
	stats: {
		sex: string;
		terrorRadius: string;
		speed: string;
		attackType: string;
		height: string;
		origin: string;
		releaseYear: string;
	};
	isCorrect: boolean;
};

export type Perk = {
	name: string;
	side: string;
	belongsTo: string;
	icon: string;
};

export type StandardResponse = {
	name: string;
	guess: string;
	isCorrect: boolean;
};

export type KillerBlind = {
	name: string;
	sex: string;
	speed: number[];
	height: string;
	terrorRadius: number[];
	attackType: string[];
	origin: string;
	releaseYear: number;
};
