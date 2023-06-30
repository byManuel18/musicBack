import { Schema, model, Types } from 'mongoose';
import { I_Song } from '../../interfaces';
import { FolderUtils } from '../../utils';
import { generateArrayGendres } from '../../controller/gendre.controller';

const songSchema = new Schema({
    name: {
        type: String,
        require: [true, 'The name is mandatory.']
    },
    coverArt: {
        type: String,
        default: 'imgUserDefault.png'
    },
    type: {
        type: String,
        require: [true, 'The type is mandatory.']
    },
    author: {
        type: String,
        default: null
    },
    album: {
        type: String,
        default: null
    },
    publicationDate: {
        type: Date,
        default: null
    },
    duration: {
        type: Number,
        require: [true, 'The duration is mandatory.']
    },
    gender: {
        type: [{ type: Schema.Types.Mixed }],
        ref: 'Gender',
        require: [true, 'The gender is mandatory.']
    }
});

songSchema.pre<I_Song>('save', async function (next) {
    const genderStrings: string[] = [];
    const genderObjectID: Types.ObjectId[] = [];
    this.gender.forEach(g => {
        if (typeof g === 'string') {
            genderStrings.push(g);
        } else {
            genderObjectID.push(g);
        }
    });
    const gendresAll = [... await generateArrayGendres(genderStrings), ...genderObjectID];
    const newSetG = new Set<Types.ObjectId>();
    gendresAll.forEach((obj) => {
        const existe = [...newSetG].some((item) => item.id.toString() === obj.id.toString());
        if (!existe) {
            newSetG.add(obj);
        }
    });
    this.gender = [...newSetG];
    this.gender = [...new Set(this.gender)];
    FolderUtils.createFolder(this._id.toString());
    next();
});

export const Song = model<I_Song>('Song', songSchema);