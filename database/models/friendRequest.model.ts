import { Schema, model } from "mongoose";
import { I_FriendRequest, Status } from '../../interfaces/friendRequest.interface';
import { DbUtils } from "../../utils";


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
        enum: Object.values(Status),
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


friendRequestSchema.pre('save', async function (next) {
    const sender = this.sender;
    const receiver = this.receiver;
    const sameRequest = await FriendRequest.findOne({ sender: receiver, receiver: sender });

    if (sameRequest && sameRequest.status === Status.Pending) {
        await sameRequest.updateOne({ status: Status.Accepted });
        await DbUtils.setFriends(this.sender, this.receiver);
        this.status = Status.Accepted;
    }
    next();
});


export const FriendRequest = model<I_FriendRequest>('FriendRequest', friendRequestSchema);