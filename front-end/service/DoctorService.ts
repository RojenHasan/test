import { Doctor } from "../types"

const getAllDoctors = async () => {
    return await fetch(process.env.NEXT_PUBLIC_API_URL+ "/doctors",{
        method: "GET",
        headers: {
            "Content-type": "application/json",
            Authorization:  `Bearer ${sessionStorage.getItem("token")}`
        }

    })
}


const updateDoctor = async (doctor:Doctor) => {
    return await fetch(process.env.NEXT_PUBLIC_API_URL + "/doctors",
    {
        body: JSON.stringify(doctor),
        method: "PUT",
        headers: {
            "Content-type": "application/json",
            Authorization:  `Bearer ${sessionStorage.getItem("token")}`
          }
    })
}

const getDoctorById = async (doctorId: string) => {
    return await fetch(process.env.NEXT_PUBLIC_API_URL+ `/doctors/${doctorId}`,{
        method: "GET",
        headers: {
            "Content-type": "application/json",
            Authorization:  `Bearer ${sessionStorage.getItem("token")}`
        }
    })
}
const addDoctor = async (doctor:Doctor) => {
   
    return await fetch(process.env.NEXT_PUBLIC_API_URL + "/doctors",
    {
        body: JSON.stringify(doctor),
        method: "POST",
        headers: {
            "Content-type": "application/json",
            Authorization:  `Bearer ${sessionStorage.getItem("token")}`
          }
    })
}
const deleteDoctor = async ({ id }: { id: number | undefined }) => {
    if (id === undefined) {
        throw new Error("The 'id' must be defined.");
    }

    return await fetch(process.env.NEXT_PUBLIC_API_URL + `/doctors/${id}`, {
        method: "DELETE",
        headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`
        }
    });
};

const getMedicalTestsByDoctor = async (doctorId: number) => {
    return await fetch(process.env.NEXT_PUBLIC_API_URL + `/doctors/${doctorId}/medical-tests`, {
        method: "GET",
        headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`
        }
    });
};


const addAppointmentToDoctorById = async (doctorId: number, appointmentData: any) => {
    return await fetch(process.env.NEXT_PUBLIC_API_URL + `/doctors/${doctorId}/appointments`, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`
        },
        body: JSON.stringify(appointmentData),
    });
};

const getAllAppointmentsForDoctor = async (doctorId: number) => {
    return await fetch(process.env.NEXT_PUBLIC_API_URL + `/doctors/${doctorId}/appointments`, {
        method: "GET",
        headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`
        },
    });
};

const DoctorService = {
    updateDoctor,addDoctor, getDoctorById,getAllDoctors,deleteDoctor, getMedicalTestsByDoctor,
    addAppointmentToDoctorById, getAllAppointmentsForDoctor
}

export default DoctorService