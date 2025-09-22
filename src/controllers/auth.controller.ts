import { type Request, type Response } from 'express';
import BaseController from '@/controllers/base.controller';
import AuthService from '@/services/auth.service';
import { AuthError } from '@/errors';

export class AuthController extends BaseController {
  private readonly authService: AuthService;

  constructor() {
    super();
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const response = await this.authService.register(req.body);
      res.status(201).send(response);
    } catch (error) {
      if (error instanceof AuthError) {
        res.status(error.statusCode).send({
          success: false,
          message: error.message,
          code: error.code,
        });
      } else {
        this.handleError(res, error, 'Failed to register user');
      }
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const response = await this.authService.login(req.body);
      res.status(200).send(response);
    } catch (error) {
      if (error instanceof AuthError) {
        res.status(error.statusCode).send({
          success: false,
          message: error.message,
          code: error.code,
        });
      } else {
        this.handleError(res, error, 'Failed to login');
      }
    }
  };
}

export default new AuthController();
