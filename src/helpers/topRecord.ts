import { getTopScoreboard, updateTopScoreboard } from "../utils/scoreboard";

export class TopRecord{

    player:string;
    score:number;

    constructor(){
        const { player, score } = getTopScoreboard()
        this.player = player
        this.score = score
    }

    updateScoreboardTop(playerName:string, currentPoints:number):void{
        const { player, score } = updateTopScoreboard(playerName, currentPoints)
        this.player = player
        this.score = score
    }
}