import { Request, Response, Router } from "express";
import { Server } from 'socket.io';
import { UserController } from "../controller";
import { DBValidators } from "../middlewares/inde";
import { check } from "express-validator";
import { I_UserRequest } from "../interfaces";
import { validateJWT } from "../middlewares/validate-JWT";


const UserRouters = {
    Register: '/register',
    Login: '/login',
    Auto: '/checkConnected',
    ChangePassword: '/changePassword'
} as const;

export const getUserRouter = (io: Server) => {
    const router: Router = Router();

    router.post(UserRouters.Register, [
        check('userName').custom(DBValidators.userNameValidator),
        check('email').custom(DBValidators.emailValidator),
        check('passWord').custom(DBValidators.passWordValidator),
        DBValidators.validarCampos
    ], (req: Request, res: Response) => { return UserController.register(req, res) });

    router.post(UserRouters.Login, [
        check('userNameOrEmail').custom(DBValidators.userNameOrEmailValidator),
        check('passWord').custom(DBValidators.passWordValidator),
        DBValidators.validarCampos
    ], (req: Request, res: Response) => { return UserController.login(req as I_UserRequest, res) });

    router.get(UserRouters.Auto, [
        (req: Request, res: Response, next: any) => validateJWT(req as I_UserRequest, res, next)
    ], (req: Request, res: Response) => UserController.autoLogin(req as I_UserRequest, res));

    router.put(UserRouters.ChangePassword, [
        (req: Request, res: Response, next: any) => validateJWT(req as I_UserRequest, res, next),
        check('oldPassword').custom(DBValidators.passWordValidator),
        check('newPassword').custom(DBValidators.passWordValidator),
        DBValidators.validarCampos
    ], (req: Request, res: Response) => UserController.changePassword(req as I_UserRequest, res));

    return router;
}