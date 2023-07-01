import { Schema, model } from "mongoose";
import { I_FriendRequest, Status } from "../../interfaces/friendRequest.interface";


const friendRequestSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: Status,
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


export const FriendRequest = model<I_FriendRequest>('FriendRequest', friendRequestSchema);