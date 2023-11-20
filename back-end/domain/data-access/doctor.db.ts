
import { Prisma } from "@prisma/client";
import { AppointmentInput, DoctorInput } from "../../types/types";
import { database } from "../../util/db.server";
import { Doctor } from "../model/doctor";
import { User } from "../model/user";


const getAllDoctors = async (): Promise<Doctor[]> => {
    try{
        const doctorsPrisma = await database.doctor.findMany({
            include: {user:true}
        });
        return doctorsPrisma.map((doctorPrisma)=>
        Doctor.from(doctorPrisma as any))
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
}


const updateDoctor = async ({
    id,
    name,
    user,
    experience,
    availability,
}:{
    id: number,
    name: string,
    user: User,
    experience: string,
    availability: string
}):Promise<Doctor> => {
    if (!name) {
        throw new Error('Name cannot be empty.');
    }

    if (!experience) {
        throw new Error('Experience cannot be empty.');
    }

    if (!availability) {
        throw new Error('Availability cannot be empty.');
    }
      try {
        const updatedDoctor = await database.doctor.update({
            where: { id: id },
            data: {
                name: name,
                experience: experience,
                availability :availability,
                user: {
                    connect: {
                        id: user.id
                    }
                }
            },
            include: { user: true },
            });
            return Doctor.from(updatedDoctor);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2016') {
                throw new Error(`Doctor with ID ${id} not found.`);
            } 
        } 
    }
};
const addDoctor = async ({
    name,
    user,
    experience,
    availability,
}: DoctorInput): Promise<Doctor> => {
    try {
        // Check if the user is already associated with a doctor
        const existingDoctor = await database.doctor.findFirst({
            where: {
                user: {
                    email: user.email,
                },
            },
        });

        if (existingDoctor) {
            throw new Error("User is already connected to a doctor");
        }
        //check if email exist
        const existingUser = await database.user.findFirst({
            where: {
                email: user.email,
            },
        });

        if (!existingUser) {
            throw new Error("User email does not exist in the system");
        }

        // If the user is not associated with a doctor, create a new doctor
        const doctorPrisma = await database.doctor.create({
            data: {
                name,
                experience,
                availability,
                user: {
                    connect: {
                        email: user.email,
                    },
                },
            },
            include: { user: true },
        });

        return Doctor.from(doctorPrisma as any);
    } catch (error) {
        throw new Error(error.message);
    }
};

const getDoctorById = async ({id}: DoctorInput) : Promise<Doctor | null> =>{
    try{
        if (isNaN(id) || typeof id !== 'number') {
            throw new Error(`Invalid ID provided: ${id}`);
        }
        const doctorPrisma = await database.doctor.findUnique({
            where :{id: id},
            include: {user:true}
        })
        return doctorPrisma ? Doctor.from(doctorPrisma as any) : null

    }catch(error){
        throw new Error(`Doctor with id {${id}} couldn't be found`)
    }
}

const deleteDoctor = async ({id}:{id: number}): Promise<Doctor> => {
    const doctorToDelete = await getDoctorById({ id });

    if (!doctorToDelete) {
        console.log("hhhhh")
        throw new Error(`Doctor with ID ${id} not found.`);
    }
    // Delete the doctor
    const deletedDoctor= await database.doctor.delete({
        where: {
            id: id
        }, include: {
            user: true
        }
    });
    // Return the deleted doctor
    console.log("rojin")
    return deletedDoctor;
};

const getAllMedicalTestsByDoctor = async (doctorId: number) => {
    try {
        const medicalTestsPrisma = await database.medicalTest.findMany({
            where: { doctorId: doctorId },
            include: {
                patient: true,
                doctor: true,
            },
        });

        return medicalTestsPrisma.map((medicalTestPrisma) => {
            return {
                id: medicalTestPrisma.id,
                name: medicalTestPrisma.name,
                cost: medicalTestPrisma.cost,
                description: medicalTestPrisma.description,
                patient: {
                    id: medicalTestPrisma.patient.id,
                    name: medicalTestPrisma.patient.name,
                },
                doctor: {
                    name: medicalTestPrisma.doctor.name,
                    experience: medicalTestPrisma.doctor.experience,
                },
            };
        });
    } catch (error) {
        console.error(error);
        throw new Error('An error occurred while fetching medical tests for the doctor.');
    }
};

const getDoctorByIdId = async (id: number ) : Promise<Doctor | null> =>{
    try{
        if (isNaN(id) || typeof id !== 'number') {
            throw new Error(`Invalid ID provided: ${id}`);
        }
        const doctorPrisma = await database.doctor.findUnique({
            where :{id: id},
            include: {user:true}
        })
        return doctorPrisma ? Doctor.from(doctorPrisma as any) : null

    }catch(error){
        throw new Error(`Doctor with id {${id}} couldn't be found`)
    }
}

const getAllAppointmentsForDoctor = async (doctorId: number) => {
    try {
        const appointmentsPrisma = await database.appointment.findMany({
            where: { doctorId: doctorId },
            include: {
                patient: true,
                medicalRecord: true,
                medicalTest: true,
            },
        });

        return appointmentsPrisma.map((appointmentPrisma) => {
            return {
                id: appointmentPrisma.id,
                date: appointmentPrisma.date,
                time: appointmentPrisma.time,
                patient: {
                    id: appointmentPrisma.patient.id,
                    name: appointmentPrisma.patient.name,
                    user : appointmentPrisma.patient.userId,
                    medical_History: appointmentPrisma.patient.medical_History,
                    street: appointmentPrisma.patient.street,
                    postcode: appointmentPrisma.patient.postcode,
                    housenr: appointmentPrisma.patient.housenr,
                    stad: appointmentPrisma.patient.stad
                },
                medicalRecord: {
                    id: appointmentPrisma.medicalRecord.id,
                    diagnosis: appointmentPrisma.medicalRecord.diagnosis,
                    treatment: appointmentPrisma.medicalRecord.treatment,
                    date : appointmentPrisma.medicalRecord.date,
                    patient : appointmentPrisma.medicalRecord.patientId,
                    doctor: appointmentPrisma.medicalRecord.doctorId
                },
                medicalTests: appointmentPrisma.medicalTest.map((testPrisma) => {
                    return {
                        id: testPrisma.id,
                        name: testPrisma.name,
                        cost: testPrisma.cost,
                        description: testPrisma.description,
                        patient : testPrisma.patientId,
                        doctor:testPrisma.doctorId
                    };
                }),
            };
        });
    } catch (error) {
        console.error(error);
        throw new Error('An error occurred while fetching doctor appointments.');
    }
};
const getDoctorByUserEmail = async (email: string): Promise<Doctor | null> => {
    try {
        const user = await database.user.findUnique({
            where: {
                email: email,
            },
        });

        if (!user) {
            throw new Error(`User with email "${email}" not found`);
        }

        const doctorPrisma = await database.doctor.findUnique({
            where: {
                userId: user.id,
            },
            include: { user: true },
        });

        return doctorPrisma ? Doctor.from(doctorPrisma as any) : null;
    } catch (error) {
        console.error(error);
        throw new Error(`Doctor with email "${email}" couldn't be found`);
    }
};


const addAppointmentToDoctorById = async (doctorId: number, appointmentInput: AppointmentInput): Promise<Doctor> => {
    try {
        // Retrieve the doctor by ID
        const doctor = await database.doctor.findUnique({
            where: { id: doctorId },
            include: { user: true },
        });

        if (!doctor) {
            throw new Error(`Doctor with ID ${doctorId} not found.`);
        }

        // Create the appointment
        const appointment = await database.appointment.create({
            data: {
                date: appointmentInput.date,
                time: appointmentInput.time,
                doctorId: doctorId,
                patientId: appointmentInput.patient?.id,
                medicalRecordId: appointmentInput.medicalRecord?.id,
            },
            include: {
                patient: true,
                medicalRecord: true,
                medicalTest: true,
            },
        });

        // Update the doctor's appointments
        const updatedDoctor = await database.doctor.update({
            where: { id: doctorId },
            data: {
                appointment: {
                    connect: { id: appointment.id },
                },
            },
            include: { user: true },
        });

        return Doctor.from(updatedDoctor);
    } catch (error) {
        console.error(error);
        throw new Error('An error occurred while adding the appointment to the doctor.');
    }
};

export default {addAppointmentToDoctorById,getDoctorByUserEmail, getDoctorByIdId, getAllDoctors,getAllMedicalTestsByDoctor,  getDoctorById, addDoctor,getAllAppointmentsForDoctor, deleteDoctor,updateDoctor}