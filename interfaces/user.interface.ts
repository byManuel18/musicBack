import { Document } from 'mongoose';

export interface I_User extends Document {
    userName: string,
    email: string,
    password: string,
    lastPassword: string,
    lastPasswordChange: Date,
    avatar: string,
    active: boolean,
    created: Date,
    lastLogin: Date,
    role: string,
    comparePasword(password: string): boolean
}
