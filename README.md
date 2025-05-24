# Guess By Daylight
v1.1

## About
Guess By Daylight is a web-based guessing game inspired by the popular game Dead by Daylight. 
The game allows players to guess various aspects of the game, such as killer perks, survivor perks, emotes, and more.
It features a daily challenge that resets every 24 hours, providing players with new content to enjoy.

Additionally, recently added is perk roulette, where you can draw random perks for both killer and survivor.
The roulette allows to draw up to 5 sets 4 perks each, and you can choose to draw either killer or survivor perks.

Quick guide:
1. Big red button - draws all active perk sets
2. Small red button in the middle of the set - draws only that set
3. SHIFT + click on one of the perks - draws only that perk
4. "+" and "-" buttons in a set - choose how many perks to draw in that set (min 1, max 4)
5. "Mouse" and "Skull" buttons - choose whether to draw survivor or killer perks
6. "+" and "-" buttons above big red button - choose how many sets to draw (min 1, max 5)

Will be working on adding more features and improving the app.

## Stack
- **Frontend**: Svelte, SvelteKit, TypeScript, Tailwind CSS, Vite
- **Backend**: SvelteKit (server-side)
- **Database**: Supabase (PostgreSQL)

## Getting started

Copy the project files to your local machine:

```bash
git clone https://github.com/ErVaaL/GuessByDaylight.git
```

Then navigate to the project directory:

```bash
cd GuessByDaylight
```
Install the dependencies:

```bash
yarn install
```

or

```bash
npm install
```

Run the app:

```bash
yarn dev
```
or

```bash
npm run dev
```

The app uses Vite, so navigate to http://localhost:5173/ in your browser to see the app.

## API endpoints:
- `/api/guess/**` - main endpoint for 5 different guessing games:

  - `/blind` - checks and returns the answer to guess for blind game
  - `/emotes` - checks and returns the answer to guess for emotes game
  - `/perk-survivor` - checks and returns the answer to guess for survivor perk game
  - `/perk-killer` - checks and returns the answer to guess for killer perk game
  - `/terror` - checks and returns the answer to guess for terror radius game

  - `/initiate-daily` - generates a new daily challenge

- `/api/killer` - returns a list of killers (currently not used)

## Disclaimer
This project is not affiliated with or endorsed by Behaviour Interactive Inc. or Dead by Daylight. All rights reserved to their respective owners.
This project is for entertainment purposes only, not for commercial use.
No money is being made from this project.


