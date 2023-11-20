import { Prisma } from "@prisma/client";
import { database } from "../../util/db.server";
import {Patient} from "../model/patient";
//import { User } from "../model/user";
import { PatientInput } from "../../types/types";
import { User } from "../model/user";


const getAllPatients = async (): Promise<Patient[]> => {
    try{
        const patientsPrisma = await database.patient.findMany({
            include: {user:true}
        });
        return patientsPrisma.map((patientPrisma)=>
        Patient.from(patientPrisma as any))
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
}

const getPatientById = async (id: number): 
Promise<Patient | null> => {
    try {
        const patientPrisma = await database.patient.findUnique({
            where: { id: id },
            include: { user: true }, // Use the correct Prisma generated User type
        });
        return Patient.from(patientPrisma as any) ;
    } catch (error) {
        throw new Error(`Patient with id {${id}} couldn't be found`);
    }
};


const addPatient = async ({
    name,
    user,
    medical_History,
    street,
    postcode,
    housenr,
    stad,
}: PatientInput): Promise<Patient> => {
    try {
        
        const patientPrisma = await database.patient.create({
            data: {
                name,
                medical_History,
                street,
                postcode,
                housenr,
                stad,
                user: {
                    connect: {
                        email: user.email, // Connect the user by email
                    },
                },
            },
            include: { user: true }, // Use the correct Prisma generated User type
        });
        return Patient.from(patientPrisma as any);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                throw new Error(`Patient with name {${name}} already exists`);
            }
        }
        throw new Error(error.message);
    }
};

const deletePatient = async (id: number): Promise<void> => {
    try {
        const patientPrisma = await database.patient.findUnique({
            where: { id },
        });

        if (!patientPrisma) {
            throw new Error(`Patient with id ${id} not found`);
        }

        // Delete the patient using Prisma
        await database.patient.delete({
            where: { id },
        });
    } catch (error) {
        throw new Error(`Failed to delete patient: ${error.message}`);
    }
};

const updatePatient = async ({
    id,
    name,
    medical_History,
    street,
    postcode,
    housenr,
    stad,
    user
}: {
    id: number,
    name: string,
    medical_History: string,
    street: string,
    postcode: number,
    housenr: number,
    stad: string,
    user: User
}): Promise<Patient> => {
    try {
        

        // Update the patient's information using Prisma
        const updatedPatient = await database.patient.update({
            where: { id: id },
            data: {
                name: name,
                medical_History: medical_History,
                street: street,
                postcode: postcode,
                housenr: housenr,
                stad: stad,
                user: {
                    connect: {
                        id: user.id
                    }
                }
            },
            include: { user: true }, // Use the correct Prisma generated User type
        });

        return Patient.from(updatedPatient as any);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2016') {
                throw new Error(`Doctor with ID ${id} not found.`);
            } 
        } 
    }
};

export default{getAllPatients,updatePatient, getPatientById, addPatient, deletePatient}