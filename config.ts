export interface gameStateType {
    player:string,
    lives:number, 
    word:string, 
    guess:null|string, 
    lettersGuessed:null|string[], 
    points:number, 
    setDisplayMessage:(msg:string)=>void,
    terminalInput?: (question:string)=>Promise<string>,
    clearTerminal?: (time:number)=>Promise<void>,
    exec?: (command:string)=>void,
    readLine?: {
        close: ()=>Promise<string>
    },
    writeFileSync?: (path:string, file:string )=>void,
    scoreBoard: {
        topScore: {
            player:string,
            score:number,
        }
    },
}

export interface currentPlayerType {
    name:string,
    highScore:number
}