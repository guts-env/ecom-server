import type { IProduct } from '@/entities';

export default class ProductRepository {
  private products: IProduct[] = [];

  setProducts(products: IProduct[]): void {
    this.products = products;
  }

  getAllProducts(): IProduct[] {
    return this.products;
  }

  getProductById(id: string): IProduct | null {
    return this.products.find((product) => product.id === id) || null;
  }

  getProductsByStoreId(storeId: string): IProduct[] {
    return this.products.filter((product) => product.store_id === storeId);
  }

  getProductsByCategory(category: string): IProduct[] {
    return this.products.filter((product) => product.category.toLowerCase() === category.toLowerCase());
  }

  getProductsByBrand(brand: string): IProduct[] {
    return this.products.filter((product) => product.brand.toLowerCase() === brand.toLowerCase());
  }
}
