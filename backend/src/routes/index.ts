import { Router } from 'express';
import authRouter from './auth';
import productRouter from './products';
import userRouter from './users';
import cartRouter from './cart';
import orderRouter from './orders';

const rootRouter = Router();

rootRouter.use('/auth', authRouter)
rootRouter.use('/users', userRouter)
rootRouter.use('/products', productRouter)
rootRouter.use('/cart', cartRouter)
rootRouter.use('/orders', orderRouter)

export default rootRouter;

/*
    1. user management
        a. list users
        b. get user by id
        c. change user role
    2. order management
        a. list all orders (filter on status)
        b. change order status
        c. list all orders of given user
    3. products
        a. search api for products (for both users and admins) -> full tedt search
*/