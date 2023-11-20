import { User as UserPrisma } from '@prisma/client';

export class User {
    readonly id: number;
    readonly email: string;
    readonly password: string;

    constructor(user: {
        id?: number;
        email: string;
        password: string;
    }) {
        this.id = user.id;
        this.email = user.email;
        this.password = user.password;
    }

    /*equals({ id, username, email, password }): boolean {
        return (
            this.id === id &&
            this.username === username &&
            this.email === email &&
            this.password === password
        );
    }*/
    static create
    (id:number, email:string, password:string){
        return new User( {
            id,
            email,
            password
        })
    }

    static from({ id, email, password }: UserPrisma) {
        console.log("UserPrisma:", { id, email, password });
        
        return new User({
            id,
            email,
            password,
        });
    }
    
}