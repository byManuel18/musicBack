import { Router } from 'express';
import { Server } from 'socket.io';
import { GeneralRoutesConst } from './allRoutesConst';
import { getUserRouter } from './user.router';

export class RouterCreator {
    io: Server;

    private readonly router = Router()

    constructor(io: Server) {
        this.io = io;
        this.setRoutes();
    }

    setRoutes() {
        this.router.use(GeneralRoutesConst.User, getUserRouter(this.io));
    }

    getRouter() {
        return this.router;
    }
}