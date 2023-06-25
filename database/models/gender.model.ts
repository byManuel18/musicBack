import { Schema, model } from 'mongoose';
import { I_Gender } from '../../interfaces';


const genderSchema = new Schema({
    name: {
        type: String,
        unique: true,
        require: [true, 'The name is mandatory.']
    }
});

export const Gender = model<I_Gender>('Gender', genderSchema);