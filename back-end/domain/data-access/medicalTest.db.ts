import { Prisma } from "@prisma/client";

import { MedicalTestInput, PatientInput } from "../../types/types";
import { database } from "../../util/db.server";
import { Doctor } from "../model/doctor";
import { MedicalTest } from "../model/medicalTest";
import { Patient } from "../model/patient";

const getAllMedicalTests = async (): Promise<MedicalTest[]> => {
    try {
      const medicalTestsPrisma = await database.medicalTest.findMany({
        include: {
          patient: {
            include: { user: true }
          },
          doctor: {
            include: { user: true }
          }
        }
      });
  
      return medicalTestsPrisma.map((medicalTestPrisma) =>
        MedicalTest.from(medicalTestPrisma as any)
      );
    } catch (error) {
      console.error(error);
      throw new Error('Database error. See server log for details.');
    }
  };


const getMedicalTestById = async (id: number): 
Promise<MedicalTest> =>{
    try{
        const medicalTestPrisma = await database.medicalTest.findUnique({
            where :{id: id},
            include: {
                patient: {
                  include: { user: true }
                },
                doctor: {
                  include: { user: true }
                }
              }
        })
        return MedicalTest.from(medicalTestPrisma as any)

    }catch(error){
        throw new Error(`MedicalTest with id {${id}} couldn't be found`)
    }
}
const addMedicalTest = async ({
  name,
  cost,
  description,
  patient,
  doctor
}: MedicalTestInput): Promise<MedicalTest> => {
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

      const medicalTestPrisma = await database.medicalTest.create({
          data: {
              name,
              cost,
              description,
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

      return MedicalTest.from(medicalTestPrisma as any);
  } catch (error) {
      console.error(error);
      throw new Error(`Failed to create the medical test. ${error.message}`);
  }
};


export default { getAllMedicalTests,getMedicalTestById,addMedicalTest};