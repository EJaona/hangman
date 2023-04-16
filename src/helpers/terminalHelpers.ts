import { createInterface } from 'readline';
import { exec } from "child_process";

const readline = createInterface({input: process.stdin, output: process.stdout});

export const terminalInput = (question:string):Promise<string> => new Promise( resolve => readline.question( question, (res:string) => resolve(res) ) );

export const clearTerminal = (time:number):Promise<void> => new Promise((resolve) => setTimeout( () => resolve(console.clear()), time * 1000));

export const setDisplayMessage = (msg:string):void => console.log(msg);

export const exitGame = (): void => { readline.close(), exec('exit') };