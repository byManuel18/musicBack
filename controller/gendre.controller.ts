import { Types } from "mongoose";
import { Gender } from "../database/models";


export const existGendre = async (gendre: string) => {
    if (Types.ObjectId.isValid(gendre)) {
        return await Gender.findById(gendre);
    }
    return await Gender.findOne({ name: gendre.toUpperCase() });
}

export const createGendre = async (gendre: string) => {
    return await Gender.create({ name: gendre.toUpperCase() });
}

export const generateArrayGendres = async (gendres: string[] = []) => {
    const gendresToAsing: Types.ObjectId[] = [];
    await Promise.all(gendres.map(async g => {
        const gendreToSet = await existGendre(g);
        if (gendreToSet) {
            gendresToAsing.push(gendreToSet._id);
        } else {
            const genredCreated = await createGendre(g);
            gendresToAsing.push(genredCreated._id);
        }
    }))
    return [...gendresToAsing];
}
