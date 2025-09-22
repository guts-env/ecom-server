import request from 'supertest';
import express from 'express';
import { StoreController } from '@/controllers/store.controller';
import { AuthError } from '@/errors';

jest.mock('@/services/store.service');

import StoreService from '@/services/store.service';

const mockGetAllStores = jest.fn();
const mockInitializeStores = jest.fn();

(StoreService as jest.Mock).mockImplementation(() => ({
  getAllStores: mockGetAllStores,
  initializeStores: mockInitializeStores,
}));

describe('StoreController Unit Tests', () => {
  let app: express.Application;
  let storeController: StoreController;

  const mockStores = [
    {
      id: '1',
      name: 'TechHub Iloilo',
      address: 'G/F Smallville Complex',
      city: 'Iloilo City',
      state: 'Iloilo',
      zip_code: '5000',
      country: 'Philippines',
      phone_number: '(033) 320-1234',
      rating: 4.5,
      is_open: true,
      latitude: 10.7202,
      longitude: 122.5621,
      location_id: 'ChIJxxx',
      created_at: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Digital World Superstore',
      address: 'SM City Iloilo',
      city: 'Iloilo City',
      state: 'Iloilo',
      zip_code: '5000',
      country: 'Philippines',
      phone_number: '(033) 321-5678',
      rating: 4.2,
      is_open: false,
      latitude: 10.7142,
      longitude: 122.5511,
      location_id: 'ChIJyyy',
      created_at: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    app = express();
    app.use(express.json());

    storeController = new StoreController();

    app.get('/stores', storeController.getAllStores);
    jest.clearAllMocks();
  });

  describe('GET /stores', () => {
    it('should return all stores successfully', async () => {
      mockGetAllStores.mockResolvedValue(mockStores);

      const response = await request(app).get('/stores').expect(200);

      expect(response.body).toEqual(mockStores);
      expect(mockGetAllStores).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no stores exist', async () => {
      mockGetAllStores.mockResolvedValue([]);

      const response = await request(app).get('/stores').expect(200);

      expect(response.body).toEqual([]);
      expect(mockGetAllStores).toHaveBeenCalledTimes(1);
    });

    it('should handle AuthError from service', async () => {
      const authError = new AuthError('STORE_ERROR', 'Failed to fetch stores', 400);
      mockGetAllStores.mockRejectedValue(authError);

      const response = await request(app).get('/stores').expect(400);

      expect(response.body).toEqual({
        success: false,
        message: 'Failed to fetch stores',
        code: 'STORE_ERROR',
      });
    });

    it('should handle generic errors with base controller error handler', async () => {
      const genericError = new Error('Database connection failed');
      mockGetAllStores.mockRejectedValue(genericError);

      const response = await request(app).get('/stores').expect(500);

      expect(response.body).toEqual({
        success: false,
        message: 'Failed to get stores',
      });
    });

    it('should return stores with all geocoded properties', async () => {
      mockGetAllStores.mockResolvedValue(mockStores);

      const response = await request(app).get('/stores').expect(200);

      expect(response.body).toHaveLength(2);

      const firstStore = response.body[0];
      expect(firstStore).toHaveProperty('id', '1');
      expect(firstStore).toHaveProperty('name', 'TechHub Iloilo');
      expect(firstStore).toHaveProperty('latitude', 10.7202);
      expect(firstStore).toHaveProperty('longitude', 122.5621);
      expect(firstStore).toHaveProperty('phone_number', '(033) 320-1234');
      expect(firstStore).toHaveProperty('rating', 4.5);
      expect(firstStore).toHaveProperty('is_open', true);
      expect(firstStore).toHaveProperty('location_id', 'ChIJxxx');
    });

    it('should handle service timeout gracefully', async () => {
      mockGetAllStores.mockImplementation(() => {
        return new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Service timeout')), 100);
        });
      });

      const response = await request(app).get('/stores');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
    });
  });

  describe('Controller Instance Tests', () => {
    it('should create an instance of StoreController', () => {
      expect(storeController).toBeInstanceOf(StoreController);
    });

    it('should have getAllStores method', () => {
      expect(typeof storeController.getAllStores).toBe('function');
    });

    it('should inject StoreService dependency', () => {
      expect((storeController as any).storeService).toBeDefined();
    });
  });

  describe('Response Format', () => {
    it('should return stores in correct format for frontend', async () => {
      mockGetAllStores.mockResolvedValue(mockStores);

      const response = await request(app).get('/stores').expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.headers['content-type']).toMatch(/json/);

      response.body.forEach((store: any) => {
        expect(store).toHaveProperty('id');
        expect(store).toHaveProperty('name');
        expect(store).toHaveProperty('address');
        expect(store).toHaveProperty('latitude');
        expect(store).toHaveProperty('longitude');
        expect(store).toHaveProperty('phone_number');
        expect(store).toHaveProperty('rating');
        expect(typeof store.rating).toBe('number');
        expect(typeof store.is_open).toBe('boolean');
      });
    });

    it('should handle stores with missing optional fields', async () => {
      const storesWithMissingFields = [
        {
          id: '1',
          name: 'Test Store',
          address: 'Test Address',
          city: 'Iloilo City',
          state: 'Iloilo',
          zip_code: '5000',
          country: 'Philippines',
          created_at: new Date().toISOString(),
        },
      ];

      mockGetAllStores.mockResolvedValue(storesWithMissingFields);

      const response = await request(app).get('/stores').expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toHaveProperty('id', '1');
      expect(response.body[0]).toHaveProperty('name', 'Test Store');
    });
  });
});
