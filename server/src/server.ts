import * as dotenv from 'dotenv'
dotenv.config()
import { say } from 'cowsay'
import * as express from 'express'
import auth from './auth'
import * as scores from './scores'
import view from './view'
import chalk from 'chalk'
import * as cors from 'cors'
import * as path from 'path'

const basicAuth = require('express-basic-auth')
const staticClientFiles = path.resolve(__dirname, '../../client/dist')

const app = express()

const fetchData = async team => {
    const headers = await auth()
    if (!headers) {
        console.log('failed to auth!')
    }
    const scoreData = await scores.buildScoresFromIssues(headers, team)
    const sortedScoreData = scoreData.sort(scores.sortPlayersByPoints)
    return sortedScoreData;
}

const handler = async (req, res) => {
    res.json(await fetchData(req.params.team))
}


app.use(basicAuth({
    users: { [process.env.APP_AUTH_USERNAME]: process.env.APP_AUTH_PASSWORD },
    challenge: true,
    realm: 'Private Game',
}))

// support for multiple teams was dropped!
app.get('/scores/:team', cors(), handler) // deprecate

app.get('/scores', cors(), handler)
app.use('/', express.static(staticClientFiles))

const printScores = async () => view(await fetchData(process.env.DEFAULT_TEAM))
// const printScores = async () => console.log(JSON.stringify(await fetchData(), null, 2))

const main = () => {

    console.log(chalk.yellowBright(say({ text: 'Welcome to JIRA GAME!!'})))

    app.listen(parseInt(process.env.PORT) || 3000, () => { 
            console.log(chalk.cyanBright('\n Server Listening on port 3000!'))
            console.log(chalk.redBright('\n*** Loading the Leaderboard ***'))
            console.log(chalk.redBright('       ...Please Wait...'))

            // Print the leaderboard in the console, and refresh periodically
            printScores()
            //setInterval(printScores, 1000 * parseInt(process.env.SERVER_REFRESH_SECONDS))
        }
    )
}

main()
