import 'dotenv/config';
import { inicializeDB } from './database/db';
import { Favorite, Playlist, Song } from './database/models';
import { DbUtils } from './utils';
import { Schema, Types } from 'mongoose';

inicializeDB().then(async (e) => {

    // const pla = {
    //     name: 'dedede'
    // }
    // const updated = await Playlist.findById('649caf3f289015f9c7f55483');
    // const nuevo = await updated?.updateOne(
    //     { $pull: { songs: { $in: ['649893ce3482491f13552ac1'] } }, $set: { name: 'sdsdsd' } },
    //     // { $addToSet: { songs: ['649cbe167b6d72f141f37779', '649ccf2e34dabe33bfc56d2e'] }, $set: { name: 'sdsdsd' } },
    //     { new: true })
    // console.log(updated);
    // console.log(nuevo);

    // { $pull: { songs: { $in: ['649893ce3482491f13552ac1'] } }, $set: { name: 'sdsdsd' } },

    // const f = await Playlist.findById('6498943a7f1d817e3ae63c35');
    // console.log(f);

    // const playlist = await Playlist.create({ user: '6491fc1f6f813a68c385b9f0', name: 'Prueba', songs: ['6498939b1f59e5d0a3201889', '649893ce3482491f13552ac1', '649893ce3482491f13552ac1'] });
    // await Song.create({ album: 'primerAlbumddasdasdasdafasf', name: 'peneeeeeeeeee', type: 'mp3', author: 'Yo mismo', publicationDate: new Date(), duration: 123, gender: ['Rock'] })

    // const a = await Favorite.create({ user: '6491fc1f6f813a68c385b9f0', songs: ['6498939b1f59e5d0a3201889', '649893ce3482491f13552ac1', '649893ce3482491f13552ac1'] });
    // console.log(a);

})  