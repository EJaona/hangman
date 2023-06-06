import { getTopScoreboardOrNull, updateTopScoreboard } from "../utils/scoreboard";

export class TopRecord{

    public player:string;
    public score:number;

    constructor(){
        const topRecord = getTopScoreboardOrNull()
        this.player = topRecord?.player
        this.score = topRecord?.score
    }

    public updateScoreboardTop(playerName:string, currentPoints:number):void{
        const { player, score } = updateTopScoreboard(playerName, currentPoints)
        this.player = player
        this.score = score
    }
}