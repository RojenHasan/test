import { database } from "../../util/db.server";
import { MedicalRecord } from "../model/medicalRecord";
import { Patient } from "../model/patient";
import { Doctor } from "../model/doctor";
import { MedicalRecordInput, PatientInput } from "../../types/types";

const getAllMedicalRecords = async ():
  Promise<MedicalRecord[]> => {
  try {
    const medicalRecordsPrisma = await database.medicalRecord.findMany({
      include: {
        patient: {
          include: { user: true }
        },
        doctor: {
          include: { user: true }
        }
      }
    });

    return medicalRecordsPrisma.map((medicalRecordPrisma) =>
      MedicalRecord.from(medicalRecordPrisma as any)
    );
  } catch (error) {
    console.error(error);
    throw new Error('Database error. See server log for details.');
  }
};

const getMedicalRecordById = async (id: number): Promise<MedicalRecord | null> => {
  try {
    const medicalRecordPrisma = await database.medicalRecord.findUnique({
      where: { id },
      include: {
        patient: {
          include: { user: true }
        },
        doctor: {
          include: { user: true }
        }
      }
    });
    return MedicalRecord.from(medicalRecordPrisma as any);

  } catch (error) {
    console.error(error);
    throw new Error(`Medical record with ID {${id}} couldn't be found`);
  }
};

const addMedicalRecord = async ({
  diagnosis,
  treatment,
  date,
  patient,
  doctor
}: MedicalRecordInput): Promise<MedicalRecord> => {
  try {
    // Check if the patient exists
    const existingPatient = await database.patient.findUnique({
      where: { id: patient.id },
    });

    if (!existingPatient) {
      throw new Error(`Patient with ID ${patient.id} does not exist.`);
    }

    // Check if the doctor exists
    const existingDoctor = await database.doctor.findUnique({
      where: { id: doctor.id },
    });

    if (!existingDoctor) {
      throw new Error(`Doctor with ID ${doctor.id} does not exist.`);
    }
    const medicalRecordPrisma = await database.medicalRecord.create({
      data: {
        diagnosis,
        treatment,
        date,
        patient: { connect: { id: patient.id } }, // Connect the medical record to the patient
        doctor: { connect: { id: doctor.id } },
      },
      include: {
        patient: {
          include: { user: true }
        },
        doctor: {
          include: { user: true }
        }
      }
    });

    return MedicalRecord.from(medicalRecordPrisma as any);
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to create the medical test. ${error.message}`);
  }
};
/*
const addPatientToMedicalRecord = async ({
  medicalRecord,
  patient,
}: {
  medicalRecord : MedicalRecordInput;
  patient : PatientInput;
}) : Promise<MedicalRecord> => {
  try {
    const patientId = (patient.id, 10);
    await database.medicalRecord.update({
      where : {
        id : medicalRecord.id
      },
      data: {
        patient :{
          //connect: {id: Number(patient.id)},
          connect: { id: patientId },
        },
      },
    });
    return getMedicalRecordById(medicalRecord.id);
  }catch (error) {
    console.error(error);
    throw new Error('Database error. See server log for details.');
}
}*/
export default { getAllMedicalRecords, addMedicalRecord, getMedicalRecordById }