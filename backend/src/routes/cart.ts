import { Router } from 'express';

import { addItemToCart, changeQuantity, deleteItemFromCart, getCart } from '../controllers/cart';
import { errorHandler } from '../error-handler';
import authMiddleware from '../middlewares/auth';

const cartRouter = Router();

// Get Cart Route
cartRouter.get('/', [authMiddleware], errorHandler(getCart))
// Add Item to Cart Route
cartRouter.post('/', [authMiddleware], errorHandler(addItemToCart));
// Change Quantity Route
cartRouter.put('/:id', [authMiddleware], errorHandler(changeQuantity));
// Delete Item From Cart Route
cartRouter.delete('/:id', [authMiddleware], errorHandler(deleteItemFromCart));

export default cartRouter;