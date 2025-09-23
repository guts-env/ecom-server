import { type Request, type Response } from 'express';
import BaseController from '@/controllers/base.controller';
import ProductService from '@/services/product.service';

export class ProductController extends BaseController {
  private readonly productService: ProductService;

  constructor() {
    super();
    this.productService = ProductService.getInstance();
  }

  getAllProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const filters = req.query;
      const result = await this.productService.getFilteredProducts(filters);

      res.status(200).json({
        success: true,
        data: result.products,
        count: result.totalCount,
        limit: result.limit,
        offset: result.offset,
        hasMore: result.hasMore,
      });
    } catch (error) {
      this.handleError(res, error, 'Failed to get products');
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
      this.handleError(res, error, 'Failed to get product');
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
      this.handleError(res, error, 'Failed to get products by store');
    }
  };
}

export default new ProductController();
