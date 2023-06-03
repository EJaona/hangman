
export interface topPlayerObject{
    player: string
    score: number
}

export interface rankingType{
    player: number
    overAll: number
}

export interface scoreboardType{
    topScore:{
        player:string,
        score:number
    },
    scores:{}
}
