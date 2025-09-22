import { Router } from 'express';

const storeRoutes = Router();

storeRoutes.get('/', (req, res) => {
  res.send('Stores');
});

export default storeRoutes;
