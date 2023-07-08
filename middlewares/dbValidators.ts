import { Request, Response } from 'express';
import { validationResult, Meta } from 'express-validator';
import * as AllValidators from 'validator';
import { User } from '../database/models';
import { rsaDecrypt } from '../utils/passwordUtils';

export const validarCampos = (req: Request, res: Response, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            ok: false,
            errors
        });
    }
    next();
}

export const emailValidator = async (email: string, meta: Meta) => {
    if (!email) {
        throw new Error('The email is mandatory');
    }
    if (!AllValidators.default.isEmail(email)) {
        throw new Error('The email format is incorrect.');
    }
    const userFind = await User.findOne({ email: email });
    if (userFind) {
        throw new Error('The email is in used.');
    }
}

export const userNameValidator = async (userName: string, meta: Meta) => {
    if (!userName) {
        throw new Error('The userName is mandatory');
    }
    if (!AllValidators.default.isLength(userName, { min: 6 })) {
        throw new Error('The userName format is incorrect. Min 6');
    }
    const userFind = await User.findOne({ userName: userName });
    if (userFind) {
        throw new Error('The userName is in used.');
    }
}

export const passWordValidator = async (passWord: string, meta: Meta) => {
    if (!passWord) {
        throw new Error('The passWord is mandatory');
    }
    if (!AllValidators.default.isLength(passWord, { min: 6 })) {
        throw new Error('The userName format is incorrect. Min 6');
    }

    try {
        const pass = await rsaDecrypt(passWord);
        if (pass) {
            meta.req.body.passWord = pass;
        } else {
            // throw new Error('The passWorld must be encrypter by RSA.');
        }
    } catch (error) {
        // throw new Error('The passWorld must be encrypter by RSA.');
    }

}