import { Router, Request, Response } from 'express';

import { createProduct, deleteProduct, getAllProduct, getProductById, updateProduct } from '../controllers/products';
import { errorHandler } from '../error-handler';
import authMiddleware from '../middlewares/auth';
import adminMiddleware from '../middlewares/admin';

const productRouter = Router();

// Fetch All Products Route
productRouter.get('/', errorHandler(getAllProduct))
// Get Single Product Route
productRouter.get('/:id', errorHandler(getProductById))
// Create Product Route
productRouter.post('/', [authMiddleware, adminMiddleware], errorHandler(createProduct));
// Update Product Route
productRouter.put('/:id', [authMiddleware, adminMiddleware], errorHandler(updateProduct));
// Delete Product Route
productRouter.delete('/:id', [authMiddleware, adminMiddleware], errorHandler(deleteProduct));

export default productRouter;