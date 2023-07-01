import { Query, Schema, model } from "mongoose";
import { I_Friends } from "../../interfaces/friends.interface";
import { DbUtils } from "../../utils";


const friendsSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: [true, 'The user is mandatory.']
    },
    friends: {
        type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        default: [],
    },
    size: {
        type: Number,
        default: 0
    }
});

friendsSchema.method('uniqueFriends', function (friends: Schema.Types.ObjectId[] = []) {
    return [...DbUtils.deleteDuplicated<Schema.Types.ObjectId>(friends, null, (a, b) => a.toString() === b.toString())];
});

friendsSchema.path('friends').set(function (friends: Schema.Types.ObjectId[]) {
    return friendsSchema.methods.uniqueFriends(friends);
});


friendsSchema.pre('save', async function (next) {
    this.size = this.friends.length;
    next();
});

friendsSchema.pre(['updateOne', 'findOneAndUpdate'], async function (this: Query<any, I_Friends>, next) {
    await DbUtils.updateSizeAfterUpdate<I_Friends>(this, 'friends', Friends);
    next();
});


export const Friends = model<I_Friends>('Friends', friendsSchema);