import { Response } from 'express';
import { JWTUtils } from '../utils';
import { User } from '../database/models';
import { I_UserRequest } from '../interfaces';

export const validateJWT = async (req: I_UserRequest, res: Response, next: any) => {

    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición',
            ok: false
        });
    }

    try {

        const payload = await JWTUtils.checkToken(token);

        if (!payload) {
            return res.status(401).json({
                msg: 'Invalid Token.',
                ok: false
            });
        }

        const usuario = await User.findById(payload.data);

        if (!usuario) {
            return res.status(401).json({
                msg: 'User not found.',
                ok: false
            });
        }

        req.user = usuario;

        next();

    } catch (error) {
        console.log(error);

        res.status(500).json({
            msg: 'Internal Error',
            ok: false
        });
    }

}