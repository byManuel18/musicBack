import { Document, Types } from "mongoose";

export interface I_Friends extends Document {
    user: Types.ObjectId;
    friends: Types.ObjectId[];
    size: number;
    uniqueFriends: (friends: Types.ObjectId[]) => Types.ObjectId[];
}