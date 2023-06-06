import { getPlayerScoreboardRecordOrNull, getRanking, updatePlayerScoreboard } from "../utils/scoreboard";

export class Player{

    public name:string;
    public scoreRecord:number;
    public isNewPlayer:boolean

    constructor(playerName:string){
        this.name = playerName
        this.scoreRecord = getPlayerScoreboardRecordOrNull(playerName) ?? 0
        this.isNewPlayer = !this.scoreRecord
    }

    public updateScoreboardScore(currentPoints:number):void{
        this.scoreRecord = updatePlayerScoreboard(this.name, currentPoints)
    }

    public getScoreboardRanking(){
        return getRanking(this.name)
    }
}