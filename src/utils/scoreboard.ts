import { rankingType, scoreboardType } from '../../types.js';
import { TopRecord } from '../helpers/topRecord.js';
import { createFileIfNotExists, readFromFile, writeToFile } from './fsUtils.js';

const scoreboardPath = 'scoreboard.json';

export const createScoreboard = (playerName:string):void => {
    createFileIfNotExists(scoreboardPath, { topScore: { player: null, score: 0 }, scores: {} });
    addPlayerToScoreboardIfNotExists(playerName)
}

export const getPlayerScoreboardRecordOrNull = (playerName:string):number => {
    const scoreboard:scoreboardType = readFromFile(scoreboardPath);
    return scoreboard?.scores[playerName] || null
}

export const getTopScoreboardOrNull = ():Partial<TopRecord> | null => {
    const scoreboard:scoreboardType = readFromFile(scoreboardPath);
    return scoreboard?.topScore || null
}

export const addPlayerToScoreboardIfNotExists = (playerName:string):void => {
    !getPlayerScoreboardRecordOrNull(playerName) && updatePlayerScoreboard(playerName, 0)
}

export const updatePlayerScoreboard = (playerName:string, points:number):number => {
    const scoreboard:scoreboardType = readFromFile(scoreboardPath);
    scoreboard.scores[playerName] = points
    writeToFile(scoreboardPath, scoreboard)
    return scoreboard?.scores[playerName]
}

export const updateTopScoreboard = (playerName:string, score:number):Partial<TopRecord> => {
    const scoreboard:scoreboardType = readFromFile(scoreboardPath);
    scoreboard.topScore = { player:playerName, score }
    writeToFile(scoreboardPath, scoreboard)
    return getTopScoreboardOrNull()
}

export const getRanking = (playerName:string):rankingType => {
    const scoreboard:scoreboardType = readFromFile(scoreboardPath);

    const sortedScoreboard = Object.entries(scoreboard?.scores)
        .sort((player1, player2) => {
            if(player1[1] > player2[1]) return 1
            return -1
        }).reverse()

    const [playerIndexInScoreboard] = sortedScoreboard?.map((player, index) => player[0] === playerName && index )
    return { player:playerIndexInScoreboard + 1, overAll:sortedScoreboard?.length }
}