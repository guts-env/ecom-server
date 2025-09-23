import { Router } from 'express';
import orderController from '@/controllers/order.controller';
import { defaultLimiter } from '@/middleware/rateLimiter.middleware';
import { validate, validateParams } from '@/middleware/validation.middleware';
import { CreateOrderSchema, GetOrdersByUserParamsSchema } from '@/dto/order.dto';

const orderRoutes = Router();

orderRoutes.post('/', defaultLimiter, validate(CreateOrderSchema), orderController.createOrder);
orderRoutes.get(
  '/user/:userId',
  defaultLimiter,
  validateParams(GetOrdersByUserParamsSchema),
  orderController.getOrdersByUserId
);

export default orderRoutes;
