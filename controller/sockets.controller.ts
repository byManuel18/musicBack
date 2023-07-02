import { Server } from 'socket.io';
import { CustomSocket } from '../interfaces';

export let userAvtives: Array<{ userId: string, socketId: string }> = [];

export const socketsController = (socket: CustomSocket, io: Server) => {

    const userID = socket.handshake.query.userId as string;
    socket.userId = userID;
    userAvtives.push({ socketId: socket.id, userId: userID });

    socket.on('disconnect', () => {
        userAvtives = userAvtives.filter((s => s.socketId !== socket.id));
    });

}