import { Server } from 'socket.io';
import { CustomSocket } from '../interfaces';

export let userActives: Array<{ userId: string, socketId: string }> = [];

export const socketsController = (socket: CustomSocket, io: Server) => {

    const userID = socket.handshake.query.userId as string;
    socket.userId = userID;
    userActives.push({ socketId: socket.id, userId: userID });

    socket.on('disconnect', () => {
        userActives = userActives.filter((s => s.socketId !== socket.id));
    });

}