import request from 'supertest';
import express from 'express';
import { OrderController } from '@/controllers/order.controller';
import OrderService from '@/services/order.service';
import type { IOrder } from '@/entities';

jest.mock('@/services/order.service');

const mockOrderService = OrderService as jest.MockedClass<typeof OrderService>;

describe('OrderController', () => {
  let app: express.Application;
  let orderController: OrderController;
  let mockServiceInstance: jest.Mocked<OrderService>;
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
        created_at: '2024-01-01T00:00:00.000Z',
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
        created_at: '2024-01-02T00:00:00.000Z',
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
        created_at: '2024-01-03T00:00:00.000Z',
      },
    ] as unknown as IOrder[];

    mockServiceInstance = {
      createOrder: jest.fn(),
      getOrdersByUserId: jest.fn(),
      getOrderById: jest.fn(),
    } as unknown as jest.Mocked<OrderService>;

    mockOrderService.mockImplementation(() => mockServiceInstance);

    orderController = new OrderController();

    app = express();
    app.use(express.json());
    app.post('/orders', orderController.createOrder);
    app.get('/orders/user/:userId', orderController.getOrdersByUserId);
    app.get('/orders/:id', orderController.getOrderById);
  });

  describe('POST /orders', () => {
    it('should create order successfully', async () => {
      const orderData = {
        user_id: 'user1',
        items: [
          {
            product_id: 'product1',
            quantity: 2,
            price: 999,
          },
        ],
        total_amount: 1998,
      };

      const createdOrder = {
        ...orderData,
        id: '1',
        created_at: '2024-01-01T00:00:00.000Z',
      };

      mockServiceInstance.createOrder.mockResolvedValue(createdOrder as unknown as IOrder);

      const response = await request(app).post('/orders').send(orderData).expect(201);

      expect(response.body).toEqual({
        success: true,
        data: createdOrder,
      });
      expect(mockServiceInstance.createOrder).toHaveBeenCalledWith(
        expect.objectContaining({
          ...orderData,
          id: expect.any(String),
          created_at: expect.any(Date),
        })
      );
    });

    it('should create order with multiple items', async () => {
      const orderData = {
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
      };

      const createdOrder = {
        ...orderData,
        id: '2',
        created_at: '2024-01-01T00:00:00.000Z',
      };

      mockServiceInstance.createOrder.mockResolvedValue(createdOrder as unknown as IOrder);

      const response = await request(app).post('/orders').send(orderData).expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(createdOrder);
    });

    it('should handle service error', async () => {
      const orderData = {
        user_id: 'user1',
        items: [
          {
            product_id: 'product1',
            quantity: 2,
            price: 999,
          },
        ],
        total_amount: 1998,
      };

      mockServiceInstance.createOrder.mockRejectedValue(new Error('Service error'));

      await request(app).post('/orders').send(orderData).expect(500);
    });
  });

  describe('GET /orders/user/:userId', () => {
    it('should return orders for user', async () => {
      const userOrders = mockOrders.filter((order) => order.user_id === 'user1');
      mockServiceInstance.getOrdersByUserId.mockResolvedValue(userOrders);

      const response = await request(app).get('/orders/user/user1').expect(200);

      expect(response.body).toEqual({
        success: true,
        data: userOrders,
        count: userOrders.length,
        user_id: 'user1',
      });
      expect(mockServiceInstance.getOrdersByUserId).toHaveBeenCalledWith('user1');
    });

    it('should return empty array for user with no orders', async () => {
      mockServiceInstance.getOrdersByUserId.mockResolvedValue([]);

      const response = await request(app).get('/orders/user/user999').expect(200);

      expect(response.body.data).toEqual([]);
      expect(response.body.count).toBe(0);
      expect(response.body.user_id).toBe('user999');
    });

    it('should handle service error', async () => {
      mockServiceInstance.getOrdersByUserId.mockRejectedValue(new Error('Service error'));

      await request(app).get('/orders/user/user1').expect(500);
    });
  });

  describe('GET /orders/:id', () => {
    it('should return order when found', async () => {
      const expectedOrder = mockOrders[0];
      mockServiceInstance.getOrderById.mockResolvedValue(expectedOrder!);

      const response = await request(app).get('/orders/1').expect(200);

      expect(response.body).toEqual({
        success: true,
        data: expectedOrder,
      });
      expect(mockServiceInstance.getOrderById).toHaveBeenCalledWith('1');
    });

    it('should return 404 when order not found', async () => {
      mockServiceInstance.getOrderById.mockResolvedValue(null);

      const response = await request(app).get('/orders/999').expect(404);

      expect(response.body).toEqual({
        success: false,
        message: 'Order not found',
      });
    });

    it('should handle service error', async () => {
      mockServiceInstance.getOrderById.mockRejectedValue(new Error('Service error'));

      await request(app).get('/orders/1').expect(500);
    });
  });
});
