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
	portrait: string;
	isCorrect: boolean;
};

export type KillerFromDb = {
	id: string;
	name: string;
	altNames: string[];
	sex: string;
	terrorRadius: number[];
	speed: number[];
	attackType: string[];
	height: string;
	origin: string;
	releaseYear: number;
	portrait: string;
	terrorFar: string;
	terrorMid: string;
	terrorNear: string;
	terrorChase: string;
	emotes: string[];
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
