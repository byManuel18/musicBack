import { Schema, model } from 'mongoose';
import { I_User } from '../../interfaces';
import { FolderUtils, Password } from '../../utils';
import { RoleController } from '../../controller';
import { Favorite } from './favorite.model';

const userSchema = new Schema({
    userName: {
        type: String,
        unique: true,
        require: [true, 'The userName is mandatory.']
    },
    avatar: {
        type: String,
        default: 'imgUserDefault.png'
    },
    active: {
        type: Boolean,
        default: true
    },
    public: {
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
        default: null
    },
    created: {
        type: Date
    },
    lastLogin: {
        type: Date
    },
    lastPasswordChange: {
        type: Date,
        default: null
    },
    rol: {
        type: Schema.Types.ObjectId,
        ref: 'Role'
    }
});

userSchema.pre<I_User>('save', async function (next) {
    this.created = new Date();
    this.lastLogin = new Date();
    this.password = Password.encriptar(this.password);
    const rolToSet = await RoleController.existRole('USER_ROL');
    if (rolToSet) {
        this.rol = rolToSet._id;
    } else {
        const rolCreated = await RoleController.createRole('USER_ROL');
        this.rol = rolCreated._id;
    }
    await Favorite.create({ user: this._id });
    FolderUtils.createFolder(this._id.toString(), 'User');
    FolderUtils.createFolder(this._id.toString(), 'Playlist');
    next();
});


userSchema.method('comparePasword', function (passwordToCompare: string = '') {
    return Password.isEquals(passwordToCompare, this.password);
})

export const User = model<I_User>('User', userSchema);