
const commonFields = { points: 0, scoring: [], errors: [] }
import * as fs from 'fs'
import * as path from 'path'
import * as changeCase from 'change-case'

const playersFile = fs.readFileSync(path.resolve(path.join(__dirname, '../.players')), 'utf8')
const playerList = playersFile.split('\n')
const buildName = username => changeCase.title(username.split('@')[0].replace('.', ' '))
const firstName = fullName => fullName.split(' ')[0]
const playerMapper = username => ({ username, name: firstName(buildName(username)), ...commonFields})
const players = () => ({[process.env.DEFAULT_TEAM] : playerList.map(playerMapper)})

const getPlayers = (team) => {
  const playersClone = Object.assign({}, players())
  const teamPlayers = playersClone[team]
  if (!teamPlayers || !team) {
    return playersClone[process.env.DEFAULT_TEAM] || []
  }
  return teamPlayers
}

export default getPlayers
