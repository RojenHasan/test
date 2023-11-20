
import UserService from "@/service/UserService";
import React, {useState,useEffect } from "react";
import { User } from "@/types";
import UserOverviewTable from "@/components/users/UserOverview";
import styles  from "../../styles/cocktail.module.css";
import Link from "next/link";


const Users: React.FC = () =>{
    const [users, setUsers] = useState<Array<User>>()
    const [error, setError] = useState('');

    const getUsers =async() => {
        const response = await UserService.getAllUsers();
        const users= await response.json();
        setUsers(users)
        console.log(users)
    }

    useEffect(() =>{
        console.log(getUsers)
        getUsers()
    }, [])
    const handleUserListChange = (updatedUsers: Array<User>)=> {
        setUsers(updatedUsers);
    };

    return(
        <>
        <main>
            <section className="masthead">
            <div>
                <div>
                    <div>
                        <div>
                            <div>
                                <h1>Users</h1>
                                <div>
                                    <div > 
                                        <UserOverviewTable users={users} onUserListChange={handleUserListChange} />
                                    </div>
                                    </div>
                                </div><button type="button" ><Link href="/signup">Add User</Link></button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
        </>
    )
}

export default Users
