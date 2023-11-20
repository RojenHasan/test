import React from "react"
import { Doctor } from "../../types"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfo, faTrash, faPen } from "@fortawesome/free-solid-svg-icons";


type Props = {
    doctors: Array<Doctor>;
    onDoctorClick: (doctor: Doctor) => void;
}


const DoctorsOverviewTable: React.FC<Props> = ({ doctors, onDoctorClick }: Props) => {
    return (
        <>
            {doctors && (
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">DoctorInfo</th>
                            <th scope="col">Delete</th>
                            <th scope="col">Update</th>
                            <th scope="col">Make appointment</th>
                        </tr>
                    </thead>
                    <tbody>
                        {doctors.map((doctor, index) => (
                            <tr
                                key={index}
                                onClick={() => onDoctorClick(doctor)}
                                role="button">
                                <td>{doctor.name}</td>
                                <td><Link href={`/doctors/${doctor.id}`} className="btn btn-outline-info"><FontAwesomeIcon size="xs" icon={faInfo} /></Link></td>
                                <td><Link href={`/doctors/${doctor.id}/delete`} className="btn btn-outline-danger"><FontAwesomeIcon size="xs" icon={faTrash} /></Link></td>
                                <td><Link href={`/doctors/${doctor.id}/update`} className="btn btn-outline-primary"><FontAwesomeIcon size="xs" icon={faPen} /></Link></td>
                                <td>
                                    <Link href={`/doctors/${doctor.id}/appointments`} className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
                                         +
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </>
    )
}

export default DoctorsOverviewTable