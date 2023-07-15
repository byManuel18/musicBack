import { Request, Response } from "express";
import { Server } from 'socket.io';
import { userActives } from './sockets.controller';
import { User } from "../database/models";
import { JWTUtils } from "../utils";
import { I_UserRequest } from "../interfaces";

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
        const { password, ...restUser } = newUser.toObject();

        const token = JWTUtils.createJWT(newUser._id);

        return res.status(200).json({
            ok: true,
            user: restUser,
            token
        })

    } catch (error) {
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