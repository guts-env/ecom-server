import { z } from 'zod';

const OrderItemSchema = z.object({
  product_id: z.string('Invalid product ID').min(1, 'Product ID is required'),
  quantity: z.number('Invalid quantity').min(1, 'Quantity must be at least 1'),
  price: z.number('Invalid price').min(0, 'Price must be non-negative'),
});

export const CreateOrderSchema = z.object({
  user_id: z.string('Invalid user ID').min(1, 'User ID is required'),
  items: z.array(OrderItemSchema).min(1, 'At least one item is required'),
});

export const GetOrdersByUserParamsSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
});

export type CreateOrderDTO = z.infer<typeof CreateOrderSchema>;
export type GetOrdersByUserParamsDTO = z.infer<typeof GetOrdersByUserParamsSchema>;
