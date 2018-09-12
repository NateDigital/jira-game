# Jira Game

Master: [![CircleCI](https://circleci.com/gh/NateDigital/jira-game/tree/master.svg?style=svg)](https://circleci.com/gh/NateDigital/jira-game/tree/master) 

Develop: [![CircleCI](https://circleci.com/gh/NateDigital/jira-game/tree/develop.svg?style=svg)](https://circleci.com/gh/NateDigital/jira-game/tree/develop)



A quick and dirty hack which has gone further than it should of.

was originally intended to spit out a few numbers to STDOUT

It was never going to have a UI, but it kind of just happened..


## Usage

 - Create file and set config: `server/.env` (see `server/.env.example`)
 - Create file and set the players: `server/.players` (see `server/.players.example`)
 - Build the UI and Start the server: `npm start`

The server will serve the API and the UI on the `PORT` in the config

## Contributers
 - Nathan Pickworth
 - [ Your Name here ]

It is far from perfect, so please feel free to submit a PR against the develop branch! Anything goes. This is all just for a bit of fun!

> IMPORTANT: DO NOT commit sensitive data, personal info or any company related data to Git. There are `.players` and `.env` config files for this purpose


### TODO / IDEAS:
 - cache the scores so they don't need to be fetched each time
 - github integration
 - better error handling
 - unit tests
 - optimise/reduce the amount of jira queries
 - make a logo and a better name
 - websockets for score updates
 - some fun icons, avatars, etc would be nice
 - some kind of persistance, i.e. database would open up opportunities for cool features such as:
   - acheivements
   - level-up system
   - keeping track of scores for past sprints
   - plotting score line graphs etc. for each player
 - slack or email integration
 - configurable ui stuff like jira endpoint, etc


 