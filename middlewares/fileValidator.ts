import { I_FileUpload, I_UserRequest } from "../interfaces";
import { Response } from "express";
import * as AllValidators from 'validator';
import { User } from "../database/models";

export const validateFile = (fileType: 'image' | 'audio', field: string, req: I_UserRequest, res: Response, next: any) => {
    if (!req.files || !req.files[field]) {
        next();
    } else {
        if (Array.isArray(req.files![field])) {
            return res.status(401).json({
                msg: 'Only one File.',
                ok: false
            });
        }
        const file = req.files![field] as I_FileUpload;
        if (!file.mimetype.includes(fileType)) {
            return res.status(401).json({
                msg: 'Invalid format.',
                ok: false
            });
        }
        next();
    }
}

export const canShowProfileImg = async (req: I_UserRequest, res: Response, next: any) => {
    if (!req.params.id) {
        return res.status(401).json({
            msg: 'Id missins',
            ok: false
        });
    }

    const id = req.params.id;

    if (!AllValidators.default.isMongoId(id)) {
        return res.status(401).json({
            msg: 'Invalid Id',
            ok: false
        });
    }

    const userFound = await User.findById(id);

    if (!userFound) {
        return res.status(401).json({
            msg: 'User nor found',
            ok: false
        });
    }

    if (!userFound.active) {
        return res.status(401).json({
            msg: 'Inactive User',
            ok: false
        });
    }

    req.user = userFound;

    next();

}