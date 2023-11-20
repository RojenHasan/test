import { User } from "../types"

const login =  async (user:User)=>{
    return await fetch(process.env.NEXT_PUBLIC_API_URL 
      + "/users/login",
    {
    body: JSON.stringify(user),
    method: "POST",
    headers: {
        "Content-type": "application/json"
      }
    })

}

const signup =  async (user:User)=>{
    return await fetch(process.env.NEXT_PUBLIC_API_URL + "/users/signup",
    {
    body: JSON.stringify(user),
    method: "POST",
    headers: {
        "Content-type": "application/json"
      }
    })

}

const getAllUsers = async () => {
  return await fetch(process.env.NEXT_PUBLIC_API_URL+ "/users",{
      method: "GET",
      headers: {
          "Content-type": "application/json",
          Authorization:  `Bearer ${sessionStorage.getItem("token")}`
      }

  })
}

const UserService = {
    login,
    signup, getAllUsers
}

export default UserService

// import { LoginUser } from '@/types';
// const getAllUsers = async () => {
//     console.log(process.env.NEXT_PUBLIC_API_URL+'users')
//     const response = await fetch(process.env.NEXT_PUBLIC_API_URL+'users');
//     return await fetch(process.env.NEXT_PUBLIC_API_URL+'users',
//     {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//     }).then((response) => {
//         console.log(response)
//         return response.json();
//     }).catch((error) => {
//         console.log(error)
//     });
// }

// const addUser = async (userData: any) => {
//     try {
//       const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'users/signup', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(userData),
//       });
//       console.log(response)
//       return response;
//     } catch (error) {
//       console.error('Error registering user:', error);
//       throw error;
//     }
//   };

// const loginUser = (user: LoginUser) => {
//     try {
//     const response=  fetch (process.env.NEXT_PUBLIC_API_URL + 'users/',{
//       method: 'POST',
//       headers:{
//         "Content-Type" : "application/json",
//       },
//       body: JSON.stringify(user)
//     });
//     console.log(response)
//     return response;
//   }catch(error){console.log(error); throw error}
//   };

//   const deleteUser =async (userId:number) => {
//     try{
//       const response= await fetch (
//         `${process.env.NEXT_PUBLIC_API}users/${userId}`,
//         {
//           method: "DELETE",
//         }
//       );
//       if (response.ok) {
//         //User deleted succes
//         return;
//       }else{
//         throw new Error('Failed to delete User')
//       }
//     } catch (error){
//       console.error('Error deleting User', error);
//       throw new Error('Failed to delete User')
//     }
//   }

//   const UserService = {
//     getAllUsers,
//     addUser,
//     loginUser,
//     deleteUser,
// };
  
// export default UserService;