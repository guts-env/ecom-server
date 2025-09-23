import request from 'supertest';
import express from 'express';
import { ProductController } from '@/controllers/product.controller';
import ProductService from '@/services/product.service';
import type { IProduct } from '@/entities';

jest.mock('@/services/product.service');

describe('ProductController', () => {
  let app: express.Application;
  let productController: ProductController;
  let mockServiceInstance: jest.Mocked<ProductService>;
  let mockProducts: IProduct[];

  beforeEach(() => {
    jest.clearAllMocks();

    mockProducts = [
      {
        id: '1',
        name: 'iPhone 15 Pro',
        description: 'Latest iPhone with A17 Pro chip',
        price: 999,
        store_id: '1',
        category: 'Smartphones',
        brand: 'Apple',
        stock: 50,
        created_at: '2024-01-01T00:00:00.000Z',
      },
      {
        id: '2',
        name: 'Samsung Galaxy S24',
        description: 'Flagship Samsung smartphone',
        price: 899,
        store_id: '2',
        category: 'Smartphones',
        brand: 'Samsung',
        stock: 30,
        created_at: '2024-01-02T00:00:00.000Z',
      },
      {
        id: '3',
        name: 'MacBook Pro 16"',
        description: 'Professional laptop with M3 chip',
        price: 2499,
        store_id: '1',
        category: 'Laptops',
        brand: 'Apple',
        stock: 20,
        created_at: '2024-01-03T00:00:00.000Z',
      },
    ] as unknown as IProduct[];

    mockServiceInstance = {
      getAllProducts: jest.fn(),
      getProductById: jest.fn(),
      getProductsByStoreId: jest.fn(),
      getProductsByCategory: jest.fn(),
      getFilteredProducts: jest.fn(),
      initializeProducts: jest.fn(),
      clearCache: jest.fn(),
      validateStock: jest.fn(),
      reduceStock: jest.fn(),
      updateStock: jest.fn(),
    } as unknown as jest.Mocked<ProductService>;

    (ProductService.getInstance as jest.Mock).mockReturnValue(mockServiceInstance);

    productController = new ProductController();

    app = express();
    app.use(express.json());
    app.get('/products', productController.getAllProducts);
    app.get('/products/:id', productController.getProductById);
    app.get('/products/store/:storeId', productController.getProductsByStore);
  });

  describe('GET /products', () => {
    it('should return all products with pagination', async () => {
      mockServiceInstance.getFilteredProducts.mockResolvedValue({
        products: mockProducts,
        totalCount: 3,
        limit: 10,
        offset: 0,
        hasMore: false,
      });

      const response = await request(app).get('/products').expect(200);

      expect(response.body).toEqual({
        success: true,
        data: mockProducts,
        count: 3,
        limit: 10,
        offset: 0,
        hasMore: false,
      });
      expect(mockServiceInstance.getFilteredProducts).toHaveBeenCalled();
    });

    it('should filter products by store_id', async () => {
      const storeProducts = mockProducts.filter((p) => p.store_id === '1');
      mockServiceInstance.getFilteredProducts.mockResolvedValue({
        products: storeProducts,
        totalCount: 2,
        limit: 10,
        offset: 0,
        hasMore: false,
      });

      const response = await request(app).get('/products?store_id=1').expect(200);

      expect(response.body.data).toEqual(storeProducts);
      expect(response.body.count).toBe(2);
      expect(mockServiceInstance.getFilteredProducts).toHaveBeenCalledWith({ store_id: '1' });
    });

    it('should filter products by category', async () => {
      const categoryProducts = mockProducts.filter((p) => p.category === 'Smartphones');
      mockServiceInstance.getFilteredProducts.mockResolvedValue({
        products: categoryProducts,
        totalCount: 2,
        limit: 10,
        offset: 0,
        hasMore: false,
      });

      const response = await request(app).get('/products?category=Smartphones').expect(200);

      expect(response.body.data).toEqual(categoryProducts);
      expect(response.body.count).toBe(2);
      expect(mockServiceInstance.getFilteredProducts).toHaveBeenCalledWith({ category: 'Smartphones' });
    });

    it('should filter products by search term', async () => {
      const searchResults = mockProducts.filter((p) => p.name.includes('iPhone'));
      mockServiceInstance.getFilteredProducts.mockResolvedValue({
        products: searchResults,
        totalCount: 1,
        limit: 10,
        offset: 0,
        hasMore: false,
      });

      const response = await request(app).get('/products?search=iPhone').expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].name).toContain('iPhone');
    });

    it('should filter products by brand', async () => {
      const brandProducts = mockProducts.filter((p) => p.brand === 'Apple');
      mockServiceInstance.getFilteredProducts.mockResolvedValue({
        products: brandProducts,
        totalCount: 2,
        limit: 10,
        offset: 0,
        hasMore: false,
      });

      const response = await request(app).get('/products?brand=Apple').expect(200);

      expect(response.body.data).toHaveLength(2);
      expect(response.body.data.every((p: IProduct) => p.brand === 'Apple')).toBe(true);
    });

    it('should filter products by price range', async () => {
      const priceRangeProducts = mockProducts.filter((p) => p.price >= 900 && p.price <= 1000);
      mockServiceInstance.getFilteredProducts.mockResolvedValue({
        products: priceRangeProducts,
        totalCount: 1,
        limit: 10,
        offset: 0,
        hasMore: false,
      });

      const response = await request(app).get('/products?min_price=900&max_price=1000').expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data.every((p: IProduct) => p.price >= 900 && p.price <= 1000)).toBe(true);
    });

    it('should handle pagination with limit and offset', async () => {
      const paginatedProducts = mockProducts.slice(1, 3);
      mockServiceInstance.getFilteredProducts.mockResolvedValue({
        products: paginatedProducts,
        totalCount: 3,
        limit: 2,
        offset: 1,
        hasMore: false,
      });

      const response = await request(app).get('/products?limit=2&offset=1').expect(200);

      expect(response.body.data).toHaveLength(2);
      expect(response.body.limit).toBe(2);
      expect(response.body.offset).toBe(1);
      expect(response.body.hasMore).toBe(false);
    });

    it('should return hasMore true when there are more products', async () => {
      const paginatedProducts = mockProducts.slice(0, 2);
      mockServiceInstance.getFilteredProducts.mockResolvedValue({
        products: paginatedProducts,
        totalCount: 3,
        limit: 2,
        offset: 0,
        hasMore: true,
      });

      const response = await request(app).get('/products?limit=2&offset=0').expect(200);

      expect(response.body.hasMore).toBe(true);
    });

    it('should handle service error', async () => {
      mockServiceInstance.getFilteredProducts.mockRejectedValue(new Error('Service error'));

      await request(app).get('/products').expect(500);
    });
  });

  describe('GET /products/:id', () => {
    it('should return product when found', async () => {
      const expectedProduct = mockProducts[0];
      mockServiceInstance.getProductById.mockResolvedValue(expectedProduct as IProduct);

      const response = await request(app).get('/products/1').expect(200);

      expect(response.body).toEqual({
        success: true,
        data: expectedProduct,
      });
      expect(mockServiceInstance.getProductById).toHaveBeenCalledWith('1');
    });

    it('should return 404 when product not found', async () => {
      mockServiceInstance.getProductById.mockResolvedValue(null);

      const response = await request(app).get('/products/999').expect(404);

      expect(response.body).toEqual({
        success: false,
        message: 'Product not found',
      });
    });

    it('should handle service error', async () => {
      mockServiceInstance.getProductById.mockRejectedValue(new Error('Service error'));

      await request(app).get('/products/1').expect(500);
    });
  });

  describe('GET /products/store/:storeId', () => {
    it('should return products for store', async () => {
      const storeProducts = mockProducts.filter((p) => p.store_id === '1');
      mockServiceInstance.getProductsByStoreId.mockResolvedValue(storeProducts);

      const response = await request(app).get('/products/store/1').expect(200);

      expect(response.body).toEqual({
        success: true,
        data: storeProducts,
        count: storeProducts.length,
        store_id: '1',
      });
      expect(mockServiceInstance.getProductsByStoreId).toHaveBeenCalledWith('1');
    });

    it('should return empty array for store with no products', async () => {
      mockServiceInstance.getProductsByStoreId.mockResolvedValue([]);

      const response = await request(app).get('/products/store/999').expect(200);

      expect(response.body.data).toEqual([]);
      expect(response.body.count).toBe(0);
    });

    it('should handle service error', async () => {
      mockServiceInstance.getProductsByStoreId.mockRejectedValue(new Error('Service error'));

      await request(app).get('/products/store/1').expect(500);
    });
  });
});
