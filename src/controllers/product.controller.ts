import { type Request, type Response } from 'express';
import BaseController from '@/controllers/base.controller';
import ProductService from '@/services/product.service';

export class ProductController extends BaseController {
  private readonly productService: ProductService;

  constructor() {
    super();
    this.productService = new ProductService();
  }

  getAllProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const { category, store_id, search, min_price, max_price, brand, limit = '10', offset = '0' } = req.query;

      const limitNumber = parseInt(limit as string);
      const offsetNumber = parseInt(offset as string);

      let products;

      if (store_id) {
        products = await this.productService.getProductsByStoreId(store_id as string);
      } else if (category) {
        products = await this.productService.getProductsByCategory(category as string);
      } else {
        products = await this.productService.getAllProducts();
      }

      if (search) {
        const searchTerm = (search as string).toLowerCase();
        products = products.filter(
          (product) =>
            product.name.toLowerCase().includes(searchTerm) || product.description.toLowerCase().includes(searchTerm)
        );
      }

      if (brand) {
        products = products.filter((product) => product.brand.toLowerCase() === (brand as string).toLowerCase());
      }

      if (min_price) {
        const minPrice = parseFloat(min_price as string);
        products = products.filter((product) => product.price >= minPrice);
      }

      if (max_price) {
        const maxPrice = parseFloat(max_price as string);
        products = products.filter((product) => product.price <= maxPrice);
      }

      const totalCount = products.length;
      const paginatedProducts = products.slice(offsetNumber, offsetNumber + limitNumber);

      res.status(200).json({
        success: true,
        data: paginatedProducts,
        count: totalCount,
        limit: limitNumber,
        offset: offsetNumber,
        hasMore: offsetNumber + limitNumber < totalCount,
      });
    } catch (error) {
      this.handleError(res);
    }
  };

  getProductById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const product = await this.productService.getProductById(id!);

      if (!product) {
        res.status(404).json({
          success: false,
          message: 'Product not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error) {
      this.handleError(res);
    }
  };

  getProductsByStore = async (req: Request, res: Response): Promise<void> => {
    try {
      const { storeId } = req.params;

      const products = await this.productService.getProductsByStoreId(storeId!);

      res.status(200).json({
        success: true,
        data: products,
        count: products.length,
        store_id: storeId,
      });
    } catch (error) {
      this.handleError(res);
    }
  };
}

export default new ProductController();
