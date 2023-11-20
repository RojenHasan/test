import { AppointmentInput, MedicalTestInput } from "../../types/types";
import { database } from "../../util/db.server"
import { Appointment } from "../model/appointment"
import { MedicalTest } from "../model/medicalTest";


const getAllAppointments = async (): Promise<Appointment[]> => {
    try {
        const appointmentsPrisma = await database.appointment.findMany({
            include: {
                doctor: { include: { user: true } },
                patient: { include: { user: true } },
                medicalRecord: { include: { doctor: true, patient: true } },
                medicalTest: { include: { doctor: true, patient: true } },
            }
        });

        return appointmentsPrisma.map((appointmentPrisma) => Appointment.from(appointmentPrisma as any));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getAppointmentById = async (id: number): Promise<Appointment> => {
    try {
        const appointmentPrisma = await database.appointment.findUnique({
            where: { id },
            include: {
                doctor: { include: { user: true } },
                patient: { include: { user: true } },
                medicalRecord: { include: { doctor: true, patient: true } },
                medicalTest: { include: { doctor: true, patient: true } },
            }
        });

        return Appointment.from(appointmentPrisma as any);
    } catch (error) {
        console.error(error);
        throw new Error(`Medical record with ID {${id}} couldn't be found`);
    }
};
const addAppointment = async ({
    date,
    time,
    patient,
    doctor,
    medicalRecord
}: AppointmentInput): Promise<Appointment> => {
    try {
        console.log("Date:", date);
        console.log("Time:", time);
        console.log("Patient ID:", patient.id);
        console.log("Doctor ID:", doctor.id);

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
        console.log("Connecting to the database to create the appointment...");

        const appointmentPrisma = await database.appointment.create({
            data: {
                date,
                time,
                patient: { connect: { id: patient.id } },
                doctor: { connect: { id: doctor.id } },
                medicalRecord: medicalRecord ? { connect: { id: medicalRecord.id } } : undefined,
            },
            include: {
                doctor: { include: { user: true } },
                patient: { include: { user: true } },
            },
        });
        

        console.log("Appointment created successfully:", appointmentPrisma);

        return Appointment.from(appointmentPrisma as any);
    } catch (error) {
        console.error(error);
        throw new Error(`Failed to add appointment. Reason: ${error.message}`);
    }
};

const addMedicalTestsToAppointment = async ({
    appointment,
    medicalTests,
}: {
    appointment: AppointmentInput;
    medicalTests: MedicalTestInput[];
}): Promise<Appointment> => {
    try {
        await database.appointment.update({
            where: {
                id: appointment.id,
            },
            data: {
                medicalTest: {
                    connect: medicalTests.map((medicalTest) => ({ id: medicalTest.id })),
                },
            },
        });
        return getAppointmentById(appointment.id)
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
}

/*
const addAppointment = async ({
    date,
    time,
    patient,
    doctor ,
    medicalRecord,
    medicalTests: selectedMedicalTests
}: AppointmentInput): Promise<Appointment> => {
    try {
      const appointmentPrisma = await database.appointment.create({
        data: {
            date,
            time,
            patient: { connect: { id: patient.id } }, // Connect the medical record to the patient
            doctor: { connect: { id: doctor.id } },
            medicalRecord: {connect:{id: medicalRecord.id}}
        },
        include: {
            doctor: { include: { user: true } },
            patient: { include: { user: true } },
            medicalRecord: { include: { doctor: true, patient: true } },
            //medicalTest: { include: { doctor: true, patient: true } },
        }
      });
      
     // Extract the IDs from selectedMedicalTests
     const selectedTestIds = selectedMedicalTests.map(test => test.id);

     const selectedTests = await database.medicalTest.findMany({
         where: {
             id: {
                 in: selectedTestIds,
             },
         },
     });
  
      await database.appointment.update({
        where: { id: appointmentPrisma.id },
        data: {
          medicalTest: {
            connect: selectedTests.map((test) => ({ id: test.id })),
          },
        },
      });
  
      return Appointment.from(appointmentPrisma as any);
    } catch (error) {
      console.error(error);
      throw new Error('Failed to add medical record. See server log for details.');
    }
  };*/

export default {
    addAppointment, addMedicalTestsToAppointment, getAllAppointments, getAppointmentById
}
