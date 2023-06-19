import bcrypt from 'bcrypt';
import * as Forge from 'node-forge';

const privateKey = process.env.RSHA_PRIVATE_KEY!;


export const encriptar = (cadena: string, saltOrRounds: number = 10) => {
    return bcrypt.hashSync(cadena, saltOrRounds);
}

export const isEquals = (cadena: string = '', cadenaCrypt: string = '') => {
    return bcrypt.compareSync(cadena, cadenaCrypt);
}

export const rsaDecrypt = (cadena: string) => {
    const contraseString = atob(cadena);
    return new Promise<string>((resolve, reyect) => {
        const keyp = Forge.pki.privateKeyFromPem(privateKey);;
        try {
            const stringgenerado = keyp.decrypt(contraseString);
            resolve(stringgenerado);
        } catch (error) {
            reyect(error);
        }
    })

}