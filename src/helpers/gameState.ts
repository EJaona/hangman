import { rankingType } from "../../types"
import { GameProps } from "./gameProps"
import { Player } from "./player"
import { TopRecord } from "./topRecord"


export class GameState {
    public topRecord:TopRecord
    public word:string
    public lives:number
    public guess:string|null
    public points:number
    public lettersGuessed:Array<string>
    public player:Player
    public ranking:rankingType

    constructor(gameProps:GameProps, player:Player, topRecord:TopRecord){
        this.topRecord = topRecord
        this.word = gameProps.word
        this.lives = gameProps.lives
        this.guess = gameProps.guess
        this.points = gameProps.points
        this.lettersGuessed = gameProps.lettersGuessed
        this.player = player
        this.ranking = player.getScoreboardRanking()
    }
}