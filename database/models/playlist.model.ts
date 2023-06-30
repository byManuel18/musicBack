import { Query, Schema, Types, UpdateQuery, model } from 'mongoose';
import { I_Playlist } from '../../interfaces';
import { DbUtils } from '../../utils'

const playlistSchema = new Schema({
    name: {
        type: String,
        require: [true, 'The name is mandatory.']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: [true, 'The user is mandatory.']
    },
    songs: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Song' }],
        default: [],
    },
    size: {
        type: Number,
        default: 0
    },
    createdDate: {
        type: Date,
        default: null
    },
    lastUpdate: {
        type: Date,
        default: null
    },
    coverArt: {
        type: String,
        default: 'imgUserDefault.png'
    }
});

playlistSchema.method('uniqueSongs', function (songs: Schema.Types.ObjectId[] = []) {
    return [...DbUtils.deleteDuplicated<Schema.Types.ObjectId>(songs, null, (a, b) => a.toString() === b.toString())];
});

playlistSchema.path('songs').set(function (songs: Types.ObjectId[]) {
    return playlistSchema.methods.uniqueSongs(songs);
});

playlistSchema.pre<I_Playlist>('save', function (next) {
    this.size = this.songs.length;
    this.createdDate = new Date();
    next();
});

playlistSchema.pre(['updateOne', 'findOneAndUpdate'], async function (this: Query<any, I_Playlist>, next) {
    this.set({ lastUpdate: new Date() });
    await DbUtils.updateSizeAfterUpdate<I_Playlist>(this, 'songs', Playlist);
    next();
});


export const Playlist = model<I_Playlist>('Playlist', playlistSchema);

