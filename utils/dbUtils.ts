import { Model, Query, Types, UpdateQuery } from "mongoose";
import { Friends } from "../database/models";


export const updateSizeAfterUpdate = async <T>(query: Query<any, T>, key: keyof T, model: Model<T>) => {
    const updateFields = query.getUpdate() as UpdateQuery<T> | null;

    const idmodel = query.getFilter()['_id'];
    const moidelFind = await model.findById(idmodel);
    if (moidelFind) {
        const currentSongs = moidelFind.get(key as string);
        if (updateFields) {
            if (updateFields.$addToSet && updateFields.$addToSet[key]) {
                const songsToAdd: string[] = []
                updateFields.$addToSet[key].forEach((s: string) => {
                    if (!currentSongs.some((cs: Types.ObjectId) => {
                        return cs.toString() === s;
                    })) {
                        songsToAdd.push(s);
                    }
                });
                query.set({ size: (currentSongs.length + songsToAdd.length) });
            } else if (updateFields.$pull && updateFields.$pull[key]) {
                const songsToDelete: string[] = [];
                let searchFields: string[] = [];
                if (updateFields.$pull.songs.$in) {
                    searchFields = updateFields.$pull.songs.$in;
                } else {
                    searchFields = [...updateFields.$pull[key]];
                }
                searchFields.forEach((s: string) => {
                    if (currentSongs.some((cs: Types.ObjectId) => {
                        return cs.toString() === s;
                    })) {
                        songsToDelete.push(s);
                    }
                });
                query.set({ size: (currentSongs.length - songsToDelete.length) });
            }
        }

    }
}


export const deleteDuplicated = <T>(arrayToSee: T[], key?: keyof T | null, predicate?: (a: T, b: T) => boolean): Set<T> => {
    const newSetArr = new Set<T>();
    arrayToSee.forEach((element: T) => {
        const existe = [...newSetArr].some((item) => predicate ? predicate(element, item) : key ? item[key] === element[key] : false);
        if (!existe) {
            newSetArr.add(element);
        }
    });
    return newSetArr;
}


export const setFriends = async (target1: Types.ObjectId, target2: Types.ObjectId) => {
    const target1FriendsList = await Friends.findOne({ user: target1 });
    const target2FriendsList = await Friends.findOne({ user: target2 });
    if (target1FriendsList && target2FriendsList) {
        await target1FriendsList.updateOne({ $addToSet: { friends: [target2._id.toString()] } });
        await target2FriendsList.updateOne({ $addToSet: { friends: [target1._id.toString()] } });
    }
}