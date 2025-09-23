import OrderService from '@/services/order.service';
import OrderRepository from '@/repositories/order.repository';
import ProductService from '@/services/product.service';
import type { IOrder } from '@/entities';

jest.mock('@/repositories/order.repository');
jest.mock('@/services/product.service');

const mockOrderRepository = OrderRepository as jest.MockedClass<typeof OrderRepository>;
const mockProductService = ProductService as jest.MockedClass<typeof ProductService>;

describe('OrderService', () => {
  let orderService: OrderService;
  let mockRepositoryInstance: jest.Mocked<OrderRepository>;
  let mockProductServiceInstance: jest.Mocked<ProductService>;
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
    } as unknown as jest.Mocked<OrderRepository>;

    mockProductServiceInstance = {
      validateStock: jest.fn(),
      reduceStock: jest.fn(),
      getProductById: jest.fn(),
    } as unknown as jest.Mocked<ProductService>;

    mockOrderRepository.mockImplementation(() => mockRepositoryInstance);
    mockProductService.getInstance = jest.fn().mockReturnValue(mockProductServiceInstance);

    orderService = new OrderService();
  });

  describe('createOrder', () => {
    it('should create order successfully', async () => {
      const newOrder = mockOrders[0];
      mockProductServiceInstance.validateStock.mockResolvedValue(true);
      mockProductServiceInstance.reduceStock.mockResolvedValue(true);
      mockRepositoryInstance.createOrder.mockReturnValue(newOrder!);

      const result = await orderService.createOrder(newOrder!);

      expect(result).toEqual(newOrder);
      expect(mockProductServiceInstance.validateStock).toHaveBeenCalledTimes(newOrder!.items.length);
      expect(mockProductServiceInstance.reduceStock).toHaveBeenCalledTimes(newOrder!.items.length);
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

      mockProductServiceInstance.validateStock.mockResolvedValue(true);
      mockProductServiceInstance.reduceStock.mockResolvedValue(true);
      mockRepositoryInstance.createOrder.mockReturnValue(orderWithMultipleItems);

      const result = await orderService.createOrder(orderWithMultipleItems);

      expect(result).toEqual(orderWithMultipleItems);
      expect(mockProductServiceInstance.validateStock).toHaveBeenCalledTimes(orderWithMultipleItems.items.length);
      expect(mockProductServiceInstance.reduceStock).toHaveBeenCalledTimes(orderWithMultipleItems.items.length);
      expect(mockRepositoryInstance.createOrder).toHaveBeenCalledWith(orderWithMultipleItems);
    });

    it('should throw error when stock validation fails', async () => {
      const newOrder = mockOrders[0];
      mockProductServiceInstance.validateStock.mockResolvedValue(false);
      mockProductServiceInstance.getProductById.mockResolvedValue({
        id: 'product1',
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        store_id: 'store1',
        category: 'Test',
        brand: 'Test Brand',
        stock: 0,
        created_at: new Date(),
      });

      await expect(orderService.createOrder(newOrder!)).rejects.toThrow('Insufficient stock for Test Product');
      expect(mockRepositoryInstance.createOrder).not.toHaveBeenCalled();
    });

    it('should throw error when stock reduction fails', async () => {
      const newOrder = mockOrders[0];
      mockProductServiceInstance.validateStock.mockResolvedValue(true);
      mockProductServiceInstance.reduceStock.mockResolvedValue(false);
      mockProductServiceInstance.getProductById.mockResolvedValue({
        id: 'product1',
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        store_id: 'store1',
        category: 'Test',
        brand: 'Test Brand',
        stock: 0,
        created_at: new Date(),
      });

      await expect(orderService.createOrder(newOrder!)).rejects.toThrow('Failed to reduce stock for Test Product');
      expect(mockRepositoryInstance.createOrder).not.toHaveBeenCalled();
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

});
