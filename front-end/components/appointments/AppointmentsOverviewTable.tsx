import React from "react";
import { Appointment, Doctor, Patient, MedicalRecord } from "../../types";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfo, faTrash, faPen } from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";

type Props = {
    appointments: Array<Appointment>;
};

const AppointmentsOverviewTable: React.FC<Props> = ({ appointments }: Props) => {
    return (
        <>
            {Array.isArray(appointments) && appointments.length > 0 ? (
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Date</th>
                            <th scope="col">Time</th>
                            <th scope="col">Doctor</th>
                            <th scope="col">Patient</th>
                            <th scope="col">Medical Record</th>
                            <th scope="col">Delete</th>
                            <th scope="col">Update</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map((appointment, index) => (
                            <tr key={index}>
                                <td>{format(appointment.date, "MM/dd/yyyy")}</td>
                                <td>{format(appointment.time, "HH:mm:ss")}</td>
                                <td>{appointment.doctor.name}</td>
                                <td>{appointment.patient.name}</td>
                                <td>{appointment.medicalRecord.diagnosis}</td>
                                <td>
                                    <Link
                                        href={`/appointments/${appointment.id}/delete`}
                                        className="btn btn-outline-danger"
                                    >
                                        <FontAwesomeIcon size="xs" icon={faTrash} />
                                    </Link>
                                </td>
                                <td>
                                    <Link
                                        href={`/appointments/${appointment.id}/update`}
                                        className="btn btn-outline-primary"
                                    >
                                        <FontAwesomeIcon size="xs" icon={faPen} />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No appointments available</p>
            )}
        </>
    );
};

export default AppointmentsOverviewTable;
