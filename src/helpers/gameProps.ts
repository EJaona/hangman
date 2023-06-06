import { words_list } from "../constants"

export class GameProps{
    public word:string = words_list._pickRandomValue()
    public points:number = 0
    public lives:number = 6
    public guess:string|null = null
    public lettersGuessed:Array<string> = new Array(this.word.length).fill("_")

    public reset():void{
        this.word = words_list._pickRandomValue()
        this.lives = 6
        this.guess = null
        this.lettersGuessed = new Array(this.word.length).fill("_")
    }

    public decrementLives():void{
        this.lives--
    }

    public setGuess(playerGuess:string):void{
        this.guess = playerGuess
        this.updateLettersGuessed()
    }

    public isWordGuessed():boolean{
        return this.formatLettersGuessed("") === this.word._toCapitalize()
    }

    public isGuessInWord():boolean{
        return this.word.includes(this.guess)
    }

    public formatLettersGuessed(formatOption:string = " "):string{
        return this.lettersGuessed.join(formatOption)._toCapitalize()
    }

    public updateLettersGuessed():void{
        if(this.guess === this.word){
            this.lettersGuessed = this.guess.split("");
        }else{
            let indicesOfPlayerGuessInRandomWord = this.word._map((letter, index) => this.guess === letter && index)
        
            indicesOfPlayerGuessInRandomWord.forEach(
                index => this.lettersGuessed[index] = this.guess
            )
        }
    }

    public updatePoints():void{
        this.points += this.lives
    }
}