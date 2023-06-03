import { words_list } from "../constants"

export class Game{
    word:string = words_list._pickRandomValue()
    points:number = 0
    lives:number = 6
    guess:string|null = null
    lettersGuessed:Array<string> = new Array(this.word.length).fill("_")

    reset():void{
        this.word = words_list._pickRandomValue()
        this.lives = 6
        this.guess = null
        this.lettersGuessed = new Array(this.word.length).fill("_")
    }

    decrementLives():void{
        this.lives--
    }

    setGuess(playerGuess:string):void{
        this.guess = playerGuess
    }

    isWordGuessed():boolean{
        return this.formatLettersGuessed("") === this.word._toCapitalize()
    }

    isGuessInWord():boolean{
        return this.word.includes(this.guess)
    }

    formatLettersGuessed(formatOption:string = " "):string{
        return this.lettersGuessed.join(formatOption)._toCapitalize()
    }

    updateLettersGuessed():void{
        if(this.guess === this.word){
            this.lettersGuessed = this.guess.split("");
        }else{
            let indicesOfPlayerGuessInRandomWord = this.word._map((letter, index) => this.guess === letter && index)
        
            indicesOfPlayerGuessInRandomWord.forEach(
                index => this.lettersGuessed[index] = this.guess
            )
        }
    }

    updatePoints():void{
        this.points += this.lives
    }
}