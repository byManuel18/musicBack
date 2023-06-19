import { Schema, model } from 'mongoose';
import { I_User } from '../../interfaces';
import { Password } from '../../utils';
import { RoleController } from '../../controller';

const userSchema = new Schema({
    userName: {
        type: String,
        unique: true,
        require: [true, 'The userName is mandatory.']
    },
    avatar: {
        type: String,
        default: 'imgDefault'
    },
    active: {
        type: Boolean,
        default: false
    },
    email: {
        type: String,
        unique: true,
        require: [true, 'The email is mandatory.']
    },
    password: {
        type: String,
        require: [true, 'The password is mandatory.']
    },
    lastPassword: {
        type: String,
    },
    created: {
        type: Date
    },
    lastLogin: {
        type: Date
    },
    lastPasswordChange: {
        type: Date
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: 'Role'
    }
});

userSchema.pre<I_User>('save', async function (next) {
    this.created = new Date();
    this.lastLogin = new Date();
    const rolToSet = await RoleController.existRole('USER_ROL');
    if (rolToSet) {
        this.role = rolToSet._id.toString();
    } else {
        const rolCreated = await RoleController.createRole('USER_ROL');
        this.role = rolCreated._id.toString();
    }
    next();
});


userSchema.method('comparePasword', function (password: string = '') {
    return Password.isEquals(password, this.password);
})

export const User = model<I_User>('User', userSchema);