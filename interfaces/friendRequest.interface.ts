import { Document, Types } from "mongoose"

export interface I_FriendRequest extends Document {
    sender: Types.ObjectId;
    receiver: Types.ObjectId;
    status: Status;
    createdAt: Date;

}

export enum Status {
    'pending',
    'accepted',
    'rejected'
}