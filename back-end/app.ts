import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { userRouter } from './controller/user.routes';
import { doctorRouter } from './controller/doctor.routes';
import { medicalRecordRouter } from './controller/medicalRecord.routes';
//import { medicalTestRouter } from './controller/medicalTest.routes';
import { expressjwt } from 'express-jwt';
import { patientRouter } from './controller/patient.routes';
import { appointmentRouter } from './controller/appointment.routes';
import { medicalTestRouter } from './controller/medicalTest.routes';

const app = express();
dotenv.config();
const port = process.env.APP_PORT || 3000;

const swaggerOpts : swaggerJSDoc.Options = {
  definition: {
      openapi: "3.0.0",
      info: {
          title: "Back-end",
          version: "1.0.0",
      },
      components: {
          securitySchemes: {
              bearerAuth: { 
                  type: "http",
                  scheme: "bearer",
                  bearerFormat: "JWT"
              },
          },
      },
      security: [
          {
              bearerAuth: []  
          }
      ]
  },
  apis: ["./controller/*.routes.ts"],
};
const swaggerSpec = swaggerJSDoc(swaggerOpts)
const jwtSecret = process.env.JWT_SECRET

app.use(
  expressjwt({secret: jwtSecret, algorithms: ['HS256']}).unless({ 
    path: [
      // public routes that don't require authentication
      /^\/api-docs\.*/,
      "/users/",
      "/users/login",
      "/users/signup",
      "/doctors",
      /^\/doctors\/\d+$/, // Exclude all "/doctors/:id" routes
      /^\/doctors\/\d+\/medical-tests$/,
      "/patients",
      /^\/patients\/\d+$/,
      "/medicalTests",
      /^\/medicalTests\/\d+$/,
      "/medicalRecords",
      /^\/medicalRecords\/\d+$/,
      "/appointments",
      /^\/appointments\/\d+$/,
    ]
  })
  
)
app.use(cors());
app.use(bodyParser.json());

app.use('/users', userRouter)
app.use('/patients', patientRouter)
app.use('/doctors', doctorRouter)
app.use('/medicalTests', medicalTestRouter)
app.use('/medicalRecords', medicalRecordRouter)
app.use('/appointments', appointmentRouter)
app.get('/status', (req, res) => {
    res.json({ message: 'Back-end is running...' });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.listen(port , () => {
    console.log(`Back-end is running on port ${port}.`);
});

app.use((error, req, res, next) =>{
  if(error.name === "UnauthorizedError"){
    res.status(401).json({status: "unauthorized", errorMessage:error.message})
  }else if(error.name === "Error"){
    res.status(400).json({status: "error", errorMessage:error.message})
  }else{
    next()
  }
});
