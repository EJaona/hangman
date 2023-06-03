import { createInterface } from 'readline';
import { exec } from "child_process";

const readline = createInterface({input: process.stdin, output: process.stdout});

export const terminalInput = (question:string):Promise<string> => new Promise( resolve => readline.question( `${question}:\n>>> `, (res:string) => resolve(res) ) );

export const clearTerminal = (time:number):Promise<void> => new Promise((resolve) => setTimeout( () => resolve(console.clear()), time * 1000));

export const displayMessage = (msg:string):void => console.log(msg);

export const exitGame = ():void => { readline.close(), exec('exit') };

export const underline = (value:string | number):string => `\x1b[4m${value}\x1b[0m`

export const colorYellow = (value:string | number):string => ` \x1b[33m${value}\x1b[0m`

export const colorGreen = (value:string | number):string => ` \x1b[32m${value}\x1b[0m`
