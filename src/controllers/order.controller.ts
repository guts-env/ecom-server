import { type Request, type Response } from 'express';
import BaseController from '@/controllers/base.controller';
import OrderService from '@/services/order.service';
import type { IOrder } from '@/entities';

export class OrderController extends BaseController {
  private readonly orderService: OrderService;

  constructor() {
    super();
    this.orderService = new OrderService();
  }

  createOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const orderData: IOrder = {
        ...req.body,
        id: Date.now().toString(),
        created_at: new Date(),
      };

      const order = await this.orderService.createOrder(orderData);

      res.status(201).json({
        success: true,
        data: order,
      });
    } catch (error) {
      if (error instanceof Error && (error.message.includes('Insufficient stock') || error.message.includes('Failed to reduce stock'))) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
        return;
      }

      this.handleError(res, error, 'Failed to create order');
    }
  };

  getOrdersByUserId = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;

      const orders = await this.orderService.getOrdersByUserId(userId!);

      res.status(200).json({
        success: true,
        data: orders,
        count: orders.length,
        user_id: userId,
      });
    } catch (error) {
      this.handleError(res, error, 'Failed to get orders by user');
    }
  };
}

export default new OrderController();
