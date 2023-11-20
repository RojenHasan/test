import { Button, Form } from "react-bootstrap"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import StatusMessageParser from "../StatusMessageParser"

import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import pages from "@/pages"
import { StatusMessage, User } from "@/types"
import { title } from "process"
import UserService from "@/service/UserService"
import DoctorService from "@/service/DoctorService"
const UpdateDoctor: React.FC = () => {
    const router = useRouter();

    const [id, setId] = useState<number | undefined>(undefined);
    const [experience, setExperience] = useState("");
    const [name, setName] = useState("");
    const [availability, setAvailability] = useState("");
    const [userId, setUserId] = useState<number | undefined>(undefined);

    const [idError, setIdError] = useState("");
    const [experienceError, setExperienceError] = useState("");
    const [nameError, setNameError] = useState("");
    const [availabilityError, setAvailabilityError] = useState("");
    const [userError, setUserError] = useState("");

    const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null);

    const [users, setUsers] = useState<Array<User>>([]);

    useEffect(() => {
        // Fetch the list of users and set it in the state
        const fetchUsers = async () => {
            try {
                const response = await UserService.getAllUsers();
                if (response.status === 200) {
                    const data = await response.json();
                    setUsers(data);
                } else {
                    console.error("API request failed with status:", response.status);
                    // Handle the error appropriately, e.g., display an error message
                }
            } catch (error) {
                console.error("Fetch error:", error);
                // Handle any fetch errors, e.g., display a network error message
            }
        };
        fetchUsers();
    }, []);

    const validate = (): boolean => {
        let isValid = true;

        setIdError("");
        setExperienceError("");
        setNameError("");
        setAvailabilityError("");
        setUserError("");

        setStatusMessage(null);

        if (!name || name.trim() === "") {
            setNameError("Name can't be empty");
            isValid = false;
        }
        if (!availability || availability.trim() === "") {
            setAvailabilityError("Availability can't be empty");
            isValid = false;
        }
        if (!experience || experience.trim() === "") {
            setExperienceError("Experience can't be empty");
            isValid = false;
        }

        return isValid;
    };

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        if (!validate() || users.length === 0) {
            return;
        }

        const user = users.find((u) => u.id === userId);

        if (!user) {
            setUserError("Selected user not found");
            return;
        }

        const doctor = {
            id,
            name,
            experience,
            availability,
            user: {
                email: user.email,
                password: "your-placeholder-password",
            },
        };

        const response = await DoctorService.updateDoctor(doctor);

        try {
            if (response.status === 200) {
                const data = await response.json();
                setStatusMessage({
                    type: "success",
                    message: "Successfully updated",
                });
                setTimeout(() => {
                    router.push("/doctors");
                }, 2000);
            } else if (response.status === 401) {
                const data = await response.json();
                setStatusMessage({
                    type: "unauthorized",
                    message: data.errorMessage,
                });
            } else {
                try {
                    const data = await response.json();
                    if (data.errorMessage) {
                        setStatusMessage({
                            type: "error",
                            message: data.errorMessage,
                        });
                    } else {
                        setStatusMessage({
                            type: "error",
                            message: "An error occurred",
                        });
                    }
                } catch (error) {
                    console.error("Error parsing JSON response:", error);
                    setStatusMessage({
                        type: "error",
                        message: "Error parsing JSON response",
                    });
                }
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error("Fetch error:", error);
                setStatusMessage({
                    type: "error",
                    message: `Fetch error: ${error.message}`,
                });
            } else {
                console.error("Unknown error:", error);
                setStatusMessage({
                    type: "error",
                    message: `Unknown error: ${error}`,
                });
            }
        }
    };

    return (
        <>
            {statusMessage !== null && (
                <StatusMessageParser statusMessage={statusMessage} />
            )}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="id">ID</Form.Label>
                    <Form.Control
                        id="id"
                        type="number"
                        value={id || ""}
                        onChange={(event) =>
                            setId(parseInt(event.target.value) || undefined)
                        }
                    />
                    <Form.Text className="text-muted">
                        {idError && <div className="text-danger">{idError}</div>}
                    </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="name">name</Form.Label>
                    <Form.Control id="name" type="text" value={name} onChange={(event) => { setName(event.target.value) }} />
                    <Form.Text className="text-muted">
                        {nameError && <div className="text-danger">{nameError}</div>}
                    </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="">Availability</Form.Label>
                    <Form.Control id="availability" type="text" value={availability} onChange={(event) => { setAvailability(event.target.value) }} />
                    <Form.Text className="text-muted">
                        {availabilityError && <div className="text-danger">{availabilityError}</div>}
                    </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="">experience</Form.Label>
                    <Form.Control id="experience" type="text" value={experience} onChange={(event) => { setExperience(event.target.value) }} />
                    <Form.Text className="text-muted">
                        {experienceError && <div className="text-danger">{experienceError}</div>}
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label htmlFor="selectUser">User</Form.Label>
                    <Form.Select
                        defaultValue={'DEFAULT'}
                        id="selectUser"
                        onChange={(event) => {
                            setUserId(Number(event.target.value)); // Convert the value to a number
                        }}
                    >
                        <option value="DEFAULT" disabled>Choose existing user ...</option>
                        {users && users.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.email}
                            </option>
                        ))}
                    </Form.Select>

                    <Form.Text>
                        {userError && <div className="text-danger">{userError}</div>}
                    </Form.Text>
                </Form.Group>

                <Button variant="outline-primary" type="submit">
                    Update
                </Button>
            </Form>
            <Link href="/doctors" className="btn btn-outline-primary mt-2">
                <FontAwesomeIcon size="xs" icon={faArrowLeft} /> Doctors
            </Link>
        </>
    )
}

export default UpdateDoctor

