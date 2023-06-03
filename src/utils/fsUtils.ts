import { existsSync, writeFileSync, readFileSync } from 'fs';

export const createFileIfNotExists = ( filePath:string, data:Object ):void => {
    if(!existsSync(filePath))writeFileSync(filePath, JSON.stringify(data));
}

export const writeToFile = (path:string, data:Object):void => writeFileSync(path, JSON.stringify(data))

export const readFromFile = (path:string):any => JSON.parse(readFileSync(path).toString())