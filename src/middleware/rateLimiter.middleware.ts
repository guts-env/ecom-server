import rateLimit from 'express-rate-limit';
import { RATE_LIMIT_EXCEEDED } from '@/constants/errors';

const rateLimitMessage = {
  success: false,
  message: RATE_LIMIT_EXCEEDED.message,
  code: RATE_LIMIT_EXCEEDED.code,
};

export const defaultLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: rateLimitMessage,
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  message: rateLimitMessage,
  skipSuccessfulRequests: true,
});
