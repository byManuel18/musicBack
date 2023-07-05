import { Request, Response } from "express";
import { Server } from 'socket.io';
import { userActives } from './sockets.controller';


export const register = async (req: Request, res: Response, io: Server) => {
    const userSocektId = userActives.filter(obj => obj.userId === '12345').map(obj => obj.socketId);
    if (userSocektId) {
        io.to(userSocektId).emit('prueba', { a: 'hola' });
    }

    return res.json({
        ok: true,
        msg: 'Bien desde register'
    })
}