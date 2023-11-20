import medicalTestDb from '../domain/data-access/medicalTest.db';
import { MedicalTest } from '../domain/model/medicalTest';
import { MedicalTestInput } from '../types/types';

const getAllMedicalTests = async (): Promise<MedicalTest[]> => {
  return medicalTestDb.getAllMedicalTests();
};

const getMedicalTestById = async (id: number): Promise<MedicalTest> => {
    if (Number.isNaN(Number(id))) {
        throw new Error('Id is invalid');
    }
    const medicalTest = await medicalTestDb.getMedicalTestById(id);
    if (!medicalTest) {
        throw new Error(`No medical record found with ID ${id}`);
    }

    return medicalTest;
};

const addMedicalTest = async (medicalTestInput: MedicalTestInput): Promise<MedicalTest> => {
  
  const medicalTestPrisma = {
    cost: medicalTestInput.cost,
    description: medicalTestInput.description,
    doctor: medicalTestInput.doctor,
    patient: medicalTestInput.patient,
    name: medicalTestInput.name,
};


  const newMedicalTest = await medicalTestDb.addMedicalTest(medicalTestPrisma);
  return newMedicalTest;

};

export default {
  getAllMedicalTests,
  getMedicalTestById,
  addMedicalTest,
};
