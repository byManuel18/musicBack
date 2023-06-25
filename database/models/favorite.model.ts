import { Schema, model } from 'mongoose';
import { I_Favorite } from '../../interfaces';

const favoriteSchema = new Schema({
    user: {
        unique: true,
        require: [true, 'The user is mandatory.']

    },
    songs: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Song', unique: true, }],
        default: []
    }
});



export const Favorite = model<I_Favorite>('Favorite', favoriteSchema);