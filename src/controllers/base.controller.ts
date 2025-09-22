import { type Response } from 'express';
import { logger } from '@/utils/logger';

export default class BaseController {
  protected handleError(res: Response, error?: any, message?: string) {
    const errorMessage = message || 'Internal server error';

    if (error) {
      logger.error('Controller error', {
        error: error.message || error,
        stack: error.stack
      });
    }

    res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
}
