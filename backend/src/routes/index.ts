// src/routes/index.ts

import { Router } from 'express';
import authRouter from './auth';
import cartRouter from './cart';
import orderRouter from './orders';
import productRouter from './products';
import userRouter from './users';

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