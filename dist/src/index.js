"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { existsSync, writeFileSync, readFileSync } = require('fs');
const readLine = require('readline').createInterface({ input: process.stdin, output: process.stdout });
const { exec } = require("child_process");
const index_js_1 = require("../constants/index.js");
if (!existsSync('./scoreBoard.json'))
    writeFileSync('./scoreBoard.json', JSON.stringify({ topScore: { player: null, score: 0 } }));
let scoreBoard = JSON.parse(readFileSync('./scoreBoard.json').toString());
const terminalInput = (question) => new Promise(resolve => readLine.question(question, (res) => resolve(res)));
const clearTerminal = (time) => new Promise((resolve) => setTimeout(() => resolve(console.clear()), time * 1000));
const setDisplayMessage = (msg) => console.log(msg);
if (require.main === module) {
    (async () => {
        await clearTerminal(0);
        if (index_js_1.should_play_responses.includes((await terminalInput(`${index_js_1.display_texts.should_play_game}:\n>>> `)).toLowerCase())) {
            let word = index_js_1.words_list[Math.floor(Math.random() * index_js_1.words_list.length)].toLowerCase();
            await clearTerminal(0);
            let player = await terminalInput("What's your name, player?\n>>> ");
            player = player.charAt(0).toUpperCase() + player.slice(1).toLowerCase();
            await clearTerminal(0);
            setDisplayMessage(`${scoreBoard[player] ? 'Welcome back' : 'Ok, lets play'}, ${player}!`);
            await clearTerminal(2);
            setDisplayMessage(index_js_1.display_texts.ready_to_play);
            await clearTerminal(4.5);
            playGame({ word, player, lives: word.length, points: 0, guess: null, lettersGuessed: new Array(word.length).fill("_") });
        }
        else {
            setDisplayMessage(index_js_1.display_texts.quit_game);
            readLine.close();
            await clearTerminal(2);
        }
    })();
}
const playGame = async (state) => {
    let { player, lives, word, guess, lettersGuessed, points } = state;
    player = player.charAt(0).toUpperCase() + player.slice(1).toLowerCase();
    const { score: topScore, player: topPlayer } = scoreBoard.topScore;
    const currentPlayer = { name: player, highScore: scoreBoard[player] || 0 };
    const displayHighScore = () => setDisplayMessage(`\x1b[4m${topPlayer || 'TopScore'}\x1b[0m: \x1b[0m\x1b[33m${topScore || 'None'}\x1b[0m | \x1b[0m\x1b[4m${currentPlayer.name}\x1b[0m: \x1b[33m${currentPlayer.highScore}\x1b[0m\n`);
    const displayGameData = () => setDisplayMessage(`Points: \x1b[32m${points} \x1b[0m Word: \x1b[32m ${lettersGuessed.join(" ")} \x1b[0m Lives: \x1b[32m${lives}\x1b[0m\n`);
    const updateScoreBoard = () => {
        if (points > scoreBoard[currentPlayer.name] || !scoreBoard[currentPlayer.name]) {
            scoreBoard[currentPlayer.name] = points;
        }
        if (points > topScore) {
            scoreBoard.topScore.score = points;
            scoreBoard.topScore.player = currentPlayer.name;
        }
        writeFileSync('./scoreBoard.json', JSON.stringify(scoreBoard));
    };
    const updateGame = async () => {
        if (guess === word) {
            lettersGuessed = guess.split('');
        }
        else {
            let indeciesOfPlayerGuessInRandomWord = word
                .split("")
                .map((letter, index) => (guess === letter ? index : null))
                .filter((indexes) => indexes != null);
            indeciesOfPlayerGuessInRandomWord.forEach((index) => (lettersGuessed[index] = guess));
        }
        updateScoreBoard();
        displayHighScore();
        displayGameData();
    };
    await clearTerminal(0);
    updateGame();
    if (guess !== 'quit') {
        if (!lives) {
            setDisplayMessage(index_js_1.display_texts.out_of_lives);
            await clearTerminal(2);
            exec('exit');
        }
        else if (guess === word || lettersGuessed.join('') === word) {
            setDisplayMessage(`${index_js_1.display_texts.player_wins} ${word}`);
            await clearTerminal(2);
            points += lives;
            updateGame();
            let newWord = index_js_1.words_list[Math.floor(Math.random() * index_js_1.words_list.length)].toLowerCase();
            return playGame({
                ...state,
                points,
                word: newWord,
                lives: newWord.length,
                guess: null,
                lettersGuessed: new Array(newWord.length).fill("_")
            });
        }
        else {
            if (!guess || word.includes(guess)) {
                playGame({ ...state, guess: (await terminalInput(`${index_js_1.display_texts.get_player_guess}:\n>>> `)).toLowerCase() });
            }
            else {
                --lives;
                await clearTerminal(0);
                updateGame();
                playGame({ ...state, lives, guess: (await terminalInput(`${index_js_1.display_texts.get_player_guess}:\n>>> `)).toLowerCase() });
            }
        }
    }
    else {
        setDisplayMessage(index_js_1.display_texts.quit_game);
        await clearTerminal(2);
        exec('exit');
        readLine.close();
    }
};
//# sourceMappingURL=index.js.map