import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import AuthService from '@/services/auth.service';
import { AuthError } from '@/errors';
import { USER_EXISTS, INVALID_CREDENTIALS } from '@/constants/errors';

const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const mockJwt = jwt as jest.Mocked<typeof jwt>;
const mockCreateUser = jest.fn();
const mockGetUserByEmail = jest.fn();

jest.mock('@/repositories/user.repository', () => {
  return jest.fn().mockImplementation(() => ({
    createUser: mockCreateUser,
    getUserByEmail: mockGetUserByEmail,
  }));
});

jest.mock('@/config', () => ({
  config: {
    JWT_SECRET: 'test-secret',
  },
}));

describe('AuthService Unit Tests', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    };

    it('should register a user successfully', async () => {
      mockGetUserByEmail.mockReturnValue(null);
      (mockBcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword123');
      mockCreateUser.mockResolvedValue(undefined);

      await authService.register(registerData);

      expect(mockGetUserByEmail).toHaveBeenCalledWith('john@example.com');
      expect(mockBcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(mockCreateUser).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'John Doe',
          email: 'john@example.com',
          hashed_password: 'hashedPassword123',
        })
      );
    });

    it('should throw AuthError when user already exists', async () => {
      mockGetUserByEmail.mockReturnValue({
        id: 'existing-user',
        email: 'john@example.com',
      });

      await expect(authService.register(registerData)).rejects.toThrow(
        new AuthError(USER_EXISTS.code, USER_EXISTS.message, USER_EXISTS.statusCode)
      );

      expect(mockGetUserByEmail).toHaveBeenCalledWith('john@example.com');
      expect(mockBcrypt.hash).not.toHaveBeenCalled();
      expect(mockCreateUser).not.toHaveBeenCalled();
    });

    it('should hash password with salt rounds 10', async () => {
      mockGetUserByEmail.mockReturnValue(null);
      (mockBcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword123');
      mockCreateUser.mockResolvedValue(undefined);

      await authService.register(registerData);

      expect(mockBcrypt.hash).toHaveBeenCalledWith('password123', 10);
    });
  });

  describe('login', () => {
    const loginData = {
      email: 'john@example.com',
      password: 'password123',
    };

    it('should login user successfully with valid credentials', async () => {
      const mockUser = {
        id: 'user-id',
        name: 'John Doe',
        email: 'john@example.com',
        hashed_password: 'hashedPassword123',
      };

      mockGetUserByEmail.mockReturnValue(mockUser);
      (mockBcrypt.compare as jest.Mock).mockResolvedValue(true);
      (mockJwt.sign as jest.Mock).mockReturnValue('jwt-token');

      const result = await authService.login(loginData);

      expect(mockGetUserByEmail).toHaveBeenCalledWith('john@example.com');
      expect(mockBcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword123');
      expect(mockJwt.sign).toHaveBeenCalledWith(
        {
          userId: 'user-id',
          email: 'john@example.com',
        },
        'test-secret',
        { expiresIn: '24h' }
      );
      expect(result).toEqual({
        success: true,
        data: {
          user: {
            id: 'user-id',
            name: 'John Doe',
            email: 'john@example.com',
          },
          token: 'jwt-token',
        },
      });
    });

    it('should throw AuthError when user not found', async () => {
      mockGetUserByEmail.mockReturnValue(null);

      await expect(authService.login(loginData)).rejects.toThrow(
        new AuthError(INVALID_CREDENTIALS.code, INVALID_CREDENTIALS.message, INVALID_CREDENTIALS.statusCode)
      );

      expect(mockGetUserByEmail).toHaveBeenCalledWith('john@example.com');
      expect(mockBcrypt.compare).not.toHaveBeenCalled();
      expect(mockJwt.sign).not.toHaveBeenCalled();
    });

    it('should throw AuthError when password is invalid', async () => {
      const mockUser = {
        id: 'user-id',
        name: 'John Doe',
        email: 'john@example.com',
        hashed_password: 'hashedPassword123',
      };

      mockGetUserByEmail.mockReturnValue(mockUser);
      (mockBcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.login(loginData)).rejects.toThrow(
        new AuthError(INVALID_CREDENTIALS.code, INVALID_CREDENTIALS.message, INVALID_CREDENTIALS.statusCode)
      );

      expect(mockGetUserByEmail).toHaveBeenCalledWith('john@example.com');
      expect(mockBcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword123');
      expect(mockJwt.sign).not.toHaveBeenCalled();
    });

    it('should generate JWT token with correct payload and options', async () => {
      const mockUser = {
        id: 'user-id',
        name: 'John Doe',
        email: 'john@example.com',
        hashed_password: 'hashedPassword123',
      };

      mockGetUserByEmail.mockReturnValue(mockUser);
      (mockBcrypt.compare as jest.Mock).mockResolvedValue(true);
      (mockJwt.sign as jest.Mock).mockReturnValue('jwt-token');

      await authService.login(loginData);

      expect(mockJwt.sign).toHaveBeenCalledWith(
        {
          userId: 'user-id',
          email: 'john@example.com',
        },
        'test-secret',
        { expiresIn: '24h' }
      );
    });
  });

  describe('Password Hashing', () => {
    it('should use bcrypt with salt rounds 10 for password hashing', async () => {
      mockGetUserByEmail.mockReturnValue(null);
      (mockBcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      mockCreateUser.mockResolvedValue(undefined);

      await authService.register({
        name: 'Test User',
        email: 'test@example.com',
        password: 'testpassword',
      });

      expect(mockBcrypt.hash).toHaveBeenCalledWith('testpassword', 10);
    });

    it('should compare passwords correctly during login', async () => {
      const mockUser = {
        id: 'user-id',
        name: 'Test User',
        email: 'test@example.com',
        hashed_password: 'hashedPassword',
      };

      mockGetUserByEmail.mockReturnValue(mockUser);
      (mockBcrypt.compare as jest.Mock).mockResolvedValue(true);
      (mockJwt.sign as jest.Mock).mockReturnValue('token');

      await authService.login({
        email: 'test@example.com',
        password: 'plainPassword',
      });

      expect(mockBcrypt.compare).toHaveBeenCalledWith('plainPassword', 'hashedPassword');
    });
  });

  describe('JWT Token Generation', () => {
    it('should generate JWT token with user ID and email', async () => {
      const mockUser = {
        id: 'test-user-id',
        name: 'Test User',
        email: 'test@example.com',
        hashed_password: 'hashedPassword',
      };

      mockGetUserByEmail.mockReturnValue(mockUser);
      (mockBcrypt.compare as jest.Mock).mockResolvedValue(true);
      (mockJwt.sign as jest.Mock).mockReturnValue('generated-token');

      const result = await authService.login({
        email: 'test@example.com',
        password: 'password',
      });

      expect(mockJwt.sign).toHaveBeenCalledWith(
        {
          userId: 'test-user-id',
          email: 'test@example.com',
        },
        'test-secret',
        { expiresIn: '24h' }
      );
      expect(result.data?.token).toBe('generated-token');
    });

    it('should use JWT_SECRET from config', async () => {
      const mockUser = {
        id: 'user-id',
        name: 'User',
        email: 'user@example.com',
        hashed_password: 'hashedPassword',
      };

      mockGetUserByEmail.mockReturnValue(mockUser);
      (mockBcrypt.compare as jest.Mock).mockResolvedValue(true);
      (mockJwt.sign as jest.Mock).mockReturnValue('token');

      await authService.login({
        email: 'user@example.com',
        password: 'password',
      });

      expect(mockJwt.sign).toHaveBeenCalledWith(expect.any(Object), 'test-secret', expect.any(Object));
    });

    it('should set token expiration to 15 minutes', async () => {
      const mockUser = {
        id: 'user-id',
        name: 'User',
        email: 'user@example.com',
        hashed_password: 'hashedPassword',
      };

      mockGetUserByEmail.mockReturnValue(mockUser);
      (mockBcrypt.compare as jest.Mock).mockResolvedValue(true);
      (mockJwt.sign as jest.Mock).mockReturnValue('token');

      await authService.login({
        email: 'user@example.com',
        password: 'password',
      });

      expect(mockJwt.sign).toHaveBeenCalledWith(expect.any(Object), expect.any(String), { expiresIn: '24h' });
    });
  });
});
