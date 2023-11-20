import express, { Request, Response } from 'express';
import appointmentService from '../service/appointment.service';
import { AppointmentInput, MedicalTestInput } from '../types/types';



/**
 * @swagger
 * components:
 *   schemas:
 *     Appointment:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           format: int64
 *         date:
 *           type: string
 *           format: date-time
 *           description: Date of the appointment
 *         time:
 *           type: string
 *           format: time
 *           description: Time of the appointment
 *         doctor:
 *           type: object
 *           description: Doctor id
 *         patient:
 *           type: object
 *           description: Patient id
 *         medicalRecord:
 *           type: object
 *           description: Medical Record id
 *     AppointmentInput:
 *       type: object
 *       properties:
 *         date:
 *           type: string
 *           format: date-time
 *           description: Date of the appointment
 *         time:
 *           type: string
 *           format: time
 *           description: Time of the appointment
 *           example: "2023-11-12T00:03:59.187Z"
 *         doctor:
 *           type: object
 *           description: Doctor id
 *         patient:
 *           type: object
 *           description: Patient id
 *         medicalRecord:
 *           type: object
 *           description: Medical Record id
 *          
 */
export const appointmentRouter = express.Router();
/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Get all appointments
 *     responses:
 *       200:
 *         description: Returns all appointments.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 */
appointmentRouter.get('/', async (req: Request, res: Response) => {
  try {
    const appointments = await appointmentService.getAllAppointments();
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ status: 'error', errorMessage: error.message });
  }
});

/**
 * @swagger
 * /appointments/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get an appointment by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the appointment to retrieve
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Returns the appointment.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: Appointment not found
 */
appointmentRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id);
    const appointment = await appointmentService.getAppointmentById(id);
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ status: 'error', errorMessage: error.message });
  }
});

/**
 * @swagger
 * /appointments:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Add a new appointment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AppointmentInput'
 *     responses:
 *       200:
 *         description: Returns the new appointment.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Bad request
 */


appointmentRouter.post('/', async (req: Request, res: Response) => {
  try {
    const appointmentInput: AppointmentInput = req.body;
    
    const newAppointment = await appointmentService.addAppointment(appointmentInput);
    res.status(200).json(newAppointment);
  } catch (error) {
    res.status(400).json({ status: 'error', errorMessage: error.message });
  }
});

/**
 * @swagger
 * /appointments/addMedicalTests:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Add medical tests to an appointment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               appointment:
 *                 $ref: '#/components/schemas/AppointmentInput'
 *               medicalTests:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/MedicalTestInput'
 *     responses:
 *       200:
 *         description: Returns the updated appointment with added medical tests.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Bad request
 */
appointmentRouter.post('/addMedicalTests', async (req: Request, res: Response) => {
  try {
    const { appointment, medicalTests } = req.body;
    if (!appointment.id || medicalTests.length === 0) {
      throw new Error('Appointment ID and at least one medical test are required');
    }

    const updatedAppointment = await appointmentService.addMedicalTestsToAppointment({ appointment, medicalTests });
    res.status(200).json(updatedAppointment);
  } catch (error) {
    res.status(400).json({ status: 'error', errorMessage: error.message });
  }
});

