import { z } from 'zod';

export const GetProductsQuerySchema = z
  .object({
    category: z.string().optional(),
    store_id: z.string().optional(),
    search: z.string().optional(),
    min_price: z
      .string()
      .regex(/^\d+\.?\d*$/, 'Min price must be a valid number')
      .optional(),
    max_price: z
      .string()
      .regex(/^\d+\.?\d*$/, 'Max price must be a valid number')
      .optional(),
    brand: z.string().optional(),
    limit: z.string().regex(/^\d+$/, 'Limit must be a positive number').optional(),
    offset: z.string().regex(/^\d+$/, 'Offset must be a non-negative number').optional(),
  })
  .refine(
    (data) => {
      if (data.min_price && data.max_price) {
        const minPrice = parseFloat(data.min_price);
        const maxPrice = parseFloat(data.max_price);
        return minPrice <= maxPrice;
      }
      return true;
    },
    {
      message: 'Min price must be less than or equal to max price',
      path: ['min_price'],
    }
  );

export const GetProductByIdParamsSchema = z.object({
  id: z.string().min(1, 'Product ID is required'),
});

export const GetProductsByStoreParamsSchema = z.object({
  storeId: z.string().min(1, 'Store ID is required'),
});

export type GetProductsQueryDTO = z.infer<typeof GetProductsQuerySchema>;
export type GetProductByIdParamsDTO = z.infer<typeof GetProductByIdParamsSchema>;
export type GetProductsByStoreParamsDTO = z.infer<typeof GetProductsByStoreParamsSchema>;
