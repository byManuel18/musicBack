import { Schema, model } from 'mongoose';
import { I_Role } from "../../interfaces";


const roleSchema = new Schema({
    rol: {
        type: String,
        required: [true, 'El rol es obligatorio']
    }
});


export const Role = model<I_Role>('Role', roleSchema);