import { Role } from "../database/models"


export const existRole = async (role: string) => {
    return await Role.findOne({ role: role });
}

export const createRole = async (role: string) => {
    return await Role.create({ role: role });
}