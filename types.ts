export interface currentPlayerObject {
    name: string;
    highScore: number;
}

export interface topPlayerObject{
    player: string
    score: number
}

export interface ranking{
    player: string
    overAll: number
}

export interface scoreboard{
    topScore:{
        player:string,
        score:number
    },
    scores:{}
}