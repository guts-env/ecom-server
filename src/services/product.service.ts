import type { IProduct } from '@/entities';
import ProductRepository from '@/repositories/product.repository';
import { mockProducts } from '@/data/mockProducts';

export default class ProductService {
  private productRepository: ProductRepository;
  private initialized = false;
  private cache: Map<string, any> = new Map();
  private readonly cacheDuration = 15 * 60 * 1000;

  constructor() {
    this.productRepository = new ProductRepository();
  }

  async initializeProducts(): Promise<void> {
    if (this.initialized) return;

    const products: IProduct[] = mockProducts.map((product) => ({
      ...product,
      created_at: new Date(),
    }));

    this.productRepository.setProducts(products);
    this.initialized = true;
  }

  async getAllProducts(): Promise<IProduct[]> {
    const cacheKey = 'all_products';

    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey).data;
    }

    if (!this.initialized) {
      await this.initializeProducts();
    }

    const products = this.productRepository.getAllProducts();
    this.setCache(cacheKey, products);

    return products;
  }

  async getProductById(id: string): Promise<IProduct | null> {
    if (!this.initialized) {
      await this.initializeProducts();
    }

    return this.productRepository.getProductById(id);
  }

  async getProductsByStoreId(storeId: string): Promise<IProduct[]> {
    const cacheKey = `store_products_${storeId}`;

    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey).data;
    }

    if (!this.initialized) {
      await this.initializeProducts();
    }

    const products = this.productRepository.getProductsByStoreId(storeId);
    this.setCache(cacheKey, products);

    return products;
  }

  async getProductsByCategory(category: string): Promise<IProduct[]> {
    const cacheKey = `category_products_${category.toLowerCase()}`;

    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey).data;
    }

    if (!this.initialized) {
      await this.initializeProducts();
    }

    const products = this.productRepository.getProductsByCategory(category);
    this.setCache(cacheKey, products);

    return products;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  private isCacheValid(key: string): boolean {
    const cached = this.cache.get(key);
    if (!cached) return false;

    const isValid = Date.now() - cached.timestamp < this.cacheDuration;

    if (!isValid) {
      this.cache.delete(key);
    }

    return isValid;
  }

  clearCache(): void {
    this.cache.clear();
  }
}
