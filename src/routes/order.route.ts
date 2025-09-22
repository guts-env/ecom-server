import { Router } from 'express';

const orderRoutes = Router();

orderRoutes.get('/', (req, res) => {
  res.send('Orders');
});

orderRoutes.post('/', (req, res) => {
  res.send('Order created');
});

export default orderRoutes;
