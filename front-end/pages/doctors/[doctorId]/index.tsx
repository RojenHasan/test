import { useRouter } from "next/router"
import Header from "../../../components/Header"
import Footer from "../../../components/Footer"

import DoctorInfoTable from "@/components/doctors/DoctorInfoTable"
import DoctorService from "@/service/DoctorService"
import { useEffect, useState } from "react"
import Head from "next/head"
import { Doctor } from "../../../types"


const DoctorInfo = () =>{
    const [doctor, setDoctor] = useState<Doctor>();
    const router = useRouter()
    const {doctorId} = router.query

    const getDoctorInfo = async ()=> {
        const [doctorResponse] = await Promise.all([DoctorService.getDoctorById(doctorId as string)])
        const [doctorFound] = await Promise.all([doctorResponse.json()])
        setDoctor(doctorFound)
    }

    useEffect(() =>{
        if(doctorId)
            getDoctorInfo()
        }
    )

    return ( 
        <>
            <Head>
                <title>Doctor Info</title>
            </Head>
            <Header />
            <main>
                <h1> Info of {doctor && doctor.name}</h1>
                {!doctorId && <p>Loading</p>}
                <section>
                    {doctor &&
                    <DoctorInfoTable doctor={doctor} />}
                </section>
            </main>   
            <Footer></Footer>

        </> 
    )
}

export default DoctorInfo