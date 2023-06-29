import { Document, Types } from "mongoose";

export interface I_Playlist extends Document {
    name: string;
    user: Types.ObjectId;
    songs: Types.ObjectId[];
    coverArt: string;
    createdDate: Date;
    lastUpdate: Date;
    size: number;
    uniqueSongs: (songs: Types.ObjectId[]) => Types.ObjectId[]
}