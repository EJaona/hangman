import { existsSync, writeFileSync, readFileSync } from 'fs';

export const createFileIfNotExists = ( filePath:string, data:any ):void => {
    if(!existsSync(filePath))writeFileSync(filePath, JSON.stringify(data));
}

export const writeToFile = (path:string, data:any) => writeFileSync(path, JSON.stringify(data))

export const readFromFile = (path:string) => JSON.parse(readFileSync(path).toString())