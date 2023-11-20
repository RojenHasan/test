// import UserService from '../../service/UserService';
// import PatientService from '../../service/PatientService';
// import React, { useState } from 'react';
// import { useRouter } from 'next/router';
// import { User } from '@/types';

// const RegistrationForm: React.FC = () => {
//   const router = useRouter();
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [mail, setMail] = useState('');
//   const [medHistory, setMedHistory] = useState('');
//   const [street, setStreet] = useState('');
//   const [city, setCity] = useState('');
//   const [postcode, setPostcode] = useState('');
//   const [housenr, setHousenr] = useState('');
//   const [streetError, setStreetError] = useState('');
//   const [cityError, setCityError] = useState('');
//   const [postcodeError, setPostcodeError] = useState('');
//   const [housenrError, setHousenrError] = useState('');
//   const [medHistoryError, setMedHistoryError] = useState('');
//   const [nameError, setNameError] = useState('');
//   const [mailError, setMailError] = useState('');
//   const [passwordError, setPasswordError] = useState('');
//   const [statusMessage, setStatusMessage] = useState('');

//   const validate = (): boolean => {
//     let count= 0
//     setNameError('');
//     setMailError('');
//     setPasswordError('');
//     setStatusMessage('');
//     setMedHistoryError('');
//     setStreetError('');
//     setCityError('');
//     setPostcodeError('');
//     setHousenrError('');
//     //checks need to be written still
//     if (!username || username.trim() === '') {setNameError('Name cannot be empty'); count +=1;}
//     if (!mail) {setMailError('email cannot be empty');count +=1;}
//     if (!password || password.length<6) {setPasswordError('Password is to short , 6 characters minimum');count +=1;}
//     if (count > 0) return false;
//     return true;
//   };

//   const handleSubmit = async (event: React.FormEvent) => {
//     event.preventDefault();
//     if (!validate()) {
//       return;
//     }

//     try {
//       const response = await UserService.addUser({
//         password,
//         mail,
//       });
//       if(response.status === 200){
//         const user: User = { password, email}
//         const response2 = await PatientService.addPatient({
//           user,
//           medHistory,
//           street,
//           city,
//           postcode,
//           housenr,
//         })
//         if (response2.status === 200){
//           router.push('/');
//         }
//     }  
//       else if (response.status === 500){setNameError('Username must be Unique')}    
//     } catch (error) {
//     }
//   };

//   return (
//     <div className="">
//      <div className="" >
//         <form onSubmit={handleSubmit}>
//           <div>
//             <label className="form-label" style={{ color: 'white' }}>Username:</label>
//             <input
//               className="form-control"
//               type="text"
//               value={username}
//               onChange={(event) => setUsername(event.target.value)}
//             />
//             {nameError && <div className="text-danger">{nameError}</div>}
//           </div>
//           <div>
//             <label className="form-label" style={{ color: 'white' }}>Mail:</label>
//             <input
//               className="form-control"
//               type="email"
//               value={mail}
//               onChange={(event) => setMail(event.target.value)}
//             />
//             {mailError && <div className="text-danger">{mailError}</div>}
//           </div>
//           <div>
//             <label className="form-label" style={{ color: 'white' }}>Password:</label>
//             <input
//               className="form-control"
//               type="password"
//               value={password}
//               onChange={(event) => setPassword(event.target.value)}
//             />
//             {passwordError && <div className="text-danger">{passwordError}</div>}
//           </div>
//           <button className="" style={{ color: 'white' }} type="submit">Register</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default RegistrationForm;
