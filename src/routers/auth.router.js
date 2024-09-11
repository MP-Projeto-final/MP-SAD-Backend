import express from 'express';
import { signUp, signIn } from '../controllers/auth.controller.js';
import { signInSchema, signUpSchema } from '../schemas/auth.schema.js';
import { schemaValidation } from '../middlewares/schema.validation.js';

const authRouter = express.Router();

/**
 * Route for user sign-up.
 * 
 * This route handles POST requests to '/sign-up'. It validates the request body against the `signUpSchema` using the `schemaValidation` middleware
 * before calling the `signUp` controller function to handle user registration.
 */
authRouter.post('/sign-up', schemaValidation(signUpSchema), signUp);

/**
 * Route for user login.
 * 
 * This route handles POST requests to '/login'. It validates the request body against the `signInSchema` using the `schemaValidation` middleware
 * before calling the `signIn` controller function to handle user authentication.
 */
authRouter.post('/login', schemaValidation(signInSchema), signIn);

export default authRouter;
