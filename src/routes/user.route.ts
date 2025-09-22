import { Router } from 'express';
import authController from '@/controllers/auth.controller';
import { validate } from '@/middleware/validation.middleware';
import { RegisterDTOSchema, LoginDTOSchema } from '@/dto/auth.dto';

const userRoutes = Router();

userRoutes.post('/register', validate(RegisterDTOSchema), authController.register);
userRoutes.post('/login', validate(LoginDTOSchema), authController.login);

export default userRoutes;
