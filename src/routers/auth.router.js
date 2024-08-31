import express from 'express';
import { signUp, signIn } from '../controllers/auth.controller';
import { signInSchema, signUpSchema } from '../schemas/auth.schema';
import { schemaValidation } from '../middlewares/schema.validation';

const authRouter = express.Router();

authRouter.post('/sign-up', schemaValidation(signUpSchema), signUp);
authRouter.post('/sign-in', schemaValidation(signInSchema), signIn);

export default authRouter;