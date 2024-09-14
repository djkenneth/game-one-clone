import { Router, Request, Response } from 'express';

import { createProduct, deleteProduct, getAllProduct, getProductById, searchProducts, updateProduct } from '../controllers/products';
import { errorHandler } from '../error-handler';
import authMiddleware from '../middlewares/auth';
import adminMiddleware from '../middlewares/admin';

const productRouter = Router();

// Fetch All Products Route
productRouter.get('/', errorHandler(getAllProduct));
// Create Product Route
productRouter.post('/', [authMiddleware, adminMiddleware], errorHandler(createProduct));
// Update Product Route
productRouter.put('/:id', [authMiddleware, adminMiddleware], errorHandler(updateProduct));
// Delete Product Route
productRouter.delete('/:id', [authMiddleware, adminMiddleware], errorHandler(deleteProduct));
// Search Product
productRouter.get('/search', errorHandler(searchProducts));
// Get Single Product Route
productRouter.get('/:id', errorHandler(getProductById));

export default productRouter;