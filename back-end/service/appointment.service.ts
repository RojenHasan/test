import appointmentDb from "../domain/data-access/appointment.db";
import { Appointment } from "../domain/model/appointment";
import { AppointmentInput, DoctorInput, MedicalRecordInput, MedicalTestInput, PatientInput } from "../types/types";
import doctorService from "./doctor.service";
import medicalTestService from "./medicalTest.service";
import patientService from "./patient.service";


const getAllAppointments = async (): Promise<Appointment[]> =>
  appointmentDb.getAllAppointments();

const getAppointmentById = async (id: number): Promise<Appointment> => {
  if (Number.isNaN(Number(id))) { throw new Error('Id is invalid') }
  const appointment = await appointmentDb.getAppointmentById(id);

  if (!appointment) throw new Error(`No appointment found with id ${id}`);
  return appointment;
}

const addAppointment = async (appointmentInput: AppointmentInput): Promise<Appointment> => {
  try {
    console.log("Creating Appointment with the following data:");
    console.log("Date:", appointmentInput.date);
    console.log("Time:", appointmentInput.time);
    console.log("Patient ID:", appointmentInput.patient.id);
    console.log("Doctor ID:", appointmentInput.doctor.id);
    console.log("MedicalRecord ID:", appointmentInput.medicalRecord.id);
    const appointmentPrisma = {
      medicalRecord: appointmentInput.medicalRecord,
      time: appointmentInput.time,
      date: appointmentInput.date,
      patient: appointmentInput.patient,
      doctor: appointmentInput.doctor,
    };

    const newAppointment = await appointmentDb.addAppointment(appointmentPrisma);
    return newAppointment;
   
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to add appointment. Error: ${error.message}`);
}
};
const addMedicalTestsToAppointment = async ({
  appointment,
  medicalTests
}: {
  appointment: AppointmentInput;
  medicalTests: MedicalTestInput[];
}): Promise<Appointment> => {
  if (!appointment.id) throw new Error('Appointment id is required');
  if (!medicalTests.length) throw new Error('At least one medicalTest is required');
  if (!appointmentDb.getAppointmentById(appointment.id)) throw new Error('Appointment not found');

  return appointmentDb.addMedicalTestsToAppointment({ appointment, medicalTests });
};

/*const addAppointment = async (appointmentInput: AppointmentInput): Promise<Appointment> => {
  try {
      // Extract the input fields
      const { date, time, patient, doctor, medicalRecord, medicalTests } = appointmentInput;

      // Validate the input fields
      await handleAppointmentInput(date, time, patient, doctor, medicalRecord, medicalTests);

      // Add the appointment to the database
      return await appointmentDb.addAppointment(appointmentInput);
  } catch (error) {
      console.error(error);
      throw new Error('Failed to add appointment. See server log for details.');
  }
};*/

const handleAppointmentInput = async (
  date: Date,
  time: Date,
  patient: PatientInput,
  doctor: DoctorInput,
  medicalRecord: MedicalRecordInput,
  medicalTests: MedicalTestInput[]
) => {
  if (!doctor.id) {
    throw new Error("doctor Id can't be empty.");
  }

  if (!patient.id) {
    throw new Error("patientId can't be empty.");
  }
  if (!medicalRecord.id) {
    throw new Error("medicalRecordId can't be empty.");
  }

  if (!medicalTests || medicalTests.length === 0) {
    throw new Error("medicalTest can't be empty.");
  }

  // Check if patient exists
  await patientService.getPatientById(patient.id);

  // Check if doctor exists
  await doctorService.getDoctorById(doctor.id);

  // Check if date is a valid date
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date.");
  }

  // Check if time is a valid time
  if (isNaN(time.getTime())) {
    throw new Error("Invalid time.");
  }
};

export default { addMedicalTestsToAppointment, getAllAppointments, getAppointmentById, addAppointment };
