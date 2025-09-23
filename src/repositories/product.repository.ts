import type { IProduct } from '@/entities';
import type { GetProductsQueryDTO } from '@/dto/product.dto';

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

  updateProductStock(productId: string, newStock: number): boolean {
    const productIndex = this.products.findIndex((product) => product.id === productId);
    if (productIndex === -1) {
      return false;
    }

    this.products[productIndex]!.stock = newStock;
    return true;
  }

  reduceProductStock(productId: string, quantity: number): boolean {
    const product = this.products.find((product) => product.id === productId);
    if (!product || product.stock < quantity) {
      return false;
    }

    product.stock -= quantity;
    return true;
  }

  checkStockAvailability(productId: string, quantity: number): boolean {
    const product = this.products.find((product) => product.id === productId);
    return product ? product.stock >= quantity : false;
  }

  getFilteredProducts(filters: GetProductsQueryDTO): { products: IProduct[]; totalCount: number } {
    let products = [...this.products];

    if (filters.store_id) {
      products = products.filter((product) => product.store_id === filters.store_id);
    }

    if (filters.category) {
      products = products.filter((product) => product.category.toLowerCase() === filters.category!.toLowerCase());
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      products = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm) || product.description.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.brand) {
      products = products.filter((product) => product.brand.toLowerCase() === filters.brand!.toLowerCase());
    }

    if (filters.min_price) {
      const minPrice = parseFloat(filters.min_price);
      products = products.filter((product) => product.price >= minPrice);
    }

    if (filters.max_price) {
      const maxPrice = parseFloat(filters.max_price);
      products = products.filter((product) => product.price <= maxPrice);
    }

    const totalCount = products.length;

    if (filters.limit || filters.offset) {
      const limitNumber = filters.limit ? parseInt(filters.limit) : 10;
      const offsetNumber = filters.offset ? parseInt(filters.offset) : 0;
      products = products.slice(offsetNumber, offsetNumber + limitNumber);
    }

    return { products, totalCount };
  }
}
