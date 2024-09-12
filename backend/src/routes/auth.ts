import { Router } from 'express';
import { login, me, signup } from '../controllers/auth';
import { errorHandler } from '../error-handler';
import authMiddleware from '../middlewares/auth';

const authRouter = Router();

// Signup User Route
authRouter.post('/signup', errorHandler(signup))
// Login User Route
authRouter.post('/login', errorHandler(login))
// Profile Route
authRouter.get('/me', [authMiddleware], errorHandler(me))

export default authRouter;