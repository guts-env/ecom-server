import express from 'express';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import appRoutes from '@/routes';
import { config } from '@/config';
import StoreService from '@/services/store.service';
import ProductService from '@/services/product.service';
import { morganLogger, logger } from '@/utils/logger';

const app = express();

app.use(helmet());
app.use(
  cors({
    /* putting placeholder domain here to demo handling different environments */
    origin: process.env.NODE_ENV === 'production' ? ['https://domain.com'] : ['http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

app.use(compression());
app.use(morganLogger);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(appRoutes);

if (process.env.NODE_ENV !== 'test') {
  const storeService = new StoreService();
  storeService
    .initializeStores()
    .then(() => {
      logger.info('Store locations initialized');
    })
    .catch((error) => {
      logger.error('Failed to initialize stores', { error });
    });

  const productService = ProductService.getInstance();
  productService
    .initializeProducts()
    .then(() => {
      logger.info('Products initialized');
    })
    .catch((error) => {
      logger.error('Failed to initialize products', { error });
    });

  const server = app.listen(config.PORT, () => {
    logger.info(`Server is running on port ${config.PORT} 🚀`);
  });

  process.on('SIGTERM', () => {
    server.close(() => {
      logger.info('Process terminated');
    });
  });
}

export default app;
