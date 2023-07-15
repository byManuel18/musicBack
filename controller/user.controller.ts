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
        const { password, ...restUser } = userUpdatedImg ? userUpdatedImg.toObject() : newUser.toObject();

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

    const { password, ...userFind } = req.user.toObject();
    const token = JWTUtils.createJWT(userFind._id);

    return res.json({
        user: userFind,
        token
    })
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
            await req.user.updateOne({ password: newPassword });
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
        msg: 'Can Get IMG'
    })
}



