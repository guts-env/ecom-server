import request from 'supertest';
import express from 'express';
import { AuthError } from '@/errors';
import { validate } from '@/middleware/validation.middleware';
import { RegisterDTOSchema, LoginDTOSchema } from '@/dto/auth.dto';
import { INVALID_CREDENTIALS, USER_EXISTS } from '@/constants/errors';
import { AuthController } from '@/controllers/auth.controller';

const mockRegister = jest.fn();
const mockLogin = jest.fn();

class MockAuthService {
  register = mockRegister;
  login = mockLogin;
  constructor() {}
}

describe('AuthController Unit Tests', () => {
  let app: express.Application;
  let authController: AuthController;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    authController = new AuthController();
    (authController as any).authService = new MockAuthService();

    app.post('/register', validate(RegisterDTOSchema), authController.register);
    app.post('/login', validate(LoginDTOSchema), authController.login);
  });

  describe('POST /register', () => {
    const validRegisterData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    };

    it('should register a user successfully', async () => {
      mockRegister.mockResolvedValue(undefined);

      const response = await request(app).post('/register').send(validRegisterData);

      expect(response.status).toBe(201);
      expect(mockRegister).toHaveBeenCalledWith(validRegisterData);
    });

    it('should return 400 for validation errors', async () => {
      const invalidData = {
        name: '',
        email: 'invalid-email',
        password: '123',
      };

      const response = await request(app).post('/register').send(invalidData).expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation error');
      expect(response.body.errors).toBeInstanceOf(Array);
      expect(response.body.errors.length).toBeGreaterThan(0);
    });

    it('should return 409 when user already exists', async () => {
      const authError = new AuthError(USER_EXISTS.code, USER_EXISTS.message, USER_EXISTS.statusCode);
      mockRegister.mockRejectedValue(authError);

      const response = await request(app).post('/register').send(validRegisterData).expect(409);

      expect(response.body).toEqual({
        success: false,
        message: USER_EXISTS.message,
        code: USER_EXISTS.code,
      });
    });

    it('should require name field', async () => {
      const dataWithoutName = {
        email: 'john@example.com',
        password: 'password123',
      };

      const response = await request(app).post('/register').send(dataWithoutName).expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toContainEqual(
        expect.objectContaining({
          field: 'name',
          message: expect.stringContaining('Name is required'),
        })
      );
    });

    it('should require email field', async () => {
      const dataWithoutEmail = {
        name: 'John Doe',
        password: 'password123',
      };

      const response = await request(app).post('/register').send(dataWithoutEmail).expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toContainEqual(
        expect.objectContaining({
          field: 'email',
          message: expect.stringContaining('Invalid email format'),
        })
      );
    });

    it('should require password field', async () => {
      const dataWithoutPassword = {
        name: 'John Doe',
        email: 'john@example.com',
      };

      const response = await request(app).post('/register').send(dataWithoutPassword).expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toContainEqual(
        expect.objectContaining({
          field: 'password',
          message: expect.stringContaining('Password'),
        })
      );
    });

    it('should handle generic errors with base controller error handler', async () => {
      const genericError = new Error('Database connection failed');
      mockRegister.mockRejectedValue(genericError);

      const mockHandleError = jest.spyOn(authController, 'handleError' as any);

      await request(app).post('/register').send(validRegisterData);

      expect(mockHandleError).toHaveBeenCalled();
    });
  });

  describe('POST /login', () => {
    const validLoginData = {
      email: 'john@example.com',
      password: 'password123',
    };

    it('should login a user successfully', async () => {
      const mockServiceResponse = {
        success: true,
        data: {
          user: {
            id: 'user-id',
            name: 'John Doe',
            email: 'john@example.com',
          },
          token: 'jwt-token',
        },
      };

      mockLogin.mockResolvedValue(mockServiceResponse);

      const response = await request(app).post('/login').send(validLoginData).expect(200);

      expect(response.body).toEqual(mockServiceResponse);
      expect(mockLogin).toHaveBeenCalledWith(validLoginData);
    });

    it('should return 400 for validation errors', async () => {
      const invalidData = {
        email: 'invalid-email',
        password: '',
      };

      const response = await request(app).post('/login').send(invalidData).expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation error');
      expect(response.body.errors).toBeInstanceOf(Array);
    });

    it('should return 401 for invalid credentials', async () => {
      const authError = new AuthError(
        INVALID_CREDENTIALS.code,
        INVALID_CREDENTIALS.message,
        INVALID_CREDENTIALS.statusCode
      );
      mockLogin.mockRejectedValue(authError);

      const response = await request(app).post('/login').send(validLoginData).expect(401);

      expect(response.body).toEqual({
        success: false,
        message: INVALID_CREDENTIALS.message,
        code: INVALID_CREDENTIALS.code,
      });
    });

    it('should require email field', async () => {
      const dataWithoutEmail = {
        password: 'password123',
      };

      const response = await request(app).post('/login').send(dataWithoutEmail).expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toContainEqual(
        expect.objectContaining({
          field: 'email',
          message: expect.stringContaining('credentials'),
        })
      );
    });

    it('should require password field', async () => {
      const dataWithoutPassword = {
        email: 'john@example.com',
      };

      const response = await request(app).post('/login').send(dataWithoutPassword).expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toContainEqual(
        expect.objectContaining({
          field: 'password',
          message: expect.stringContaining('credentials'),
        })
      );
    });

    it('should handle generic errors with base controller error handler', async () => {
      const genericError = new Error('Service unavailable');
      mockLogin.mockRejectedValue(genericError);

      const mockHandleError = jest.spyOn(authController, 'handleError' as any);

      await request(app).post('/login').send(validLoginData);

      expect(mockHandleError).toHaveBeenCalled();
    });
  });

  describe('Controller Instance Tests', () => {
    it('should create an instance of AuthController', () => {
      expect(authController).toBeInstanceOf(AuthController);
    });

    it('should have register and login methods', () => {
      expect(typeof authController.register).toBe('function');
      expect(typeof authController.login).toBe('function');
    });
  });

  describe('Error Handling', () => {
    it('should handle AuthError correctly in register', async () => {
      const customError = new AuthError('CUSTOM_ERROR', 'Custom error message', 422);
      mockRegister.mockRejectedValue(customError);

      const response = await request(app)
        .post('/register')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        })
        .expect(422);

      expect(response.body).toEqual({
        success: false,
        message: 'Custom error message',
        code: 'CUSTOM_ERROR',
      });
    });

    it('should handle AuthError correctly in login', async () => {
      const customError = new AuthError('CUSTOM_ERROR', 'Custom error message', 422);
      mockLogin.mockRejectedValue(customError);

      const response = await request(app)
        .post('/login')
        .send({
          email: 'john@example.com',
          password: 'password123',
        })
        .expect(422);

      expect(response.body).toEqual({
        success: false,
        message: 'Custom error message',
        code: 'CUSTOM_ERROR',
      });
    });
  });

  describe('Middleware Integration', () => {
    it('should apply validation middleware before controller methods', async () => {
      await request(app).post('/register').send({}).expect(400);

      expect(mockRegister).not.toHaveBeenCalled();
    });

    it('should process valid requests through validation middleware', async () => {
      mockRegister.mockResolvedValue(undefined);

      await request(app)
        .post('/register')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        })
        .expect(201);

      expect(mockRegister).toHaveBeenCalled();
    });
  });
});
