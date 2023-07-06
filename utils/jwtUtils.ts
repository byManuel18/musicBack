import jwt from 'jsonwebtoken';

const SEED: string = process.env.JWT_KEY!;
const END_DATE: string = '30d';


export const createJWT = <T>(payload: T): string => {
    return jwt.sign({ usuario: payload }, SEED, { expiresIn: END_DATE });
}

export const checkToken = <T>(token: string): Promise<T | undefined> => {
    return new Promise((resolve, reyect) => {

        jwt.verify(token, SEED, (err, decoded) => {
            if (err) {
                reyect(err);
            } else {
                resolve(decoded as T);
            }
        });
    })
}

