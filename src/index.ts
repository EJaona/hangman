import { existsSync, writeFileSync, readFileSync } from 'fs';
import { clearTerminal, terminalInput, setDisplayMessage, exitGame } from './helpers/terminalHelpers'
import { words_list, should_play_responses, display_texts } from '../constants/index.js';
import type { currentPlayerObject } from "../types";

if(!existsSync('./scoreBoard.json'))writeFileSync('./scoreBoard.json', JSON.stringify({ topScore:{ player:null, score:0 } }));
let scoreBoard = JSON.parse(readFileSync('./scoreBoard.json').toString());

if (require.main === module) {
  
  (async ():Promise<void> => {
    await clearTerminal(0);

    if (should_play_responses.includes( (await terminalInput(`${ display_texts.should_play_game }:\n>>> `)).toLowerCase() )) {
      await clearTerminal(0);

      let player = await terminalInput("What's your name, player?\n>>> ");
      player = player.charAt(0).toUpperCase() + player.slice(1).toLowerCase()
      
      const hangman = new Hangman(player)
      await clearTerminal(0);

      setDisplayMessage(`${scoreBoard[player]? 'Welcome back' : 'Ok, lets play'}, ${ player }!`);
      await clearTerminal(2);
      
      setDisplayMessage(display_texts.ready_to_play);
      await clearTerminal(4.5);
      
      hangman.playGame();

    } else {
      setDisplayMessage(display_texts.quit_game);
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
  private lettersGuessed: any[];
  private word: string;
  private userGuess: string;

  constructor(player:string){
    this.word = words_list[Math.floor(Math.random() * words_list.length)].toLowerCase()
    this.points = 0
    this.userGuess = null
    this.lettersGuessed = new Array(this.word.length).fill("_")

    this.topPlayer = scoreBoard.topScore.player
    this.topScore = scoreBoard.topScore.score
    
    this.currentPlayer = {
      name: player.charAt(0).toUpperCase() + player.slice(1).toLowerCase(),
      highScore: scoreBoard[player] || 0 ,
      lives: this.word.length
    }
  }
  
  private displayHighScore = ():void => setDisplayMessage(`\x1b[4m${ this.topPlayer || 'TopScore' }\x1b[0m: \x1b[0m\x1b[33m${ this.topScore || 'None' }\x1b[0m | \x1b[0m\x1b[4m${ this.currentPlayer.name }\x1b[0m: \x1b[33m${ this.currentPlayer.highScore }\x1b[0m\n`);

  private displayGameData = ():void =>setDisplayMessage(`Points: \x1b[32m${ this.points } \x1b[0m Word: \x1b[32m ${ this.lettersGuessed.join(" ") } \x1b[0m Lives: \x1b[32m${ this.currentPlayer.lives }\x1b[0m\n`);

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
    writeFileSync('./scoreBoard.json', JSON.stringify(scoreBoard) );
  }

  private updateGame = async (): Promise<void> => { 
   
    if(this.userGuess === this.word){
      this.lettersGuessed = this.userGuess.split('');

    }else{
      let indicesOfPlayerGuessInRandomWord = this.word
        .split("")
        .map((letter, index) => this.userGuess === letter && index)
  
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
        setDisplayMessage(display_texts.out_of_lives);
        await clearTerminal(2);
        exitGame();
        
      } else if (this.userGuess === this.word || this.lettersGuessed.join('') === this.word) {
        setDisplayMessage(`${display_texts.player_wins} ${ this.word }`);
        await clearTerminal(2);  
  
        const currentPoints = this.points += this.currentPlayer.lives;
        const nextGame = new Hangman(this.currentPlayer.name)
        nextGame.points = currentPoints
        nextGame.playGame()
    
      } else {

        if ( !this.userGuess || this.word.includes(this.userGuess)) {
          this.userGuess = (await terminalInput(`${display_texts.get_player_guess}:\n>>> `)).toLowerCase();
          this.playGame();

        } else {
          --this.currentPlayer.lives;
          this.userGuess = null;
          await clearTerminal(0); 
          this.playGame();

        }
      }
    }else{
      setDisplayMessage(display_texts.quit_game);
      await clearTerminal(2);
      exitGame();

    }
  };

}
