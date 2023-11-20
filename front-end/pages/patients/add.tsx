/*import Head from "next/head"
import { Button, Form } from "react-bootstrap"
import { useState } from "react"
import { useRouter } from "next/router"
import StatusMessageParser from "../../components/StatusMessageParser"
import Footer from "../../components/Footer"
import PatientService from "@/service/PatientService"
import { Patient, StatusMessage } from "../../types"

const AddPatient: React.FC = () => {
    const router = useRouter()
    const [name, setName] = useState("")
    const [userEmail, setUserEmail] = useState("")
    const [medical_History, setMedical_History] = useState("")
    const [street, setStreet] = useState("")
    const [postcode, setPostcode] = useState("")
    const [housenr, setHousenr] = useState("")
    const [stad, setStad] = useState("")

    const [nameError, setNameError] = useState("")
    const [userEmailError, setUserEmailError] = useState("")
    const [medical_HistoryError, setMedical_HistoryError] = useState("")
    const [streetError, setStreetError] = useState("")
    const [postcodeError, setPostcodeError] = useState("")
    const [housenrError, setHousenrError] = useState("")
    const [stadError, setStadError] = useState("")
    
    const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null);


    const validate = (): boolean => {
        let isValid = true
        setNameError("")
        setUserEmailError("")
        setMedical_HistoryError("")
        setStreetError("")
        setPostcodeError("")
        setHousenrError("")
        setStadError("")
        setStatusMessage(null)

        if(!name && name.trim() === ""){
            setNameError("Name can't be empty")
            isValid = false
        }
        if(!medical_History && medical_History.trim() === ""){
            setMedical_HistoryError("medical_History can't be empty")
            isValid = false
        }
        if(!stad && stad.trim() === ""){
            setStadError("stad can't be empty")
            isValid = false
        }
        if(!street && street.trim() === ""){
            setStreetError("street can't be empty")
            isValid = false
        }
        if(!postcode && postcode.trim() === ""){
            setPostcodeError("postcode can't be empty")
            isValid = false
        }
        if(!postcode || Number.isNaN(Number(postcode))){
            setPostcodeError("postcode must be number")
            isValid = false
        }
        
        if(!housenr || Number.isNaN(Number(housenr))){
            setHousenrError("housenr must be number")
            isValid = false
        }
                 
        return isValid
    }



    const handleSubmit = async (event: any) => {
        event.preventDefault()
        if(!validate()){
            return 
        } 

        const patient = {
            name,userEmail, medical_History, stad,street , postcode: Number(postcode),housenr: Number(housenr)
        }
        
        const response = await PatientService.addPatient(patient)
        const data = await response.json()
        if(response.status === 200){
            setStatusMessage({
                type: "success",
                message: "Successfully added"
            })
                    
            setTimeout(() => {
                router.push("/authors")
            },2000)
        
        }else if(response.status === 401){
            setStatusMessage({
                type: "unauthorized",
                message: data.errorMessage
            })
        }else {
            setStatusMessage({
                type: "error",
                message: data.errorMessage
            })
        }
    }

    return (
    <>
        <Head>
            <title>Add Patient</title>
        </Head>
        <h4 className="text-center mb-4">Add Patient</h4>
        <main>
            <section className="row justify-content-center min-vh-100">
                <div className="col-4">
                {statusMessage !== null && (
              <StatusMessageParser statusMessage={statusMessage} />
            )}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="name">Name</Form.Label>
                            <Form.Control id="name" type="text" value={name} onChange={(event)=> {setName(event.target.value)}}/>
                            <Form.Text  className="text-muted">
                                {nameError && <div className="text-danger">{nameError}</div>}
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="medical_History">medical_History</Form.Label>
                            <Form.Control id="medical_History" type="text" value={medical_History} onChange={(event)=> {setMedical_History(event.target.value)}}/>
                            <Form.Text  className="text-muted">
                                {medical_HistoryError && <div className="text-danger">{medical_HistoryError}</div>}
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="street">Street</Form.Label>
                            <Form.Control id="street" type="text" value={street} onChange={(event)=> {setStreet(event.target.value)}}/>
                            <Form.Text  className="text-muted">
                                {streetError && <div className="text-danger">{streetError}</div>}
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="postcode">postcode</Form.Label>
                            <Form.Control id="postcode" type="text" value={postcode} onChange={(event)=> {setPostcode(event.target.value)}}/>
                            <Form.Text  className="text-muted">
                                {postcodeError && <div className="text-danger">{postcodeError}</div>}
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="housenr">housenr</Form.Label>
                            <Form.Control id="housenr" type="text" value={housenr} onChange={(event)=> {setHousenr(event.target.value)}}/>
                            <Form.Text  className="text-muted">
                                {housenrError && <div className="text-danger">{housenrError}</div>}
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="stad">Stad</Form.Label>
                            <Form.Control id="stad" type="text" value={stad} onChange={(event)=> {setStad(event.target.value)}}/>
                            <Form.Text  className="text-muted">
                                {stadError && <div className="text-danger">{stadError}</div>}
                            </Form.Text>
                        </Form.Group>
                        
                        

                        <Button variant="outline-primary" type="submit">
                            Submit
                        </Button>
                    </Form>

                 
                </div>
            </section>
        </main> 
      <Footer></Footer>

    </>    
    )
}

export default AddPatient
*/
