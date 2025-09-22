import type { IOrder } from '@/entities';

export default class OrderRepository {
  private orders: IOrder[] = [];

  createOrder(order: IOrder): IOrder {
    this.orders.push(order);
    return order;
  }

  getOrdersByUserId(userId: string): IOrder[] {
    return this.orders.filter((order) => order.user_id === userId);
  }

  getOrderById(id: string): IOrder | null {
    const order = this.orders.find((order) => order.id === id);
    return order || null;
  }
}
