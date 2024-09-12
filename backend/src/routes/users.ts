import { Router } from 'express';
import { errorHandler } from '../error-handler';
import { createAddress, createProfile, deleteAddress, getProfile, listAddress, updateProfile } from '../controllers/users';
import authMiddleware from '../middlewares/auth';

const userRouter = Router();
userRouter.post('/address', [authMiddleware], errorHandler(createAddress));
userRouter.delete('/address/:id', [authMiddleware], errorHandler(deleteAddress));
userRouter.get('/address', [authMiddleware], errorHandler(listAddress));

userRouter.post('/profile', [authMiddleware], errorHandler(createProfile));
userRouter.get('/profile', [authMiddleware], errorHandler(getProfile));
userRouter.put('/address/:id', [authMiddleware], errorHandler(updateProfile));

export default userRouter;