import { Query, Schema, Types, UpdateQuery, model } from 'mongoose';
import { I_Playlist } from '../../interfaces';

const updateSizeAfterUpdate = async (query: Query<any, I_Playlist>) => {
    query.set({ lastUpdate: new Date() });
    const updateFields = query.getUpdate() as UpdateQuery<I_Playlist> | null;

    const playlistId = query.getFilter()['_id'];
    const playlits = await Playlist.findById(playlistId);
    if (playlits) {
        const currentSongs = playlits.songs;
        if (updateFields) {
            if (updateFields.$addToSet && updateFields.$addToSet.songs) {
                const songsToAdd: string[] = []
                updateFields.$addToSet.songs.forEach((s: string) => {
                    if (!currentSongs.some((cs) => {
                        return cs.toString() === s;
                    })) {
                        songsToAdd.push(s);
                    }
                });
                query.set({ size: (currentSongs.length + songsToAdd.length) });
            } else if (updateFields.$pull && updateFields.$pull.songs) {
                const songsToDelete: string[] = [];
                let searchFields: string[] = [];
                if (updateFields.$pull.songs.$in) {
                    searchFields = updateFields.$pull.songs.$in;
                } else {
                    searchFields = [...updateFields.$pull.songs];
                }
                searchFields.forEach((s: string) => {
                    if (currentSongs.some((cs) => {
                        return cs.toString() === s;
                    })) {
                        songsToDelete.push(s);
                    }
                });
                console.log(songsToDelete);

                query.set({ size: (currentSongs.length - songsToDelete.length) });
            }
        }

    }
}

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
    const newSetArr = new Set<Schema.Types.ObjectId>();
    songs.forEach((element: Schema.Types.ObjectId) => {
        const existe = [...newSetArr].some((item) => item.toString() === element.toString());
        if (!existe) {
            newSetArr.add(element);
        }
    });
    return [...newSetArr];
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
    await updateSizeAfterUpdate(this);
    next();
});


export const Playlist = model<I_Playlist>('Playlist', playlistSchema);

