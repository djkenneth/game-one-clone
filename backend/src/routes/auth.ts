import { Router } from 'express';
import { login, signup } from '../controllers/auth';
import { errorHandler } from '../error-handler';

const authRouter = Router();

// Signup User Route
authRouter.post('/signup', errorHandler(signup))

// Login User Route
authRouter.post('/login', errorHandler(login))

export default authRouter;