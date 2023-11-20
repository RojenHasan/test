import { User } from "./user";
import {Patient as PatientPrisma} from '@prisma/client';
import  {User as UserPrisma} from  '@prisma/client';

export class Patient {
    readonly id?: number;
    //Hebben we hier naam variable nodig? Naam zit in User
    readonly name: string;
    readonly user: User;
    readonly medical_History: string;
    readonly street: string;
    readonly postcode: number;
    readonly housenr: number;
    readonly stad: string;

    constructor (patient : 
        {id:number, user: User, name:string,  medical_History:string,
    street: string, postcode: number, housenr: number, stad: string}){
        this.id  =  patient.id;
        this.name = patient.name;
        this.medical_History = patient.medical_History;
        this.stad = patient.stad;
        this.housenr = patient.housenr;
        this.postcode = patient.postcode;
        this.street = patient.street;
        this.user = patient.user;
    }

    static create(id:number,user: User, name:string, medical_History:string,street: string, postcode: number, housenr: number, stad: string){
        return new Patient( {id:id,user: user, name:name, medical_History:medical_History,
        stad:stad ,housenr: housenr, postcode: postcode, street: street})
    }
    static from({
      id,
      name,
      medical_History,
      street,
      postcode,
      housenr,
      stad,
      user 
  }: PatientPrisma & {
      user: UserPrisma 
  }) {
      return new Patient({
          id,
          name,
          medical_History,
          street,
          postcode,
          housenr,
          stad,
          user: User.from(user)
      });
  }
  
}