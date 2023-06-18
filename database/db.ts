import mongoose from "mongoose";
const dataBaseNamme: string = process.env.DATABASE_NAME!;
const dataBaseUrl: string = process.env.DATABASE_URL!;

export const inicializeDB = () => {
    return mongoose.connect(`${dataBaseUrl}${dataBaseNamme}`);
}