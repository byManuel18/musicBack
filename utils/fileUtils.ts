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
export const DEFAULT_IMG_PROGILE: string = 'imgUserDefault.png';

export const saveFile = (file: I_FileUpload, folderMain: typeof FilePaths[keyof typeof FilePaths], finalPath: string, oldFileName?: string) => {
    const finalPathComplete = path.resolve(MAIN_PATH, folderMain, finalPath);
    const typeFile = (file.mimetype.split('/'))[1];

    const pathexist = fs.existsSync(finalPathComplete);
    if (!pathexist) {
        fs.mkdirSync(finalPathComplete);
    }

    return new Promise<string>(async (resolve, reyect) => {
        if (oldFileName) {
            await removeFile(path.resolve(finalPathComplete, oldFileName));
        }
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

export const removeFile = (pathFile: string) => {
    return new Promise<boolean>((resolve, reyect) => {
        try {
            if (fs.existsSync(pathFile)) {
                fs.rmSync(pathFile);
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (error) {
            resolve(false);
        }
    })
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


export const removeImgProfile = (userId: string, fileName: string) => {
    const pathFile = path.resolve(MAIN_PATH, FilePaths.USER, userId, fileName);
    return removeFile(pathFile);
}
