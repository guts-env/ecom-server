import { Router } from 'express';
import productController from '@/controllers/product.controller';
import { defaultLimiter } from '@/middleware/rateLimiter.middleware';
import { validateQuery, validateParams } from '@/middleware/validation.middleware';
import { GetProductsQuerySchema, GetProductByIdParamsSchema, GetProductsByStoreParamsSchema } from '@/dto/product.dto';

const productRoutes = Router();

productRoutes.get('/', defaultLimiter, validateQuery(GetProductsQuerySchema), productController.getAllProducts);
productRoutes.get('/:id', defaultLimiter, validateParams(GetProductByIdParamsSchema), productController.getProductById);
productRoutes.get(
  '/store/:storeId',
  defaultLimiter,
  validateParams(GetProductsByStoreParamsSchema),
  productController.getProductsByStore
);

export default productRoutes;
