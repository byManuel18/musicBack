import { Request, Response } from "express";
import { Server } from 'socket.io';
import { userAvtives } from './sockets.controller';


export const register = async (req: Request, res: Response, io: Server) => {
    const userSocektId = userAvtives.filter(obj => obj.userId === '12345').map(obj => obj.socketId);
    console.log(userAvtives);

    if (userSocektId) {
        io.to(userSocektId).emit('prueba', { a: 'hola' });
    }

    return res.json({
        ok: true,
        msg: 'Bien desde register'
    })
}