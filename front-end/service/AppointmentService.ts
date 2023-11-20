import { Appointment } from "../types"

const getAllAppointments = async () => {
    return await fetch(process.env.NEXT_PUBLIC_API_URL+ "/appointments",{
        method: "GET",
        headers: {
            "Content-type": "application/json",
            Authorization:  `Bearer ${sessionStorage.getItem("token")}`
        }

    })
}


const updateAppointment = async (appointment:Appointment) => {
    return await fetch(process.env.NEXT_PUBLIC_API_URL + "/appointments",
    {
        body: JSON.stringify(appointment),
        method: "PUT",
        headers: {
            "Content-type": "application/json",
            Authorization:  `Bearer ${sessionStorage.getItem("token")}`
          }
    })
}

const getAppointmentById = async (appointmentId: string) => {
    return await fetch(process.env.NEXT_PUBLIC_API_URL+ `/appointments/${appointmentId}`,{
        method: "GET",
        headers: {
            "Content-type": "application/json",
            Authorization:  `Bearer ${sessionStorage.getItem("token")}`
        }
    })
}
const addAppointment = async (appointment:Appointment) => {
   
    return await fetch(process.env.NEXT_PUBLIC_API_URL + "/appointments",
    {
        body: JSON.stringify(appointment),
        method: "POST",
        headers: {
            "Content-type": "application/json",
            Authorization:  `Bearer ${sessionStorage.getItem("token")}`
          }
    })
}


const AppointmentService = {
    addAppointment, getAllAppointments,getAppointmentById
}

export default AppointmentService