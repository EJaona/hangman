import { words_list, should_play_responses, display_texts } from './constants/index.js';
import type { currentPlayerObject } from "../types";
import { clearTerminal, terminalInput, displayMessage, exitGame, underline, colorYellow, colorGreen } from './helpers/terminalHelpers'
import { createFileIfNotExists, readFromFile, writeToFile } from './helpers/fileSystemHelpers';
import './helpers/stringHelpers';
import './helpers/arrayHelpers';

createFileIfNotExists('./scoreBoard.json', { topScore: { player: null, score: 0 } });
let scoreBoard = readFromFile('./scoreBoard.json');

if (require.main === module) {
  
  (async ():Promise<void> => {
    await clearTerminal(0);

    if (should_play_responses.includes( (await terminalInput( display_texts.should_play_game )).toLowerCase() )) {
      await clearTerminal(0);

      let player = (await terminalInput("What's your name, player?"))._toCapitalize();
      
      const hangman = new Hangman(player)
      await clearTerminal(0);

      displayMessage(`${ scoreBoard[player]? 'Welcome back' : 'Ok, lets play'}, ${ player }!`);
      await clearTerminal(2);
      
      displayMessage(display_texts.ready_to_play);
      await clearTerminal(4.5);
      
      hangman.playGame();

    } else {
      displayMessage(display_texts.quit_game);
      await clearTerminal(2);
      exitGame()
    }

  })();
}    

class Hangman {

  private topPlayer: string;
  private topScore: number;
  private points: number;
  private currentPlayer: currentPlayerObject;
  private lettersGuessed: string[];
  private word: string;
  private userGuess: string;

  constructor(player:string){

    this.word = words_list._pickRandomWord()
    this.points = 0
    this.userGuess = null
    this.lettersGuessed = new Array(this.word.length).fill("_")

    this.topPlayer = scoreBoard.topScore.player
    this.topScore = scoreBoard.topScore.score
    
    this.currentPlayer = {
      name: player._toCapitalize(),
      highScore: scoreBoard[player] || 0 ,
      lives: this.word.length
    }

  }
  
  private displayHighScore = ():void => displayMessage(`${ underline( this.topPlayer || 'TopScore' ) }: ${ colorYellow( this.topScore || 'None') } | ${ underline(this.currentPlayer.name) }: ${ colorYellow(this.currentPlayer.highScore) }\n`);

  private displayGameData = ():void =>displayMessage(`Points:${ colorGreen(this.points) } Word:${ colorGreen(this.lettersGuessed.join(" ")._toCapitalize()) } Lives:${ colorGreen(this.currentPlayer.lives) }\n`);

  private updateScoreBoard = ():void => {

    if(this.points > scoreBoard[this.currentPlayer.name] || !scoreBoard[this.currentPlayer.name]){

      scoreBoard[this.currentPlayer.name] = this.points;
      this.currentPlayer.highScore = scoreBoard[this.currentPlayer.name]

    }
    if(this.points > this.topScore){

      scoreBoard.topScore.score = this.points;
      scoreBoard.topScore.player = this.currentPlayer.name;

      this.topScore = scoreBoard.topScore.score
      this.topPlayer = scoreBoard.topScore.player

    }
    writeToFile('./scoreBoard.json', scoreBoard );
  }

  private updateGame = async (): Promise<void> => { 
   
    if(this.userGuess === this.word){
      this.lettersGuessed = this.userGuess.split('');

    }else{
      let indicesOfPlayerGuessInRandomWord = this.word._map((letter, index) => this.userGuess === letter && index)

      indicesOfPlayerGuessInRandomWord.forEach(
        index => this.lettersGuessed[index] = this.userGuess
      )

    }
    this.updateScoreBoard();
    this.displayHighScore();
    this.displayGameData();
  }

  public playGame = async (): Promise<void> => {
    await clearTerminal(0);
    this.updateGame()

    if(this.userGuess !== 'quit'){

      if (!this.currentPlayer.lives) {
        displayMessage(display_texts.out_of_lives);
        await clearTerminal(2);
        exitGame();
        
      } else if (this.userGuess === this.word || this.lettersGuessed.join('') === this.word) {
        displayMessage(`${ display_texts.player_wins } ${ this.word._toCapitalize() }`);
        await clearTerminal(2);  
  
        const currentPoints = this.points += this.currentPlayer.lives;
        const nextGame = new Hangman(this.currentPlayer.name)
        nextGame.points = currentPoints
        nextGame.playGame()
    
      } else {

        if ( !this.userGuess || this.word.includes(this.userGuess) ) {
          this.userGuess = (await terminalInput(display_texts.get_player_guess)).toLowerCase();
          this.playGame();

        } else {
          --this.currentPlayer.lives;
          this.userGuess = null;
          await clearTerminal(0); 
          this.playGame();

        }
      }
      
    }else{
      displayMessage(display_texts.quit_game);
      await clearTerminal(2);
      exitGame();

    }
  };

}
