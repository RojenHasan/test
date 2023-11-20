import { Prisma } from "@prisma/client";
import patientDb from "../domain/data-access/patient.db"
import { Patient } from "../domain/model/patient"
import { User } from "../domain/model/user";
import { PatientInput } from "../types/types";
import { database } from "../util/db.server";

const getAllPatients = async (): Promise<Patient[]>=> {
    return await patientDb.getAllPatients();
}
const getPatientById = async (id: number): Promise<Patient> => {
    if (Number.isNaN(Number(id))) {
      throw new Error('Id is invalid');
    }
    const patient = await patientDb.getPatientById(id); // Pass id as a number, not an object
    if (!patient) throw new Error(`No patient found with id ${id}`);
    return patient;
  };
  
const addPatient = async (patientInput: PatientInput): Promise<Patient> => {
      /* Check if a doctor or patient associated with the user already exists
      const existingDoctor = await database.doctor.findFirst({
          where: {
              userId: patientInput.user.id,
          },
      });
      const existingPatient = await database.patient.findFirst({
          where: {
              userId: patientInput.user.id,
          },
      });

      if (existingDoctor || existingPatient) {
          // If a doctor or patient associated with the user already exists, throw an error
          throw new Error(`A doctor/patient is already associated with this user`);
      }*/

      // Create the new patient using Prisma
      const patientPrisma = {
              name: patientInput.name,
              medical_History: patientInput.medical_History,
              street: patientInput.street,
              postcode: patientInput.postcode,
              housenr: patientInput.housenr,
              stad: patientInput.stad,
              user: patientInput.user
      };

      const newPatient = await patientDb.addPatient(patientPrisma)
      return newPatient

};

const updatePatient = async (patientInput: PatientInput): Promise<Patient> => {
  const id = patientInput.id;

  // Check if the patient with the given ID exists
  const existingPatient = await getPatientById(id);

  if (!existingPatient) {
      throw new Error(`Patient with id ${id} not found`);
  }

  // Convert UserInput to User
  const user: User = {
      id: patientInput.user.id, // Assuming id is available in UserInput
      email: patientInput.user.email,
      password : patientInput.user.password
  };

  // Prepare the data for the update
  const updateData = {
      id,
      name: patientInput.name,
      medical_History: patientInput.medical_History,
      street: patientInput.street,
      postcode: patientInput.postcode,
      housenr: patientInput.housenr,
      stad: patientInput.stad,
      user: user,
  };

  // Call the Prisma update function
  const updatedPatient = await patientDb.updatePatient(updateData);

  return updatedPatient;
}


const deletePatient = async (id: number): Promise<void> => {
  if (Number.isNaN(Number(id))) {
    throw new Error("Id is invalid");
  }
   await patientDb.deletePatient(id);

};
export default{getAllPatients, getPatientById, addPatient, updatePatient, deletePatient}