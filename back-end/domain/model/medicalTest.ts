import { Doctor } from "./doctor";
import { Patient } from "./patient";
import {
    MedicalTest as MedicalTestPrisma,
    Patient as PatientPrisma,
    Doctor as DoctorPrisma,
    User as UserPrisma
} from '@prisma/client';

export class MedicalTest{
    readonly id : number
    readonly name: string
    readonly cost : number
    readonly description: string
    readonly patient: Patient
    readonly doctor: Doctor

    constructor (medicalTest: {id: number, name: string,cost : number, description: string, patient: Patient, doctor:Doctor} ){
        this.id = medicalTest.id;
        this.name = medicalTest.name;
        this.cost = medicalTest.cost;
        this.description = medicalTest.description;
        this.patient = medicalTest.patient;
        this.doctor = medicalTest.doctor;
    }
    static create(id: number, name: string,cost : number, description: string, patient: Patient, doctor:Doctor){
        return new MedicalTest({id, name, cost, description, patient, doctor})
    }
    static from({
        id,
        name,
        cost,
        description,
        patient,
        doctor,
    }: MedicalTestPrisma & { 
    patient: PatientPrisma  & { user: UserPrisma };
    doctor: DoctorPrisma  & { user: UserPrisma } }) {
        return new MedicalTest({ 
            id, name, cost, description, 
            patient : Patient.from(patient),
            doctor: Doctor.from(doctor),
        });
    }
}