import { should_play_responses, display_texts } from './constants/index.js';
import { clearTerminal, terminalInput, displayMessage, exitGame, underline, colorYellow, colorGreen } from './helpers/terminalHelpers'
import { createScoreboard, getRanking } from './utils/scoreboard.js';
import { Player } from './helpers/player';
import { TopRecord } from './helpers/topRecord.js';
import './helpers/stringHelpers';
import './helpers/arrayHelpers';
import { Game } from './helpers/game.js';


if (require.main === module) {
  
  (async ():Promise<void> => {
    await clearTerminal(0);

    if (should_play_responses.includes((await terminalInput( display_texts.should_play_game )).toLowerCase())) {
      await clearTerminal(0);

      const player = (await terminalInput(display_texts.get_player_name));
      const game = new Hangman(player)
      await clearTerminal(0);
      
      const { name : playerName, isNewPlayer } = game.getState('player')
      displayMessage(`${ isNewPlayer ? display_texts.new_player: display_texts.returning_player}, ${ playerName }!`);
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
  
  private game:Game = new Game()
  private topRecord:TopRecord;
  private player:Player;

  constructor(name:string){
    name = name._toCapitalize()
    createScoreboard(name);
    this.topRecord = new TopRecord();
    this.player = new Player(name);
  }
  
  private displayHighScore():void{ 
    const topPlayer = `${underline( this.topRecord.player ?? 'TopScore' )}`
    const topScore = `${colorYellow( this.topRecord.score )}`
    const playerName = `${underline(this.player.name)}`
    const playerScore = `${colorYellow(this.player.topScore)}`

    this.topRecord.player != this.player.name 
      ? displayMessage(`${topPlayer}:${topScore} | ${playerName}:${playerScore}\n`) 
      : displayMessage(`${topPlayer}:${topScore}\n`)
  }

  private displayGameData():void {
    const gamePoints = `Points:${ colorGreen(this.game.points) }`
    const gameLives = `Lives:${ colorGreen(this.game.lives) }`
    const lettersGuessed = `Word:${ colorGreen(this.game.formatLettersGuessed()) }`

    displayMessage(`${gamePoints} ${lettersGuessed} ${gameLives}\n`)
  }

  private updateScoreBoard = ():void => {

    if(this.game.points > this.player.topScore){
      this.player.updateScoreboardScore(this.game.points)
    }

    if(this.game.points > this.topRecord.score){
      this.topRecord.updateScoreboardTop(this.player.name, this.game.points)
    }
  }

  private updateGame = ():void => { 
    this.game.updateLettersGuessed()
    this.updateScoreBoard();
    this.displayHighScore();
    this.displayGameData();
  }

  public updateGuess = (playerGuess:string|null = null):void => {
    this.game.setGuess(playerGuess)
  }

  public updatePoints = ():void => {
    this.game.updatePoints()
  }

  public resetGame = async():Promise<void> => {
    this.game.reset()
  }

  public decrementLives = ():void => {
    this.game.decrementLives()
  }

  public getState = (key?: string ) => {
    if(key){
      return this[key]
    }
    return this
  }

  public play = async ():Promise<void> => {
    await clearTerminal(0);
    this.updateGame()
    
    if(this.game.guess === 'rank'){
      const { player, overAll } = getRanking(this.player.name)
      displayMessage(`You are ${ player } out of ${ overAll }`)
      this.updateGuess()
      await clearTerminal(2)
      return this.play()
    }

    if(this.game.guess === 'quit'){
      displayMessage(display_texts.quit_game);
      await clearTerminal(2);
      return exitGame();
    }

    if (!this.game.lives) {
      displayMessage(display_texts.out_of_lives);
      await clearTerminal(2);
      return exitGame();
    }
    
    if (this.game.isWordGuessed()) {
      displayMessage(`${ display_texts.player_wins } ${ this.game.word }`);
      await clearTerminal(2);  
      
      this.updatePoints()
      this.resetGame()
      return this.play()
    } 
    
    if (this.game.isGuessInWord() || !this.game.guess) {
      const playerGuess = (await terminalInput(display_texts.get_player_guess));
      this.updateGuess(playerGuess);
      return this.play();
    } 

    if(!this.game.isGuessInWord()){
      this.decrementLives()
      this.updateGuess()
      await clearTerminal(0); 
      return this.play();
    }
    
  };
}
