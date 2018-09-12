
import chalk from 'chalk'
import * as figlet from 'figlet'
import * as leftPad from 'left-pad'

const fig = (text, opts = {}) => new Promise(resolve => {
    figlet.text(text, opts, function(err, data) {
        if (err) {
            console.error('Something went wrong with figlet');
            resolve(null)
        }
        resolve(data)
    });
})

export default async playerData => {
    const padding = 20
    const rightPadding = '                                                     '
    const headings = [ 'Name', 'Score' ]

    const titleRow = headings.map(title => {
        return leftPad(title, padding)
    })
    const footerRow = headings.map(title => {
        return leftPad('', padding)
    })
    const playerRows = playerData.map(player => {
        return chalk.greenBright(leftPad(player.name, padding))
            + chalk.yellowBright(leftPad(player.points, padding))
            + rightPadding
    })

    // clear the screen:
    process.stdout.write('\033c');

    // PRINT DIVIDER ROW
    console.log(chalk.black(chalk.bgGreenBright(footerRow.join('') + rightPadding)))

    // PRINT HEADING
    console.log(chalk.bgGreen(   '                                                                       '))
    const headingText: any = await fig('LEADERBOARD')
    // const headingText: any = await fig('LEADERBOARD', {font: 'DOS Rebel'})
    console.log(chalk.cyanBright(headingText))
    console.log(chalk.bgGreen(   '                                                                       '))

    // PRINT TITLE ROW
    console.log(chalk.black(chalk.bgGreenBright(titleRow.join('') + rightPadding)))

    // PRINT PLAYER ROWS
    console.log(playerRows.join("\n"))
    console.log(chalk.bgGreen(   '                                                                       '))

    // PRINT FOOTER ROW
    console.log(chalk.black(chalk.bgGreenBright(footerRow.join('') + rightPadding)))

}