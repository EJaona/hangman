import { words_list, should_play_responses, display_texts } from './constants/index.js';
import type { currentPlayerObject, topPlayerObject } from "../types";
import { clearTerminal, terminalInput, displayMessage, exitGame, underline, colorYellow, colorGreen } from './helpers/terminalHelpers'
import { createScoreboard, getTopScoreboard, getPlayerInScoreboard, updatePlayerScoreboard, updateTopScoreboard, getRanking, addPlayerToScoreboard } from './utils/scoreboard.js';
import './helpers/stringHelpers';
import './helpers/arrayHelpers';

createScoreboard()


if (require.main === module) {
  
  (async ():Promise<void> => {
    await clearTerminal(0);

    if (should_play_responses.includes( (await terminalInput( display_texts.should_play_game )).toLowerCase() )) {
      await clearTerminal(0);

      let player = (await terminalInput("What's your name, player?"))._toCapitalize();
      const game = new Hangman(player)
      await clearTerminal(0);

      displayMessage(`${ getPlayerInScoreboard(player) ? 'Welcome back' : 'Ok, lets play'}, ${ player }!`);
      await clearTerminal(2);
      
      displayMessage(display_texts.ready_to_play);
      await clearTerminal(4.5);
      
     game.play();

    } else {
      displayMessage(display_texts.quit_game);
      await clearTerminal(2);
      exitGame()
    }

  })();
}    

class Hangman {

  private word: string = words_list._pickRandomValue();
  private points: number = 0;
  private lives: number = 6;

  private userGuess: string = null;
  private lettersGuessed: string[] = new Array(this.word.length).fill("_");

  private top:topPlayerObject = getTopScoreboard()
  private currentPlayer: currentPlayerObject;

  constructor(player:string){
    createScoreboard()
    player = player._toCapitalize()
    addPlayerToScoreboard(player)

    this.currentPlayer = {
      name: player,
      highScore: getPlayerInScoreboard(player)
    }

  }
  
  private displayHighScore():void{ 
    displayMessage(`${ underline( this.top.player ?? 'TopScore' ) }: ${ colorYellow( this.top.score ) } | ${ underline(this.currentPlayer.name) }: ${ colorYellow(this.currentPlayer.highScore) }\n`)
  }

  private displayGameData():void {
    displayMessage(`Points:${ colorGreen(this.points) } Word:${ colorGreen(this.lettersGuessed.join(" ")._toCapitalize()) } Lives:${ colorGreen(this.lives) }\n`)
  }

  private updateScoreBoard = ():void => {

    if(this.points > this.currentPlayer.highScore){
      const updatedPlayerScore = updatePlayerScoreboard(this.currentPlayer.name, this.points)
      this.currentPlayer.highScore = updatedPlayerScore
    }

    if(this.points > this.top.score){
      const updatedTopScore = updateTopScoreboard(this.currentPlayer.name, this.points)
      this.top = updatedTopScore
    }
  }

  private updateGame = (): void => { 
   
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

  public updateGuess = (guess:string|null = null):void => {
    this.userGuess = guess
  }

  public resetWord = ():void => {
    this.word = words_list._pickRandomValue();
    this.lettersGuessed = new Array(this.word.length).fill("_");
    this.updateGuess()
  }

  public resetLives = ():void => {
    this.lives = 6
  }

  public decrementLives = ():void => {
    this.lives--
  }

  public updatePoints = ():void => {
    const currentPoints = this.points += this.lives;
    this.points = currentPoints
  }

  public getState = (key: string | null = null) => {
    if(key){
      return this[key]
    }
    return this
  }

  public play = async ():Promise<void> => {
    await clearTerminal(0);
    this.updateGame()

    if(this.userGuess === 'rank'){
      const rank = getRanking(this.currentPlayer.name)
      displayMessage(`You are ${rank.player} out of ${rank.overAll}`)
      this.updateGuess()
      await clearTerminal(2)
      return this.play()
    }

    if(this.userGuess === 'quit'){
      displayMessage(display_texts.quit_game);
      await clearTerminal(2);
      return exitGame();
    }

    if (!this.lives) {
      displayMessage(display_texts.out_of_lives);
      await clearTerminal(2);
      return exitGame();
    }
    
    if (this.userGuess === this.word || this.lettersGuessed.join('') === this.word) {
      displayMessage(`${ display_texts.player_wins } ${ this.word._toCapitalize() }`);
      await clearTerminal(2);  

      this.updatePoints()
      this.resetWord()
      this.resetLives()
      return this.play()
  
    } 
    
    if ( !this.userGuess || this.word.includes(this.userGuess) ) {
      const userInput = (await terminalInput(display_texts.get_player_guess)).toLowerCase()
      this.updateGuess(userInput);
      return this.play();

    } 

    this.decrementLives()
    this.updateGuess()

    await clearTerminal(0); 
    return this.play();
    
  };
}
