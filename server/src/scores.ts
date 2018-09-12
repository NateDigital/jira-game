
import client from 'axios'
import getPlayers from './players'
import rules from './rules'
import * as _ from 'lodash'
// TODO: https://github.com/octokit/rest.js

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

export const buildScoresFromIssues = async (headers, team) => {
  const playersWithScores = getPlayers(team).map(async currentPlayer => {
    const player = Object.assign({}, currentPlayer)
    const scoring = []
    let points = 0

    for (const rule of rules.issues) {
      const jql = rule.jql(player.username)
      const ruleDetails = { name: rule.name, jql, type: rule.type, pointMultiplier: rule.pointMultiplier}

      try {
        const path = `${process.env.JIRA_ENDPOINT}/rest/api/2/search`
        const searchResults = await client.post(path, { jql }, { headers })
        const issueKeys = searchResults.data.issues.map(issue => issue.key)    
        const numberOfIssues = issueKeys.length
        const userPointsForIssues = numberOfIssues * rule.pointMultiplier

        if (numberOfIssues > 0) {
          points += userPointsForIssues
          scoring.push({
            ...ruleDetails,
            numberOfIssues,
            issueKeys,
            userPointsForIssues,
          })
        }

      } catch (err) {
        const jiraError = _.get(err, ['response', 'data', 'errorMessages'])
        if (jiraError) {
          player.errors.push({ jiraError, ...ruleDetails })
        } else {
          const fallbackError = _.get(err, ['response', 'data'], err)
          player.errors.push({ fallbackError, ...ruleDetails })
        }
      }
    }

    return { ...player, scoring, points }
  })
  return Promise.all(playersWithScores)
}

export const sortPlayersByPoints = (a, b) => b.points - a.points
