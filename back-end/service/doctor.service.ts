
import doctorDb from "../domain/data-access/doctor.db";
import { Doctor } from "../domain/model/doctor";
import { User } from "../domain/model/user";
import { AppointmentInput, DoctorInput } from "../types/types";


const getAllDoctors = async (): Promise<Doctor[]> =>
    doctorDb.getAllDoctors();

    const getDoctorById = async (id: number): Promise<Doctor> => {
        if (Number.isNaN(Number(id))) { throw new Error('Id is invalid') }
        const doctorInput: DoctorInput = {
            id: id,
            name: "",
            experience: "",
            availability: ""
        };
    
        const doctor = await doctorDb.getDoctorById(doctorInput);
    
        if (!doctor) throw new Error(`No doctor found with id ${id}`);
        return doctor;
    }

const addDoctor = async ({
    name,
    user,
    experience,
    availability,
}: DoctorInput): Promise<Doctor> => {
   
    try {
        const doctor = await doctorDb.addDoctor({ name, user, experience, availability });
        return doctor;
    } catch (error) {
        throw new Error(error.message);
    }
};



const deleteDoctor = async ({ id }: { id: number }) =>
    await doctorDb.deleteDoctor({ id });


const updateDoctor = async (doctorInput: DoctorInput): Promise<Doctor> => {
    const id = doctorInput.id;

    // Check if the doctor with the given ID exists
    const existingDoctor = await getDoctorById(id);

    if (!existingDoctor) {
        throw new Error(`Dcotor with id ${id} not found`);
    }

    // Convert UserInput to User
    const user: User = {
        id: doctorInput.user.id, // Assuming id is available in UserInput
        email: doctorInput.user.email,
        password: doctorInput.user.password
    };

    // Prepare the data for the update
    const updateData = {
        id,
        name: doctorInput.name,
        experience: doctorInput.experience,
        availability: doctorInput.availability,
        user: user,
    };

    // Call the Prisma update function
    const updatedDoctor = await doctorDb.updateDoctor(updateData);

    return updatedDoctor;
}
const getAllMedicalTestsByDoctor = async (doctorId: number) => {

    return await doctorDb.getAllMedicalTestsByDoctor(doctorId);
};

const getAppointmentsForDoctor = async (doctorId: number) => {
    return await doctorDb.getAllAppointmentsForDoctor(doctorId);
}
const addAppointmentToDoctorById = async (doctorId: number, appointmentInput: AppointmentInput): Promise<Doctor> => {
    try {
        const updatedDoctor = await doctorDb.addAppointmentToDoctorById(doctorId, appointmentInput);
        return updatedDoctor;
    } catch (error) {
        throw new Error(error.message);
    }
};
export default { getDoctorById, getAllMedicalTestsByDoctor, getAllDoctors, addDoctor, deleteDoctor, updateDoctor, getAppointmentsForDoctor, addAppointmentToDoctorById }