import { Document, Types } from "mongoose";

export interface I_Song extends Document {
    name: string;
    type: string;
    coverArt: string;
    duration: number;
    author: string;
    album: string;
    publicationDate: Date;
    gender: (Types.ObjectId | string)[];
}