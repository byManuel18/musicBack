import { Request, Response } from "express";
import { Server } from 'socket.io';
import { userActives } from './sockets.controller';
import { User } from "../database/models";
import { JWTUtils } from "../utils";

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