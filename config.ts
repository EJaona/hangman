export interface gameStateType {
    player:string,
    lives:number, 
    word:string, 
    guess:null|string, 
    lettersGuessed:null|string[], 
    points:number, 
}

export interface currentPlayerType {
    name:string,
    highScore:number
}