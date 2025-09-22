import express from 'express';
import compression from 'compression';
import appRoutes from '@/routes';
import { config } from '@/config';
import StoreService from '@/services/store.service';
import ProductService from '@/services/product.service';

const app = express();

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(appRoutes);

if (process.env.NODE_ENV !== 'test') {
  const storeService = new StoreService();
  storeService
    .initializeStores()
    .then(() => {
      console.log('Store locations initialized');
    })
    .catch((error) => {
      console.error('Failed to initialize stores:', error);
    });

  const productService = new ProductService();
  productService
    .initializeProducts()
    .then(() => {
      console.log('Products initialized');
    })
    .catch((error) => {
      console.error('Failed to initialize products:', error);
    });

  const server = app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT} 🚀`);
  });

  process.on('SIGTERM', () => {
    server.close(() => {
      console.log('Process terminated');
    });
  });
}

export default app;
