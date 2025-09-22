import express from 'express';
import compression from 'compression';
import appRoutes from '@/routes';
import { config } from '@/config';

const app = express();

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(appRoutes);

app.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT} 🚀`);
});
