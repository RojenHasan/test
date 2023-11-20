
import userDb from "../domain/data-access/user.db";
import {User} from "../domain/model/user";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { UserInput } from "../types/types";


const jwtSecret = process.env.JWT_SECRET
const genrateJwtToken = (email: string):string => {
    const options = {expiresIn: `${process.env.JWT_EXPIRES_HOURS}h`, issuer: "BookHub"}
    try {
        return jwt.sign({email}, jwtSecret, options)
    } catch (error) {
        console.log(error)
        throw new Error("Error genrating JWT token")
    }
}
const createUser = async (userData: UserInput): Promise<User> => {
    const {password, email } = userData;

    const existingUser = await userDb.getUserByEmail({email})
    if(existingUser){
        throw new Error("User already exists")
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    return await userDb.createUser({password:hashedPassword, email:email})
}

const authenticate = async ({password, email}:UserInput) :Promise<string>=> {
    const user = await getUserByEmail({ email: email })
    if(!user){
        throw new Error("User couldn't be found")
    }
    const isValidPassword = await bcrypt.compare(password, user.password)

    if(!isValidPassword){
        throw new Error("Incorrect password")
    }

    return genrateJwtToken(email)
}
const getUserByEmail = async ({email}:{email:string}): Promise<User> => {
    if (!email) {
        throw new Error('Email is empty.');
      }
    const user = await  userDb.getUserByEmail({email})
    if(!user) throw  new Error(`No User with email ${email}`);
    return user;
}

const getAllUsers = async (): Promise<User[]> => 
await userDb.getAllUsers();

const getUserById =async ({id}: {id: number}): Promise<User> => {
    if(Number.isNaN(Number(id))){throw new Error('Id is invalid.')}
    const user = await userDb.getUserById({id:id});
    if(!user) throw  new Error(`No User with id ${id}`);
    return user;
}

export default {getAllUsers, getUserById,createUser, authenticate, getUserByEmail}