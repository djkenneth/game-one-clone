import { Router, Request, Response } from 'express';

import { createProduct, deleteProduct, getAllProduct, getOneProduct, updateProduct } from '../controllers/products';

const productRouter = Router();

// Fetch All Products Route
productRouter.post('/', getAllProduct)
// Get Single Product Route
productRouter.get('/:id', getOneProduct)
// Create Product Route
productRouter.post('/', createProduct);
// Update Product Route
productRouter.put('/:id', updateProduct);
// Delete Product Route
productRouter.delete('/:id', deleteProduct);

export default productRouter;