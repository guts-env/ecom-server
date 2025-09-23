import type { IOrder, IOrderItem } from '@/entities';
import OrderRepository from '@/repositories/order.repository';
import ProductService from '@/services/product.service';

export default class OrderService {
  private orderRepository: OrderRepository;
  private productService: ProductService;

  constructor() {
    this.orderRepository = new OrderRepository();
    this.productService = ProductService.getInstance();
  }

  async createOrder(order: IOrder): Promise<IOrder> {
    for (const item of order.items) {
      const hasStock = await this.productService.validateStock(item.product_id, item.quantity);
      if (!hasStock) {
        const product = await this.productService.getProductById(item.product_id);
        const productName = product?.name || `Product ${item.product_id}`;
        throw new Error(`Insufficient stock for ${productName}. Requested: ${item.quantity}`);
      }
    }

    for (const item of order.items) {
      const success = await this.productService.reduceStock(item.product_id, item.quantity);
      if (!success) {
        const product = await this.productService.getProductById(item.product_id);
        const productName = product?.name || `Product ${item.product_id}`;
        throw new Error(`Failed to reduce stock for ${productName}`);
      }
    }

    order.total_amount = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return this.orderRepository.createOrder(order);
  }

  async getOrdersByUserId(userId: string): Promise<IOrder[]> {
    const orders = this.orderRepository.getOrdersByUserId(userId);

    const ordersWithProducts = await Promise.all(
      orders.map(async (order) => {
        const products = await Promise.all(
          order.items.map(async (item) => await this.productService.getProductById(item.product_id))
        );

        return {
          ...order,
          items: order.items.map((item) => ({
            ...item,
            product: products.find((product) => product?.id === item.product_id),
          })),
        };
      })
    );

    return ordersWithProducts;
  }
}
