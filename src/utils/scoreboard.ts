import { rankingType, scoreboardType, topPlayerObject } from '../../types.js';
import { createFileIfNotExists, readFromFile, writeToFile } from './fsUtils.js';

const scoreboardPath = 'scoreboard.json';
const scoreboard:scoreboardType = readFromFile(scoreboardPath);

export const createScoreboard = (playerName:string):void => {
    createFileIfNotExists(scoreboardPath, { topScore: { player: null, score: 0 }, scores: {} });
    addPlayerToScoreboardIfNotExists(playerName)
}

export const getPlayerInScoreboardOrNull = (playerName:string):number => {
    return scoreboard.scores[playerName] || null
}

export const getTopScoreboard = ():topPlayerObject => {
    return scoreboard.topScore || null
}

export const addPlayerToScoreboardIfNotExists = (playerName:string):void => {
    !getPlayerInScoreboardOrNull(playerName) && updatePlayerScoreboard(playerName, 0)
}

export const updatePlayerScoreboard = (playerName:string, points:number):number => {
    scoreboard.scores[playerName] = points
    writeToFile(scoreboardPath, scoreboard)
    return scoreboard.scores[playerName]
}

export const updateTopScoreboard = (player:string, score:number) => {
    scoreboard.topScore = { player, score }
    writeToFile(scoreboardPath, scoreboard)
    return getTopScoreboard()
}

export const getRanking = (playerName:string):rankingType => {

    const sortedScoreboard = Object
        .entries(scoreboard.scores)
        .sort((player1, player2) => {
            if(player1[1] > player2[1]) return 1
            return -1
        }).reverse()

    const [index] = sortedScoreboard.map((player, index) => player[0] === playerName && index )
    return { player:index + 1, overAll:sortedScoreboard.length }
}