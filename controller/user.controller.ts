import { Request, Response } from "express";
import { Server } from 'socket.io';
import { userActives } from './sockets.controller';
import { User } from "../database/models";
import { JWTUtils, Password } from "../utils";
import { I_FileUpload, I_UserRequest } from "../interfaces";
import { FileUtils } from '../utils';

// const userSocektId = userActives.filter(obj => obj.userId === '12345').map(obj => obj.socketId);
//     if (userSocektId) {
//         io.to(userSocektId).emit('prueba', { a: 'hola' });
//     }
export const register = async (req: Request, res: Response) => {


    const { email, passWord, userName } = req.body;

    try {

        const newUser = await User.create(
            { email: email, userName: userName, password: passWord },
        );

        let userUpdatedImg;
        if (req.files && req.files.imgProfile) {
            const savedFile = await FileUtils.saveFile(req.files.imgProfile as I_FileUpload, 'userImgs', newUser.id);
            if (savedFile) {
                userUpdatedImg = await User.findByIdAndUpdate(
                    newUser.id,
                    { $set: { avatar: savedFile } },
                    { returnOriginal: false }
                );

            }
        }
        const { password, lastPassword, lastPasswordChange, ...restUser } = userUpdatedImg ? userUpdatedImg.toObject() : newUser.toObject();

        const token = JWTUtils.createJWT(newUser._id);

        return res.status(200).json({
            ok: true,
            user: restUser,
            token
        })

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            ok: false,
            msg: error
        })
    }

}

export const login = async (req: I_UserRequest, res: Response, autologin: boolean = false) => {
    if (!req.user) {
        return res.status(404).json({
            ok: false,
            msg: 'Username and password do not match.'
        })
    }

    if (!req.user.active) {
        return res.status(404).json({
            ok: false,
            msg: 'Inactive user.'
        })
    }

    if (!autologin) {
        if (!req.user.comparePasword(req.body.passWord)) {
            return res.status(404).json({
                ok: false,
                msg: 'Username and password do not match.'
            })
        }
    }

    try {
        await req.user.updateOne({ $set: { lastLogin: new Date() } }).exec();
        const { password, lastPassword, lastPasswordChange, ...userFind } = req.user.toObject();
        const token = JWTUtils.createJWT(userFind._id);

        return res.json({
            user: userFind,
            token
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: error
        })
    }
}

export const autoLogin = (req: I_UserRequest, res: Response) => {
    login(req, res, true);
}

export const changePassword = async (req: I_UserRequest, res: Response) => {
    if (!req.user) {
        return res.status(404).json({
            ok: false,
            msg: 'User not Found'
        })
    }

    if (req.user.comparePasword(req.body.newPassword)) {
        return res.status(401).json({
            ok: false,
            msg: 'Password cant be changed.'
        });
    }

    if (req.user.comparePasword(req.body.oldPassword)) {
        const newPassword = Password.encriptar(req.body.newPassword);
        try {
            await req.user.updateOne({ password: newPassword, lastPasswordChange: new Date(), lastPassword: req.user.password }).exec();
            return res.status(200).json({
                ok: true,
                msg: 'Password change correct.'
            })
        } catch (error) {
            return res.status(500).json({
                ok: false,
                msg: error
            })
        }
    } else {
        return res.status(401).json({
            ok: false,
            msg: 'Password cant be changed.'
        })
    }
}

export const showImgProfile = (req: I_UserRequest, res: Response) => {
    if (!req.user) {
        return res.status(404).json({
            ok: false,
            msg: 'User not Found'
        })
    }

    const fileName = req.user.avatar;
    const iduser = req.params.id;
    let file;
    if (fileName.toLowerCase().includes('default')) {
        file = FileUtils.getFile(fileName, true, 'imgs')
    } else {
        file = FileUtils.getFile(fileName, false, 'userImgs', iduser);
    }

    if (file) {
        return res.sendFile(file)
    }

    return res.status(500).json({
        ok: false,
        msg: 'Cant Get IMG'
    })
}

export const updateImgProfile = async (req: I_UserRequest, res: Response) => {
    if (!req.files || !req.files.imgProfile) {
        return res.status(401).json({
            ok: false,
            msg: 'File missings'
        })
    }

    try {
        let oldImg;
        if (!req.user?.avatar.toLowerCase().includes('default')) {
            oldImg = req.user?.avatar;
        }
        const filePath = await FileUtils.saveFile(req.files.imgProfile as I_FileUpload, 'userImgs', req.user?.id, oldImg);

        if (!filePath) {
            return res.status(500).json({
                ok: false,
                msg: 'Cant Save Img'
            })
        }

        const userUpdatedImg = await User.findByIdAndUpdate(
            req.user?.id,
            { $set: { avatar: filePath } },
            { returnOriginal: false }
        );

        if (!userUpdatedImg) {
            return res.status(401).json({
                ok: false,
                msg: 'User cant be updated'
            })
        }

        return res.status(200).json({
            ok: true,
            newImg: filePath
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: error
        })
    }

}


export const setInactiveUser = async (req: I_UserRequest, res: Response) => {
    try {
        await req.user?.updateOne({ $set: { active: false } }).exec();
        return res.status(500).json({
            ok: true,
            msg: 'User Inactive Ok'
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: error
        })
    }
}


export const removeImgProfile = async (req: I_UserRequest, res: Response) => {
    try {

        const fileName = req.user?.avatar;
        if (fileName?.toLowerCase().includes('default')) {
            return res.status(400).json({
                ok: false,
                msg: 'There is no image to delete'
            })
        }

        const deletdFile = await FileUtils.removeImgProfile(req.user?.id, fileName!);

        if (deletdFile) {
            const updatedUser = await req.user?.updateOne({ $set: { avatar: FileUtils.DEFAULT_IMG_PROGILE } }, { returnOriginal: false }).exec();
            return res.status(200).json({
                ok: true,
                img: FileUtils.DEFAULT_IMG_PROGILE
            })
        }

        return res.status(500).json({
            ok: false,
            msg: 'Image not removed'
        })


    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: error
        })
    }
}



