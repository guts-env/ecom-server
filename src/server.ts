import express from 'express';
import compression from 'compression';
import appRoutes from '@/routes';
import { config } from '@/config';

const app = express();

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(appRoutes);

if (process.env.NODE_ENV !== 'test') {
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
