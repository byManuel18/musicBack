import { Document, Types } from 'mongoose';

export interface I_User extends Document {
    userName: string,
    email: string,
    password: string,
    lastPassword: string,
    lastPasswordChange: Date,
    avatar: string,
    active: boolean,
    public: boolean,
    created: Date,
    lastLogin: Date,
    rol: Types.ObjectId;
    comparePasword(password: string): boolean
}
