import type { IOrder } from '@/entities';
import OrderRepository from '@/repositories/order.repository';

export default class OrderService {
  private orderRepository: OrderRepository;

  constructor() {
    this.orderRepository = new OrderRepository();
  }

  async createOrder(order: IOrder): Promise<IOrder> {
    return this.orderRepository.createOrder(order);
  }

  async getOrdersByUserId(userId: string): Promise<IOrder[]> {
    return this.orderRepository.getOrdersByUserId(userId);
  }

  async getOrderById(id: string): Promise<IOrder | null> {
    return this.orderRepository.getOrderById(id);
  }
}
