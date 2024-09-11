import { Router } from 'express';
import { login, signup } from '../controllers/auth';

const authRouter = Router();

// Signup User Route
authRouter.post('/signup', signup)

// Login User Route
authRouter.post('/login', login)

export default authRouter;