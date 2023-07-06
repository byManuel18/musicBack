import { Request, Response, Router } from "express";
import { Server } from 'socket.io';
import { UserController } from "../controller";
import { DBValidators } from "../middlewares/inde";
import { check } from "express-validator";


const UserRouters = {
    Register: '/register'
} as const;


DBValidators
export const getUserRouter = (io: Server) => {
    const router: Router = Router();
    router.post(UserRouters.Register, [
        check('userName').custom(DBValidators.userNameValidator),
        check('email').custom(DBValidators.emailValidator),
        check('passWord').custom(DBValidators.passWordValidator),
        DBValidators.validarCampos
    ], (req: Request, res: Response) => { return UserController.register(req, res) });

    return router;
}