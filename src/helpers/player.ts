import { getPlayerInScoreboardOrNull, updatePlayerScoreboard } from "../utils/scoreboard";

export class Player{

    name:string;
    topScore:number;
    isNewPlayer:boolean

    constructor(playerName:string){
        this.name = playerName
        this.topScore = getPlayerInScoreboardOrNull(playerName) ?? 0
        this.isNewPlayer = !this.topScore
    }

    updateScoreboardScore(currentPoints:number){
        this.topScore = updatePlayerScoreboard(this.name, currentPoints)
    }
}