import { Document, Types } from "mongoose"

export interface I_FriendRequest extends Document {
    sender: Types.ObjectId;
    receiver: Types.ObjectId;
    status: typeof Status[keyof typeof Status];
    createdAt: Date;

}

export const Status = {
    Pending: 'pending',
    Accepted: 'accepted',
    Rejected: 'rejected',
} as const;
