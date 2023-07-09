import { Request } from "express";
import { I_User } from "./user.interface";
import { Document } from "mongoose";
import { Types } from "mongoose";


export interface I_UserRequest extends Request {
    user: (Document<unknown, {}, I_User> & Omit<I_User & {
        _id: Types.ObjectId;
    }, never>) | null;
}