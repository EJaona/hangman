import { should_play_responses, display_texts } from './constants/index.js';
import { clearTerminal, terminalInput, displayMessage, exitGame, underline, colorYellow, colorGreen } from './helpers/terminalHelpers'
import { createScoreboard } from './utils/scoreboard.js';
import { Player } from './helpers/player';
import { TopRecord } from './helpers/topRecord.js';
import './helpers/stringHelpers';
import './helpers/arrayHelpers';
import { GameProps } from './helpers/gameProps.js';
import { GameState } from './helpers/gameState.js';


if (require.main === module) {
  
  (async ():Promise<void> => {
    await clearTerminal(0);

    if (should_play_responses.includes((await terminalInput( display_texts.should_play_game )).toLowerCase())) {
      await clearTerminal(0);

      const player = (await terminalInput(display_texts.get_player_name));
      const game = new Hangman(player)
      await clearTerminal(0);
      
      const { name : playerName, isNewPlayer } = game.getState().player;
      displayMessage(`${ isNewPlayer ? display_texts.new_player: display_texts.returning_player}, ${ playerName }!`);
      await clearTerminal(2);
      
      displayMessage(display_texts.ready_to_play);
      await clearTerminal(4.5);
      
     game.play();

    } else {
      displayMessage(display_texts.quit_game);
      await clearTerminal(2);
      exitGame();
    }

  })();
}    

class Hangman {
  
  private player:Player;
  private topRecord:TopRecord
  private gameProps:GameProps = new GameProps();

  constructor(name:string){
    name = name._toCapitalize();
    createScoreboard(name);
    this.player = new Player(name);
    this.topRecord = new TopRecord();
  }
  
  private displayHighScore():void{ 
    const topPlayer = `${underline( this.topRecord.player ?? 'TopScore' )}`;
    const topScore = `${colorYellow( this.topRecord.score )}`;
    const playerName = `${underline(this.player.name)}`;
    const playerScore = `${colorYellow(this.player.scoreRecord)}`;

    this.topRecord.player != this.player.name 
      ? displayMessage(`${topPlayer}:${topScore} | ${playerName}:${playerScore}\n`) 
      : displayMessage(`${topPlayer}:${topScore}\n`);
  }

  private displayGameData():void {
    const gamePoints:string = `Points:${ colorGreen(this.gameProps.points) }`;
    const gameLives:string = `Lives:${ colorGreen(this.gameProps.lives) }`;
    const lettersGuessed:string = `Word:${ colorGreen(this.gameProps.formatLettersGuessed()) }`;

    displayMessage(`${gamePoints} ${lettersGuessed} ${gameLives}\n`);
  }

  private updateScoreBoard = ():void => {

    if(this.gameProps.points > this.player.scoreRecord){
      this.player.updateScoreboardScore(this.gameProps.points);
    }

    if(this.gameProps.points > this.topRecord.score){
      this.topRecord.updateScoreboardTop(this.player.name, this.gameProps.points);
    }
  }

  private updateGame = ():void => { 
    this.updateScoreBoard();
    this.displayHighScore();
    this.displayGameData();
  }

  public setGuessOrNull = (playerGuess:string|null = null):void => {
    this.gameProps.setGuess(playerGuess);
  }

  public updatePoints = ():void => {
    this.gameProps.updatePoints();
  }

  public resetGame = ():void => {
    this.gameProps.reset();
  }

  public decrementLives = ():void => {
    this.gameProps.decrementLives();
  }

  public getState = ():GameState => {
    return new GameState(this.gameProps, this.player, this.topRecord)
  }

  public play = async ():Promise<void> => {
    await clearTerminal(0);
    this.updateGame();
    
    if(this.gameProps.guess === 'rank'){
      const { player, overAll } = this.getState().ranking
      displayMessage(`You are ${ player } out of ${ overAll }`);
      this.setGuessOrNull();
      await clearTerminal(2);
      return this.play();
    }

    if(this.gameProps.guess === 'quit'){
      displayMessage(display_texts.quit_game);
      await clearTerminal(2);
      return exitGame();
    }

    if (!this.gameProps.lives) {
      displayMessage(display_texts.out_of_lives);
      await clearTerminal(2);
      return exitGame();
    }
    
    if (this.gameProps.isWordGuessed()) {
      displayMessage(`${ display_texts.player_wins } ${ this.gameProps.word }`);
      await clearTerminal(2);  
      
      this.updatePoints();
      this.resetGame();
      return this.play();
    } 
    
    if (this.gameProps.isGuessInWord() || !this.gameProps.guess) {
      const playerGuess = (await terminalInput(display_texts.get_player_guess));
      this.setGuessOrNull(playerGuess);
      return this.play();
    } 

    if(!this.gameProps.isGuessInWord()){
      this.decrementLives();
      this.setGuessOrNull();
      await clearTerminal(0); 
      return this.play();
    }
    
  };
}
