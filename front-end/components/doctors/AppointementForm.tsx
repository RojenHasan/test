import React, { useEffect, useState } from 'react';
import { User, StatusMessage, Patient, Doctor, MedicalRecord } from '@/types';
import { Form, Button } from 'react-bootstrap';
import StatusMessageParser from '../StatusMessageParser';
import PatientService from '@/service/PatientService';
import AppointmentService from '@/service/AppointmentService';
import router, { useRouter } from 'next/router';
import DoctorService from '@/service/DoctorService';
import MedicalRecordService from '@/service/MedicalRecordService';

const AppointmentForm: React.FC = () => {
    const router = useRouter();
  
    const [date, setDate] = useState<string>("");
    const [time, setTime] = useState<string>("");
    const [patientId, setPatientId] = useState<number | undefined>(undefined);
    const [doctorId, setDoctorId] = useState<number | undefined>(undefined);
    const [medicalRecordId, setMedicalRecordId] = useState<number | undefined>(undefined);
  
    const [dateError, setDateError] = useState<string>("");
    const [timeError, setTimeError] = useState<string>("");
    const [patientIdError, setPatientIdError] = useState<string>("");
    const [doctorIdError, setDoctorIdError] = useState<string>("");
    const [medicalRecordIdError, setMedicalRecordIdError] = useState<string>("");
  
    const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null);
    const [users, setUsers] = useState<Array<User>>([]);
    const [userId, setUserId] = useState<number | undefined>(undefined);
    const [patients, setPatients] = useState<Array<Patient>>([]);
    const [doctors, setDoctors] = useState<Array<Doctor>>([]);
    const [medicalRecords, setMedicalRecords] = useState<Array<MedicalRecord>>([]);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const patientsResponse = await PatientService.getAllPatients();
          const doctorsResponse = await DoctorService.getAllDoctors();
          const medicalRecordsResponse = await MedicalRecordService.getAllMedicalRecord();
  
          if (patientsResponse.status === 200 && doctorsResponse.status === 200 && medicalRecordsResponse.status === 200) {
            const patientsData = await patientsResponse.json();
            const doctorsData = await doctorsResponse.json();
            const medicalRecordsData = await medicalRecordsResponse.json();
  
            setPatients(patientsData);
            setDoctors(doctorsData);
            setMedicalRecords(medicalRecordsData);
          } else {
            console.error("Error fetching data1");
          }
        } catch (error) {
          // Handle any fetch errors
          console.error("Error fetching data:", error);
        }
      };
  
      fetchData();
    }, []);
  
    const validate = (): boolean => {
      let isValid = true;
  
      setDateError("");
      setTimeError("");
      setPatientIdError("");
      setDoctorIdError("");
      setMedicalRecordIdError("");
  
      setStatusMessage(null);
  
      if (!date || date === "") {
        setDateError("Date can't be empty");
        isValid = false;
      }
      if (!time || time === "") {
        setTimeError("Time can't be empty");
        isValid = false;
      }
      if (!doctorId ) {
        setDoctorIdError("Doctor must be selected");
        isValid = false;
      }
      if (!patientId ) {
        setPatientIdError("Patient must be selected");
        isValid = false;
      }
      if (!medicalRecordId) {
        setMedicalRecordIdError("Medical Record must be selected");
        isValid = false;
      }
  
      return isValid;
    };
  
    const handleSubmit = async (event: any) => {
      event.preventDefault();
  
      if (!validate()) {
        return;
      }
      const user = {
        email: users.find((u) => u.id === userId)?.email || "",
    };
  
      const appointmentData = {
        date: date ? new Date(date) : new Date(), // Provide a default value or handle it based on your requirements
        time: time ? new Date(time) : new Date(),
        doctor: {
            name: doctors.find((d) => d.id === doctorId)?.name || "",
            experience: doctors.find((d) => d.id === doctorId)?.experience || "",
            availability: doctors.find((d) => d.id === doctorId)?.availability || "",
            user: {
                email: users.find((u) => u.id === userId)?.email || "",
                password: "password", // Provide a placeholder value
            },
        },
        patient: {
            name: patients.find((p) => p.id === patientId)?.name || "",
            user: {
                email: users.find((u) => u.id === userId)?.email || "",
                password: "password", 
            },
            medical_History: patients.find((p) => p.id === patientId)?.medical_History || "",
            street: patients.find((p) => p.id === patientId)?.street || "",
            postcode: patients.find((p) => p.id === patientId)?.postcode || 0,
            housenr: patients.find((p) => p.id === patientId)?.housenr || 0,
            stad: patients.find((p) => p.id === patientId)?.stad || "",
        },
        medicalRecord: {
            diagnosis: medicalRecords.find((record) => record.id === medicalRecordId)?.diagnosis || "",
            treatment: medicalRecords.find((record) => record.id === medicalRecordId)?.treatment || "",
            date: new Date(medicalRecords.find((record) => record.id === medicalRecordId)?.date || ""),
            patient: {
                name: patients.find((p) => p.id === patientId)?.name || "",
                user: {
                    email: users.find((u) => u.id === userId)?.email || "",
                    password: "password", 
                },
                medical_History: patients.find((p) => p.id === patientId)?.medical_History || "",
                street: patients.find((p) => p.id === patientId)?.street || "",
                postcode: patients.find((p) => p.id === patientId)?.postcode || 0,
                housenr: patients.find((p) => p.id === patientId)?.housenr || 0,
                stad: patients.find((p) => p.id === patientId)?.stad || "",
            },
            doctor: {
                name: doctors.find((d) => d.id === doctorId)?.name || "",
                experience: doctors.find((d) => d.id === doctorId)?.experience || "",
                availability: doctors.find((d) => d.id === doctorId)?.availability || "",
                user: {
                    email: users.find((u) => u.id === userId)?.email || "",
                    password: "password", // Provide a placeholder value
                },
            },
        },
    };
      try {
        const response = await AppointmentService.addAppointment(appointmentData);
  
        if (response.status === 200) {
          setStatusMessage({
            type: "success",
            message: "Successfully added",
          });
          setTimeout(() => {
            // Redirect to the doctors page or another appropriate page
            router.push("/doctors");
          }, 2000);
        } else {
          const data = await response.json();
          setStatusMessage({
            type: "error",
            message: data.errorMessage || "An error occurred while adding the appointment.",
          });
        }
      } catch (error) {
        console.error("Error adding appointment:", error);
        setStatusMessage({
          type: "error",
          message: "An unexpected error occurred while adding the appointment. Please try again.",
        });
      }
    };
  

    return (
        <>
            {statusMessage !== null && <StatusMessageParser statusMessage={statusMessage} />}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="date">Date</Form.Label>
                    <Form.Control
                        id="date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                    <Form.Text className="text-muted">
                        {dateError && <div className="text-danger">{dateError}</div>}
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label htmlFor="time">Time</Form.Label>
                    <Form.Control
                        id="time"
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                    />
                    <Form.Text className="text-muted">
                        {timeError && <div className="text-danger">{timeError}</div>}
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label htmlFor="selectPatient">Select Patient</Form.Label>
                    <Form.Select
                        id="selectPatient"
                        value={patientId}
                        onChange={(e) => setPatientId(Number(e.target.value))}
                    >
                        <option value="" disabled>Select patient...</option>
                        {patients.map((patient) => (
                            <option key={patient.id} value={patient.id}>
                                {patient.name}
                            </option>
                        ))}
                    </Form.Select>
                    <Form.Text className="text-muted">
                        {patientIdError && <div className="text-danger">{patientIdError}</div>}
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label htmlFor="selectDoctor">Select Doctor</Form.Label>
                    <Form.Select
                        id="selectDoctor"
                        value={doctorId}
                        onChange={(e) => setDoctorId(Number(e.target.value))}
                    >
                        <option value="" disabled>Select doctor...</option>
                        {doctors.map((doctor) => (
                            <option key={doctor.id} value={doctor.id}>
                                {doctor.name}
                            </option>
                        ))}
                    </Form.Select>
                    <Form.Text className="text-muted">
                        {doctorIdError && <div className="text-danger">{doctorIdError}</div>}
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label htmlFor="selectMedicalRecord">Select Medical Record</Form.Label>
                    <Form.Select
                        id="selectMedicalRecord"
                        value={medicalRecordId}
                        onChange={(e) => setMedicalRecordId(Number(e.target.value))}
                    >
                        <option value="" disabled>Select medical record...</option>
                        {medicalRecords.map((record) => (
                            <option key={record.id} value={record.id}>
                                {record.diagnosis} - {record.treatment}
                            </option>
                        ))}
                    </Form.Select>
                    <Form.Text className="text-muted">
                        {medicalRecordIdError && <div className="text-danger">{medicalRecordIdError}</div>}
                    </Form.Text>
                </Form.Group>
                <Button variant="outline-primary" type="submit">
                    Add
                </Button>
            </Form>
        </>
    );
};

export default AppointmentForm;
