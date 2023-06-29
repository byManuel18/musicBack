import { Model, Query, Types, UpdateQuery } from "mongoose";


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