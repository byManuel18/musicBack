import { Router } from "express";
import { Server } from 'socket.io';
import { UserController } from "../controller";


const UserRouters = {
    Register: '/register'
} as const;



export const getUserRouter = (io: Server) => {
    const router: Router = Router();
    router.post(UserRouters.Register, (req, res) => { return UserController.register(req, res, io) });

    return router;
}