import { type Request, type Response } from 'express';
import { AuthError } from '@/errors';
import BaseController from '@/controllers/base.controller';
import StoreService from '@/services/store.service';

export class StoreController extends BaseController {
  private readonly storeService: StoreService;

  constructor() {
    super();
    this.storeService = new StoreService();
  }

  getAllStores = async (_: Request, res: Response): Promise<void> => {
    try {
      const response = await this.storeService.getAllStores();
      res.status(200).send(response);
    } catch (error) {
      if (error instanceof AuthError) {
        res.status(error.statusCode).send({
          success: false,
          message: error.message,
          code: error.code,
        });
      } else {
        this.handleError(res, error, 'Failed to get stores');
      }
    }
  };

  getStoreById = async (req: Request, res: Response): Promise<void> => {
    try {
      const response = await this.storeService.getStoreById(req.params.id!);
      res.status(200).send(response);
    } catch (error) {
      this.handleError(res, error, 'Failed to get store by id');
    }
  };
}

export default new StoreController();
