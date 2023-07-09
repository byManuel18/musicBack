import jwt, { JwtPayload } from 'jsonwebtoken';

const SEED: string = process.env.JWT_KEY!;
const END_DATE: string = '30d';


export const createJWT = <T>(payload: T): string => {
    return jwt.sign({ data: payload }, SEED, { expiresIn: END_DATE });
}

export const checkToken = (token: string): Promise<JwtPayload | undefined> => {
    return new Promise((resolve, reyect) => {

        jwt.verify(token, SEED, (err, decoded) => {
            if (err) {
                reyect(err);
            } else {
                resolve(decoded as JwtPayload);
            }
        });
    })
}

