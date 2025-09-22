import { Router } from 'express';
import authController from '@/controllers/auth.controller';
import { authLimiter } from '@/middleware/rateLimiter.middleware';
import { validate } from '@/middleware/validation.middleware';
import { RegisterDTOSchema, LoginDTOSchema } from '@/dto/auth.dto';

const userRoutes = Router();

userRoutes.post('/register', authLimiter, validate(RegisterDTOSchema), authController.register);
userRoutes.post('/login', authLimiter, validate(LoginDTOSchema), authController.login);

export default userRoutes;
