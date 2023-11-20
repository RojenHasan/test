import express, {Request, Response} from 'express';
import userService from '../service/user.service';
import { UserInput } from '../types/types';

/**
 * @swagger
 *  components:
 *      schemas:
 *          User:
 *            type: object
 *            properties:
 *              id:
 *                   type: number
 *                   format: int64
 *              email:
 *                   type: string
 *                   description: user email
 *              password:
 *                  type: string
 *                  description: users password
 * 
 *          UserInput:
 *            type: object
 *            properties:
 *              email:
 *                    type: string
 *                    description: user email
 *                    example: test@test.be
 *              password:
 *                    type: string
 *                    description: users password
 *                    example: t
 */

const userRouter = express.Router();

/**
 * @swagger
 * /users/:
 *  get:
 *      summary: Get all user
 *      responses:
 *          200:
 *              description: Returns all Users.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 */

userRouter.get('/',async (req:Request, res: Response) => {
    try{
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error){
        res.status(500).json({status: 'error', errorMessage: error.message});
    }
})



/**
* @swagger
* /users/signup:
*   post:
*     summary: Add an account
*     requestBody: 
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/UserInput'
*     responses:
*       200:
*         description: The new user
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/User'
*       404:
*         description: Error
*/

userRouter.post("/signup", async(req:Request, res:Response) => {
    try {
        const userInput = <UserInput>req.body;
        if(!userInput.email || !userInput.password){
            throw new Error ("Please provide email and password")
        }
        const user = await userService.createUser(userInput)
        res.status(200).json(user) 
    } catch (error) {
        res.status(500).json({status: "error" , errorMessage: error.message}) 
    }
})

/**
* @swagger
* /users/login:
*   post:
*     summary: Login
*     requestBody: 
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/UserInput'
*     responses:
*       200:
*         description: The new user
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/User'
*       404:
*         description: Error
*/


userRouter.post("/login", async(req:Request, res:Response) =>{
    try {
        const userInput = <UserInput>req.body
        const token = await userService.authenticate(userInput)
        res.status(200).json({message: "Authintication succesful", token})
    } catch (error) {
        res.status(401).json({status: "Unauthorized", errorMessage: error.message})
    }
})
export {userRouter}