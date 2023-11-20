import Head from "next/head"
import Header from "../../components/Header"
import Footer from "../../components/Footer"

import DoctorsOverviewTable from "@/components/doctors/DoctorsOverviewTable"
import { useEffect, useState } from "react"
import { Doctor, MedicalTest } from "../../types"
import DoctorService from "@/service/DoctorService"
import MedicalTestsOverviewTable from "@/components/medicalTests/medicalTestOverviewTable"

const Doctors: React.FC = () => {
    const [doctors, setDoctors] = useState<Array<Doctor>>();
    const [error, setError] = useState<string>();
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [medicalTests, setMedicalTests] = useState<Array<MedicalTest>>([]);

    const getDoctors = async () => {
        const response = await DoctorService.getAllDoctors();
        const doctorss = await response.json();
        setDoctors(doctorss);
    };

    const fetchMedicalTests = async (doctorId: number) => {
        try {
            const response = await DoctorService.getMedicalTestsByDoctor(doctorId );
            if (response.ok) {
                const tests = await response.json();
                setMedicalTests(tests);
            } else {
                console.error("Error response:", response.status, response.statusText);
                setMedicalTests([]); // Set it as an empty array in case of an error
                setError("Error fetching medical tests");
            }
        } catch (error) {
            console.error("Fetch error:", error);
            setMedicalTests([]); // Set it as an empty array in case of an error
            setError("Error fetching medical tests");
        }
    };

    useEffect(() => {
        getDoctors();
    }, []);

    const handleDoctorClick = (doctor: Doctor) => {
        if (doctor.id !== undefined) {
            setSelectedDoctor(doctor);
            fetchMedicalTests(doctor.id);
        } else {
            setError("Invalid doctor ID");
        }
    };

    return (
        <>
            <Head>
                <title>Doctors</title>
            </Head>
            <Header />
            <main>
                <h1>Doctors</h1>
                <section>
                    {error && <div className="text-danger">{error}</div>}
                    {doctors && (
                        <DoctorsOverviewTable doctors={doctors} onDoctorClick={handleDoctorClick} />
                    )}
                    {selectedDoctor && (
                        <div>
                            <h2>Medical Tests for {selectedDoctor.name}</h2>
                            <MedicalTestsOverviewTable medicalTests={medicalTests} />
                        </div>
                    )}
                </section>
            </main>
            <Footer></Footer>
        </>
    );
};

export default Doctors;