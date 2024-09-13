import { Router } from 'express';
import { errorHandler } from '../error-handler';
import { changeUserRole, createAddress, createProfile, deleteAddress, getProfile, getUserById, listAddress, listUsers, updateProfile, updateUser } from '../controllers/users';
import authMiddleware from '../middlewares/auth';
import adminMiddleware from '../middlewares/admin';

const userRouter = Router();
userRouter.post('/address', [authMiddleware], errorHandler(createAddress));
userRouter.delete('/address/:id', [authMiddleware], errorHandler(deleteAddress));
userRouter.get('/address', [authMiddleware], errorHandler(listAddress));

userRouter.put('/', [authMiddleware], errorHandler(updateUser))
userRouter.put('/:id/role', [authMiddleware, adminMiddleware], errorHandler(changeUserRole))
userRouter.get('/', [authMiddleware, adminMiddleware], errorHandler(listUsers))
userRouter.get('/:id', [authMiddleware, adminMiddleware], errorHandler(getUserById))

userRouter.post('/profile', [authMiddleware], errorHandler(createProfile));
userRouter.get('/profile', [authMiddleware], errorHandler(getProfile));
userRouter.put('/address/:id', [authMiddleware], errorHandler(updateProfile));

export default userRouter;