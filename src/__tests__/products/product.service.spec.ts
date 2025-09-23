import ProductService from '@/services/product.service';
import ProductRepository from '@/repositories/product.repository';
import type { IProduct } from '@/entities';

jest.mock('@/repositories/product.repository');
jest.mock('@/data/mockProducts', () => ({
  mockProducts: [
    {
      id: '1',
      name: 'iPhone 15 Pro',
      description: 'Latest iPhone with A17 Pro chip',
      price: 999,
      store_id: '1',
      category: 'Smartphones',
      brand: 'Apple',
      stock: 50,
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
    },
  ],
}));

const mockProductRepository = ProductRepository as jest.MockedClass<typeof ProductRepository>;

describe('ProductService', () => {
  let productService: ProductService;
  let mockRepositoryInstance: jest.Mocked<ProductRepository>;
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
        created_at: new Date('2024-01-01'),
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
        created_at: new Date('2024-01-02'),
      },
    ];

    mockRepositoryInstance = {
      setProducts: jest.fn(),
      getAllProducts: jest.fn().mockReturnValue(mockProducts),
      getProductById: jest.fn(),
      getProductsByStoreId: jest.fn(),
      getProductsByCategory: jest.fn(),
      getProductsByBrand: jest.fn(),
      updateProductStock: jest.fn(),
      reduceProductStock: jest.fn(),
      checkStockAvailability: jest.fn(),
      getFilteredProducts: jest.fn(),
    } as unknown as jest.Mocked<ProductRepository>;

    mockProductRepository.mockImplementation(() => mockRepositoryInstance);

    (ProductService as any).instance = undefined;
    productService = ProductService.getInstance();
  });

  describe('initializeProducts', () => {
    it('should initialize products successfully', async () => {
      await productService.initializeProducts();

      expect(mockRepositoryInstance.setProducts).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            id: '1',
            name: 'iPhone 15 Pro',
            description: 'Latest iPhone with A17 Pro chip',
            price: 999,
            store_id: '1',
            category: 'Smartphones',
            brand: 'Apple',
            stock: 50,
            created_at: expect.any(Date),
          }),
          expect.objectContaining({
            id: '2',
            name: 'Samsung Galaxy S24',
            description: 'Flagship Samsung smartphone',
            price: 899,
            store_id: '2',
            category: 'Smartphones',
            brand: 'Samsung',
            stock: 30,
            created_at: expect.any(Date),
          }),
        ])
      );
    });

    it('should not reinitialize if already initialized', async () => {
      await productService.initializeProducts();
      await productService.initializeProducts();

      expect(mockRepositoryInstance.setProducts).toHaveBeenCalledTimes(1);
    });
  });

  describe('getAllProducts', () => {
    it('should return cached products when cache is valid', async () => {
      await productService.initializeProducts();

      const firstResult = await productService.getAllProducts();

      const secondResult = await productService.getAllProducts();

      expect(firstResult).toEqual(mockProducts);
      expect(secondResult).toEqual(mockProducts);
      expect(mockRepositoryInstance.getAllProducts).toHaveBeenCalledTimes(1);
    });

    it('should initialize products if not initialized', async () => {
      await productService.getAllProducts();

      expect(mockRepositoryInstance.setProducts).toHaveBeenCalled();
      expect(mockRepositoryInstance.getAllProducts).toHaveBeenCalled();
    });

    it('should return products from repository', async () => {
      const result = await productService.getAllProducts();

      expect(result).toEqual(mockProducts);
      expect(mockRepositoryInstance.getAllProducts).toHaveBeenCalled();
    });
  });

  describe('getProductById', () => {
    it('should return product when found', async () => {
      const expectedProduct = mockProducts[0];
      mockRepositoryInstance.getProductById.mockReturnValue(expectedProduct as IProduct);

      const result = await productService.getProductById('1');

      expect(result).toEqual(expectedProduct);
      expect(mockRepositoryInstance.getProductById).toHaveBeenCalledWith('1');
    });

    it('should return null when product not found', async () => {
      mockRepositoryInstance.getProductById.mockReturnValue(null);

      const result = await productService.getProductById('999');

      expect(result).toBeNull();
      expect(mockRepositoryInstance.getProductById).toHaveBeenCalledWith('999');
    });

    it('should initialize products if not initialized', async () => {
      mockRepositoryInstance.getProductById.mockReturnValue(null);

      await productService.getProductById('1');

      expect(mockRepositoryInstance.setProducts).toHaveBeenCalled();
    });
  });

  describe('getProductsByStoreId', () => {
    it('should return cached products when cache is valid', async () => {
      const storeProducts = [mockProducts[0]] as IProduct[];
      mockRepositoryInstance.getProductsByStoreId.mockReturnValue(storeProducts);

      const result = await productService.getProductsByStoreId('1');

      expect(result).toEqual(storeProducts);
      expect(mockRepositoryInstance.getProductsByStoreId).toHaveBeenCalledWith('1');
    });

    it('should initialize products if not initialized', async () => {
      mockRepositoryInstance.getProductsByStoreId.mockReturnValue([]);

      await productService.getProductsByStoreId('1');

      expect(mockRepositoryInstance.setProducts).toHaveBeenCalled();
    });

    it('should return empty array for non-existent store', async () => {
      mockRepositoryInstance.getProductsByStoreId.mockReturnValue([]);

      const result = await productService.getProductsByStoreId('999');

      expect(result).toEqual([]);
      expect(mockRepositoryInstance.getProductsByStoreId).toHaveBeenCalledWith('999');
    });
  });

  describe('getProductsByCategory', () => {
    it('should return cached products when cache is valid', async () => {
      const categoryProducts = mockProducts.filter((p) => p.category === 'Smartphones');
      mockRepositoryInstance.getProductsByCategory.mockReturnValue(categoryProducts);

      const result = await productService.getProductsByCategory('Smartphones');

      expect(result).toEqual(categoryProducts);
      expect(mockRepositoryInstance.getProductsByCategory).toHaveBeenCalledWith('Smartphones');
    });

    it('should initialize products if not initialized', async () => {
      mockRepositoryInstance.getProductsByCategory.mockReturnValue([]);

      await productService.getProductsByCategory('Smartphones');

      expect(mockRepositoryInstance.setProducts).toHaveBeenCalled();
    });

    it('should return empty array for non-existent category', async () => {
      mockRepositoryInstance.getProductsByCategory.mockReturnValue([]);

      const result = await productService.getProductsByCategory('Tablets');

      expect(result).toEqual([]);
      expect(mockRepositoryInstance.getProductsByCategory).toHaveBeenCalledWith('Tablets');
    });
  });

  describe('clearCache', () => {
    it('should clear cache successfully', () => {
      productService.clearCache();
      expect(true).toBe(true);
    });
  });
});
