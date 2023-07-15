import path from 'path';
import fs from 'fs';
import uniqid from 'uniqid';

import { I_FileUpload } from '../interfaces';

export const FilePaths = {
    GENERAL: 'upload',
    MUSIC: 'music',
    PLAYLIST: 'playlist',
    USER: 'userImgs',
    ASSETS: 'assets',
    DEF_IMGS: 'imgs'
} as const;

const MAIN_PATH: string = path.resolve(__dirname, '..', FilePaths.GENERAL);
const ASSETS_PATH: string = path.resolve(__dirname, '..', FilePaths.ASSETS);

export const saveFile = (file: I_FileUpload, folderMain: typeof FilePaths[keyof typeof FilePaths], finalPath: string) => {
    const finalPathComplete = path.resolve(MAIN_PATH, folderMain, finalPath);
    const typeFile = (file.mimetype.split('/'))[1];

    const pathexist = fs.existsSync(finalPathComplete);
    if (!pathexist) {
        fs.mkdirSync(finalPathComplete);
    }

    return new Promise<string>((resolve, reyect) => {
        const nameFile = generarNombreUnico(typeFile);
        const finalFilePath = path.resolve(finalPathComplete, nameFile);
        file.mv(finalFilePath, (err: any) => {
            if (err) {
                reyect(null);
            } else {
                resolve(nameFile);
            }
        });
    });


}

const generarNombreUnico = (typeFile: string) => {
    const idUnico = uniqid();
    return `${idUnico}.${typeFile}`;
}

export const getFile = (name: string, isDefault: boolean, folderMain: typeof FilePaths[keyof typeof FilePaths], finalPath?: string) => {
    const mainPath = isDefault ? ASSETS_PATH : MAIN_PATH;
    const finalFilePath = path.resolve(mainPath, folderMain, finalPath ? finalPath : '', name);
    if (fs.existsSync(finalFilePath)) {
        return finalFilePath;
    }

    return null;
}