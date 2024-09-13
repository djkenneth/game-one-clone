import { Router } from 'express';

import { cancelOrder, createOrder, getOrderById, listOrder } from '../controllers/orders';
import { errorHandler } from '../error-handler';
import authMiddleware from '../middlewares/auth';

const orderRouter: Router = Router();

// List Order Route
orderRouter.get('/', [authMiddleware], errorHandler(listOrder))
// Create Order Route
orderRouter.post('/', [authMiddleware], errorHandler(createOrder));
// Cancel Order Route
orderRouter.put('/:id/cancel', [authMiddleware], errorHandler(cancelOrder));
// Get Order By ID Route
orderRouter.get('/:id', [authMiddleware], errorHandler(getOrderById));

export default orderRouter;