# Guess By Daylight
v1.0

## About
This is a small web browser wordle like game that is themed on game Dead by Daylight.
Will be working on adding more features and improving the game.

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


