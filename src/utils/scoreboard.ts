import { ranking, scoreboard, topPlayerObject } from '../../types.js';
import { createFileIfNotExists, readFromFile, writeToFile } from '../helpers/fileSystemHelpers.js';

const scoreboardPath = 'scoreboard.json'

export const createScoreboard = () => {
    createFileIfNotExists(scoreboardPath, { topScore: { player: null, score: 0 }, scores: {} });
}

export const getPlayerInScoreboard = (playerName:string):number => {
    const scoreboard:scoreboard = readFromFile(scoreboardPath);
    return scoreboard.scores[playerName]
}

export const getTopScoreboard = ():topPlayerObject => {
    const scoreboard:scoreboard = readFromFile(scoreboardPath);
    return scoreboard.topScore
}

export const addPlayerToScoreboard = (playerName:string):void => {
    const scoreboard:scoreboard = readFromFile(scoreboardPath);
    if(!scoreboard.scores[playerName]){
        scoreboard.scores[playerName] = 0
    }
    writeToFile(scoreboardPath, scoreboard)
}

export const updatePlayerScoreboard = (playerName:string, points:number):number => {
    const scoreboard:scoreboard = readFromFile(scoreboardPath);
    scoreboard.scores[playerName] = points
    writeToFile(scoreboardPath, scoreboard)
    return scoreboard.scores[playerName]
}

export const updateTopScoreboard = (playerName:string, points:number) => {
    const scoreboard:scoreboard = readFromFile(scoreboardPath);
    scoreboard.topScore.player = playerName
    scoreboard.topScore.score = points
    writeToFile(scoreboardPath, scoreboard)
    return getTopScoreboard()
}

export const getRanking = (playerName:string):ranking => {
    const scoreboard:scoreboard = readFromFile(scoreboardPath)
    const rankingList = Object.values(scoreboard.scores).sort().reverse()
    const playerRank = rankingList.indexOf(scoreboard.scores[playerName])
    let rank:string;
    switch(playerRank){
        case 0:
          rank = "1st"
          break
        case 1:
          rank = "2nd"
          break
        case 2:
          rank = "3nd"
          break
        default:
          rank = `${playerRank}th`
          break
      }
    return {player:rank, overAll:rankingList.length}
}