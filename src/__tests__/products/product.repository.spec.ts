import ProductRepository from '@/repositories/product.repository';
import type { IProduct } from '@/entities';

describe('ProductRepository', () => {
  let productRepository: ProductRepository;
  let mockProducts: IProduct[];

  beforeEach(() => {
    productRepository = new ProductRepository();
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
      {
        id: '3',
        name: 'MacBook Pro 16"',
        description: 'Professional laptop with M3 chip',
        price: 2499,
        store_id: '1',
        category: 'Laptops',
        brand: 'Apple',
        stock: 20,
        created_at: new Date('2024-01-03'),
      },
    ];
  });

  describe('setProducts', () => {
    it('should set products successfully', () => {
      productRepository.setProducts(mockProducts);
      const allProducts = productRepository.getAllProducts();
      expect(allProducts).toEqual(mockProducts);
      expect(allProducts).toHaveLength(3);
    });

    it('should overwrite existing products', () => {
      productRepository.setProducts(mockProducts);
      const newProducts = [mockProducts[0]];
      productRepository.setProducts(newProducts);

      const allProducts = productRepository.getAllProducts();
      expect(allProducts).toEqual(newProducts);
      expect(allProducts).toHaveLength(1);
    });
  });

  describe('getAllProducts', () => {
    it('should return all products', () => {
      productRepository.setProducts(mockProducts);
      const result = productRepository.getAllProducts();

      expect(result).toEqual(mockProducts);
      expect(result).toHaveLength(3);
    });

    it('should return empty array when no products exist', () => {
      const result = productRepository.getAllProducts();
      expect(result).toEqual([]);
    });
  });

  describe('getProductById', () => {
    beforeEach(() => {
      productRepository.setProducts(mockProducts);
    });

    it('should return product when found', () => {
      const result = productRepository.getProductById('1');
      expect(result).toEqual(mockProducts[0]);
    });

    it('should return null when product not found', () => {
      const result = productRepository.getProductById('999');
      expect(result).toBeNull();
    });

    it('should return null for empty id', () => {
      const result = productRepository.getProductById('');
      expect(result).toBeNull();
    });
  });

  describe('getProductsByStoreId', () => {
    beforeEach(() => {
      productRepository.setProducts(mockProducts);
    });

    it('should return products for existing store', () => {
      const result = productRepository.getProductsByStoreId('1');
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(mockProducts[0]);
      expect(result[1]).toEqual(mockProducts[2]);
    });

    it('should return empty array for non-existent store', () => {
      const result = productRepository.getProductsByStoreId('999');
      expect(result).toEqual([]);
    });

    it('should return empty array for empty store id', () => {
      const result = productRepository.getProductsByStoreId('');
      expect(result).toEqual([]);
    });
  });

  describe('getProductsByCategory', () => {
    beforeEach(() => {
      productRepository.setProducts(mockProducts);
    });

    it('should return products for existing category', () => {
      const result = productRepository.getProductsByCategory('Smartphones');
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(mockProducts[0]);
      expect(result[1]).toEqual(mockProducts[1]);
    });

    it('should return products for category case-insensitive', () => {
      const result = productRepository.getProductsByCategory('smartphones');
      expect(result).toHaveLength(2);
    });

    it('should return empty array for non-existent category', () => {
      const result = productRepository.getProductsByCategory('Tablets');
      expect(result).toEqual([]);
    });

    it('should return empty array for empty category', () => {
      const result = productRepository.getProductsByCategory('');
      expect(result).toEqual([]);
    });
  });
});