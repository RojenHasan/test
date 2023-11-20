import { useRouter } from "next/router"
import Header from "../../../components/Header"
import Footer from "../../../components/Footer"

import DoctorService from "@/service/DoctorService"
import { useEffect, useState } from "react"
import Head from "next/head"
import { Doctor } from "../../../types"
import DeleteDoctor from "@/components/doctors/DeleteDoctorConfirmation"

const DoctorInfo: React.FC = () =>{
    const [doctor, setDoctor] = useState<Doctor | undefined>(); 
    const router = useRouter()
    const {doctorId} = router.query
    const doctorToDelete = async ()=> {
        const [doctorResponse] = await Promise.all([DoctorService.getDoctorById(doctorId as string)])
        const [doctorFound] = await Promise.all([doctorResponse.json()])
        setDoctor(doctorFound)
    }

    useEffect(() =>{
        if(doctorId){
            doctorToDelete()
        }
    },[])

    return ( 
        <>
            <Head>
                <title>Delete Doctor</title>
            </Head>
            
            <main>
            <h1> Info of {doctor && doctor.name}</h1>
                {!doctorId && <p>Loading</p>}
                <section>
                    {doctor &&
                    <DeleteDoctor doctor={doctor} />}
                </section>
            </main>           
            <Footer></Footer>
        </> 
    )
}

export default DoctorInfo