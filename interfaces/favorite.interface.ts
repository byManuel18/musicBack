import { Document, Types } from "mongoose";

export interface I_Favorite extends Document {
    user: Types.ObjectId;
    songs: Types.ObjectId[];
}