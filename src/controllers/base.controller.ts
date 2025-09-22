import { type Response } from 'express';

export default class BaseController {
  protected handleError(res: Response) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}
