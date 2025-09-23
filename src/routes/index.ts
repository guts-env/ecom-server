import { Router } from 'express';
import orderRoutes from '@/routes/order.route';
import productRoutes from '@/routes/product.route';
import storeRoutes from '@/routes/store.route';
import userRoutes from '@/routes/user.route';

const appRoutes = Router();

appRoutes.use('/orders', orderRoutes);
appRoutes.use('/products', productRoutes);
appRoutes.use('/stores', storeRoutes);
appRoutes.use('/auth', userRoutes);

export default appRoutes;
