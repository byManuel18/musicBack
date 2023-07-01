import { Query, Schema, model } from 'mongoose';
import { I_Favorite } from '../../interfaces';
import { DbUtils } from '../../utils';

const favoriteSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        unique: true,
        require: [true, 'The user is mandatory.']

    },
    songs: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Song' }],
        default: []
    },
    size: {
        type: Number,
        default: 0
    },
    lastUpdate: {
        type: Date,
        default: null
    }
});

favoriteSchema.method('uniqueSongs', function (songs: Schema.Types.ObjectId[] = []) {
    return [...DbUtils.deleteDuplicated<Schema.Types.ObjectId>(songs, null, (a, b) => a.toString() === b.toString())];
});

favoriteSchema.path('songs').set(function (songs: Schema.Types.ObjectId[]) {
    return favoriteSchema.methods.uniqueSongs(songs);
});

favoriteSchema.pre<I_Favorite>('save', function (next) {
    this.size = this.songs.length;
    next();
});

favoriteSchema.pre(['updateOne', 'findOneAndUpdate'], async function (this: Query<any, I_Favorite>, next) {
    this.set({ lastUpdate: new Date() });
    await DbUtils.updateSizeAfterUpdate<I_Favorite>(this, 'songs', Favorite);
    next();
});


export const Favorite = model<I_Favorite>('Favorite', favoriteSchema);