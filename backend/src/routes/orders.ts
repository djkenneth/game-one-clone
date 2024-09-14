import { Router } from 'express';

import { cancelOrder, changeStatus, createOrder, getOrderById, listAllOrders, listOrder, listUserOrders } from '../controllers/orders';
import { errorHandler } from '../error-handler';
import authMiddleware from '../middlewares/auth';
import adminMiddleware from '../middlewares/admin';

const orderRouter: Router = Router();

// List Order
orderRouter.get('/', [authMiddleware], errorHandler(listOrder))
// Create Order
orderRouter.post('/', [authMiddleware], errorHandler(createOrder));
// Cancel Order
orderRouter.put('/:id/cancel', [authMiddleware], errorHandler(cancelOrder));
// List Orders
orderRouter.get('/index', [authMiddleware, adminMiddleware], errorHandler(listAllOrders));
// List User Orders
orderRouter.get('/users/:id', [authMiddleware, adminMiddleware], errorHandler(listUserOrders))
// Change Status
orderRouter.put('/:id/status', [authMiddleware, adminMiddleware], errorHandler(changeStatus))
// Get Order By ID
orderRouter.get('/:id', [authMiddleware], errorHandler(getOrderById));
export default orderRouter;