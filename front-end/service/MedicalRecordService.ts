const getAllMedicalRecord = async () => {
    return await fetch(process.env.NEXT_PUBLIC_API_URL+ "/medicalrecords",{
        method: "GET",
        headers: {
            "Content-type": "application/json",
            Authorization:  `Bearer ${sessionStorage.getItem("token")}`
        }

    })
}


const MedicalRecordService = {
    getAllMedicalRecord
}

export default MedicalRecordService