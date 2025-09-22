import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '@/config';
import { INVALID_TOKEN, TOKEN_EXPIRED, TOKEN_REQUIRED } from '@/constants/errors';
import { type TokenPayload } from '@/interfaces';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
      };
    }
  }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(TOKEN_REQUIRED.statusCode).json({
      success: false,
      message: TOKEN_REQUIRED.message,
      code: TOKEN_REQUIRED.code,
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as TokenPayload;

    if (!decoded.userId || !decoded.email) {
      res.status(INVALID_TOKEN.statusCode).json({
        success: false,
        message: INVALID_TOKEN.message,
        code: INVALID_TOKEN.code,
      });
    }

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
    };

    next();
  } catch (error) {
    res.status(INVALID_TOKEN.statusCode).json({
      success: false,
      message: INVALID_TOKEN.message,
      code: INVALID_TOKEN.code,
    });
    return;
  }
};
