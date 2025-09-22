import { z } from 'zod';

const OrderItemSchema = z.object({
  product_id: z.string('Invalid product ID').min(1, 'Product ID is required'),
  quantity: z.number('Invalid quantity').min(1, 'Quantity must be at least 1'),
  price: z.number('Invalid price').min(0, 'Price must be non-negative'),
});

const ShippingAddressSchema = z.object({
  street: z.string('Invalid street').min(1, 'Street is required'),
  city: z.string('Invalid city').min(1, 'City is required'),
  zip_code: z.string('Invalid ZIP code').min(1, 'ZIP code is required'),
  country: z.string('Invalid country').min(1, 'Country is required'),
});

export const CreateOrderSchema = z.object({
  user_id: z.string('Invalid user ID').min(1, 'User ID is required'),
  items: z.array(OrderItemSchema).min(1, 'At least one item is required'),
});

export const GetOrderByIdParamsSchema = z.object({
  id: z.string().min(1, 'Order ID is required'),
});

export const GetOrdersByUserParamsSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
});

export type CreateOrderDTO = z.infer<typeof CreateOrderSchema>;
export type GetOrderByIdParamsDTO = z.infer<typeof GetOrderByIdParamsSchema>;
export type GetOrdersByUserParamsDTO = z.infer<typeof GetOrdersByUserParamsSchema>;
