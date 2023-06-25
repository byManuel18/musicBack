import * as fs from 'fs';
import * as path from 'path';

export const createFolder = (folderName: string, type: 'Song' | 'User' = 'Song') => {

    if (folderName) {
        const folderBefore = type === 'Song' ? 'music' : 'userImgs';
        folderName = folderName.trim();
        return fs.mkdirSync(path.join(__dirname, '..', 'upload', folderBefore, folderName))
    }

    return null;
}