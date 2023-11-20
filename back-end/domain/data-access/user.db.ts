//import { User } from "@prisma/client";
import { database } from "../../util/db.server"
import { User } from "../model/user";
import { UserInput } from "../../types/types";


const getAllUsers = async (): Promise<User[]> => {
    try {
        const usersPrisma = await database.user.findMany();
        return usersPrisma.map((userPrisma) => User.from(userPrisma));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};


const getUserById = async ({ id }: UserInput): Promise<User> => {
    try {
        const userPrisma = await database.user.findUnique({
            where: { id },
        });

        return userPrisma ? User.from(userPrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};


const createUser = async ({password, email}:
    {password:string, email:string}): Promise<User> => {
   try {
    const userPrisma = await database.user.create({
        data:{
            password, 
            email
        },
    });
    return User.from(userPrisma);
   } catch (error) {
       throw new Error("Database error")
   }
}

const getUserByEmail =async ({ email }: UserInput): 
Promise<User>=> {
    try {
        const userPrisma = await database.user.findFirst({
            where: { email },
        });

        return userPrisma ? User.from(userPrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
}

const getUserByEmailConditional = async ({ email }: UserInput): Promise<boolean> => {
    try {
        const userPrisma = await database.user.findFirst({
            where: { email },
        });

        return userPrisma ? true : false;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

export default {getAllUsers, getUserById, createUser, getUserByEmail, getUserByEmailConditional}
