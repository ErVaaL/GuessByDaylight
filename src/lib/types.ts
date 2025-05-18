export type BlindKillerResponse = {
	name: string;
	guess: KillerFromDb;
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

export type DailyPick = {
	answers_date: string;
	blind_killer_id: string;
	emotes_killer_id: string;
	survivor_perk_id: number;
	killer_perk_id: number;
	terror_killer_id: string;
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
	terror_far: string;
	terror_mid: string;
	terror_near: string;
	terror_chase: string;
	emotes: string[];
};

export type PerkFromDb = {
	id: number;
	name: string;
	side: string;
	icon: string;
	survivor_id?: string;
	killer_id?: string;
};

export type SurvivorFromDb = {
	id: string;
	name: string;
	portrait: string;
};

export type StandardResponse = {
	name: string;
	guess: KillerFromDb;
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
