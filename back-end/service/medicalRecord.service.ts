import medicalRecordDb from "../domain/data-access/medicalRecord.db";
import { Doctor } from "../domain/model/doctor";
import { MedicalRecord } from "../domain/model/medicalRecord";
import { Patient } from "../domain/model/patient";
import { DoctorInput, MedicalRecordInput, PatientInput } from "../types/types";

const getAllMedicalRecords = async (): Promise<MedicalRecord[]> =>
    medicalRecordDb.getAllMedicalRecords();

const getMedicalRecordById = async (id: number): Promise<MedicalRecord> => {
    if (Number.isNaN(Number(id))) {
        throw new Error('Id is invalid');
    }
    
    const medicalRecord = await medicalRecordDb.getMedicalRecordById(id);
    console.log(medicalRecord)
    if (!medicalRecord) {
        throw new Error(`No medical record found with ID ${id}`);
    }

    return medicalRecord;
}

const addMedicalRecord = async (medicalRecordInput: MedicalRecordInput): Promise<MedicalRecord> => {
    const medicalRecordPrisma = {
        diagnosis: medicalRecordInput.diagnosis,
        treatment: medicalRecordInput.treatment,
        date: medicalRecordInput.date,
        patient: medicalRecordInput.patient,
        doctor: medicalRecordInput.doctor,
    };

    const newMedicalRecord = await medicalRecordDb.addMedicalRecord(medicalRecordPrisma);
    return newMedicalRecord;
};
/*
const addPatientToMedicalRecord = async ({
    medicalRecord,
    patient,
}: {
    medicalRecord: MedicalRecordInput;
    patient: PatientInput;
}): Promise<MedicalRecord> => {
    if (!medicalRecord.id) throw new Error('medicalRecord id is required');
    if (!medicalRecordDb.getMedicalRecordById(medicalRecord.id)) throw new Error('medicalRecord not found');

    return medicalRecordDb.addPatientToMedicalRecord({ medicalRecord, patient })
}
*/

export default { getAllMedicalRecords, getMedicalRecordById, addMedicalRecord }