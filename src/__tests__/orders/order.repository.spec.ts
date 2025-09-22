import OrderRepository from '@/repositories/order.repository';
import type { IOrder } from '@/entities';

describe('OrderRepository', () => {
  let orderRepository: OrderRepository;
  let mockOrders: IOrder[];

  beforeEach(() => {
    orderRepository = new OrderRepository();
    mockOrders = [
      {
        id: '1',
        user_id: 'user1',
        items: [
          {
            product_id: 'product1',
            quantity: 2,
            price: 999,
          },
        ],
        total_amount: 1998,
        created_at: new Date('2024-01-01'),
      },
      {
        id: '2',
        user_id: 'user1',
        items: [
          {
            product_id: 'product2',
            quantity: 1,
            price: 899,
          },
        ],
        total_amount: 899,
        created_at: new Date('2024-01-02'),
      },
      {
        id: '3',
        user_id: 'user2',
        items: [
          {
            product_id: 'product3',
            quantity: 1,
            price: 2499,
          },
        ],
        total_amount: 2499,
        created_at: new Date('2024-01-03'),
      },
    ];
  });

  describe('createOrder', () => {
    it('should create and return order', () => {
      const newOrder = mockOrders[0];
      const result = orderRepository.createOrder(newOrder!);

      expect(result).toEqual(newOrder);

      const orders = orderRepository.getOrdersByUserId('user1');
      expect(orders).toHaveLength(1);
      expect(orders[0]).toEqual(newOrder);
    });

    it('should add multiple orders', () => {
      orderRepository.createOrder(mockOrders[0]!);
      orderRepository.createOrder(mockOrders[1]!);

      const userOrders = orderRepository.getOrdersByUserId('user1');
      expect(userOrders).toHaveLength(2);
    });
  });

  describe('getOrdersByUserId', () => {
    beforeEach(() => {
      mockOrders.forEach((order) => orderRepository.createOrder(order));
    });

    it('should return orders for existing user', () => {
      const result = orderRepository.getOrdersByUserId('user1');

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(mockOrders[0]);
      expect(result[1]).toEqual(mockOrders[1]);
    });

    it('should return single order for user with one order', () => {
      const result = orderRepository.getOrdersByUserId('user2');

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockOrders[2]);
    });

    it('should return empty array for non-existent user', () => {
      const result = orderRepository.getOrdersByUserId('user999');
      expect(result).toEqual([]);
    });

    it('should return empty array for empty user id', () => {
      const result = orderRepository.getOrdersByUserId('');
      expect(result).toEqual([]);
    });
  });

  describe('getOrderById', () => {
    beforeEach(() => {
      mockOrders.forEach((order) => orderRepository.createOrder(order));
    });

    it('should return order when found', () => {
      const result = orderRepository.getOrderById('1');
      expect(result).toEqual(mockOrders[0]);
    });

    it('should return null when order not found', () => {
      const result = orderRepository.getOrderById('999');
      expect(result).toBeNull();
    });

    it('should return null for empty id', () => {
      const result = orderRepository.getOrderById('');
      expect(result).toBeNull();
    });
  });
});
