import { Document, Types } from "mongoose";

export interface I_Favorite extends Document {
    user: Types.ObjectId;
    songs: Types.ObjectId[];
    size: number;
    uniqueSongs: (songs: Types.ObjectId[]) => Types.ObjectId[];
    lastUpdate: Date;
}