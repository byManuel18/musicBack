import * as fs from 'fs';
import * as path from 'path';

type FolderType = 'Song' | 'User' | 'Playlist';

export const createFolder = (folderName: string, type: FolderType = 'Song') => {

    if (folderName) {
        let folderBefore: string = '';
        switch (type) {
            case 'User':
                folderBefore = 'userImgs';
                break;
            case 'Playlist':
                folderBefore = 'playlist';
                break;
            case 'Song':
                folderBefore = 'music';
                break;
        }
        folderName = folderName.trim();
        return fs.mkdirSync(path.join(__dirname, '..', 'upload', folderBefore, folderName));
    }

    return null;
}