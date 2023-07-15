import { I_FileUpload, I_UserRequest } from "../interfaces";
import { Response } from "express";

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