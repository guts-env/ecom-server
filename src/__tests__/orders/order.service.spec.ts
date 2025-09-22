import OrderService from '@/services/order.service';
import OrderRepository from '@/repositories/order.repository';
import type { IOrder } from '@/entities';

jest.mock('@/repositories/order.repository');

const mockOrderRepository = OrderRepository as jest.MockedClass<typeof OrderRepository>;

describe('OrderService', () => {
  let orderService: OrderService;
  let mockRepositoryInstance: jest.Mocked<OrderRepository>;
  let mockOrders: IOrder[];

  beforeEach(() => {
    jest.clearAllMocks();

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
    ];

    mockRepositoryInstance = {
      createOrder: jest.fn(),
      getOrdersByUserId: jest.fn(),
      getOrderById: jest.fn(),
    } as unknown as jest.Mocked<OrderRepository>;

    mockOrderRepository.mockImplementation(() => mockRepositoryInstance);

    orderService = new OrderService();
  });

  describe('createOrder', () => {
    it('should create order successfully', async () => {
      const newOrder = mockOrders[0];
      mockRepositoryInstance.createOrder.mockReturnValue(newOrder!);

      const result = await orderService.createOrder(newOrder!);

      expect(result).toEqual(newOrder);
      expect(mockRepositoryInstance.createOrder).toHaveBeenCalledWith(newOrder);
    });

    it('should handle order creation with multiple items', async () => {
      const orderWithMultipleItems: IOrder = {
        id: '3',
        user_id: 'user1',
        items: [
          {
            product_id: 'product1',
            quantity: 1,
            price: 999,
          },
          {
            product_id: 'product2',
            quantity: 2,
            price: 899,
          },
        ],
        total_amount: 2797,
        created_at: new Date('2024-01-03'),
      };

      mockRepositoryInstance.createOrder.mockReturnValue(orderWithMultipleItems);

      const result = await orderService.createOrder(orderWithMultipleItems);

      expect(result).toEqual(orderWithMultipleItems);
      expect(mockRepositoryInstance.createOrder).toHaveBeenCalledWith(orderWithMultipleItems);
    });
  });

  describe('getOrdersByUserId', () => {
    it('should return orders for existing user', async () => {
      const userOrders = mockOrders.filter((order) => order.user_id === 'user1');
      mockRepositoryInstance.getOrdersByUserId.mockReturnValue(userOrders);

      const result = await orderService.getOrdersByUserId('user1');

      expect(result).toEqual(userOrders);
      expect(mockRepositoryInstance.getOrdersByUserId).toHaveBeenCalledWith('user1');
    });

    it('should return empty array for non-existent user', async () => {
      mockRepositoryInstance.getOrdersByUserId.mockReturnValue([]);

      const result = await orderService.getOrdersByUserId('user999');

      expect(result).toEqual([]);
      expect(mockRepositoryInstance.getOrdersByUserId).toHaveBeenCalledWith('user999');
    });

    it('should return empty array for empty user id', async () => {
      mockRepositoryInstance.getOrdersByUserId.mockReturnValue([]);

      const result = await orderService.getOrdersByUserId('');

      expect(result).toEqual([]);
      expect(mockRepositoryInstance.getOrdersByUserId).toHaveBeenCalledWith('');
    });
  });

  describe('getOrderById', () => {
    it('should return order when found', async () => {
      const expectedOrder = mockOrders[0];
      mockRepositoryInstance.getOrderById.mockReturnValue(expectedOrder!);

      const result = await orderService.getOrderById('1');

      expect(result).toEqual(expectedOrder);
      expect(mockRepositoryInstance.getOrderById).toHaveBeenCalledWith('1');
    });

    it('should return null when order not found', async () => {
      mockRepositoryInstance.getOrderById.mockReturnValue(null);

      const result = await orderService.getOrderById('999');

      expect(result).toBeNull();
      expect(mockRepositoryInstance.getOrderById).toHaveBeenCalledWith('999');
    });

    it('should return null for empty id', async () => {
      mockRepositoryInstance.getOrderById.mockReturnValue(null);

      const result = await orderService.getOrderById('');

      expect(result).toBeNull();
      expect(mockRepositoryInstance.getOrderById).toHaveBeenCalledWith('');
    });
  });
});
