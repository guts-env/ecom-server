import { Router } from 'express';
import { defaultLimiter } from '@/middleware/rateLimiter.middleware';
import storeController from '@/controllers/store.controller';

const storeRoutes = Router();

storeRoutes.get('/', defaultLimiter, storeController.getAllStores);
storeRoutes.get('/:id', defaultLimiter, storeController.getStoreById);

export default storeRoutes;
