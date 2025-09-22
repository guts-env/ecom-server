import UserRepository from '@/repositories/user.repository';
import type { IUser } from '@/entities';

describe('UserRepository Unit Tests', () => {
  let userRepository: UserRepository;

  beforeEach(() => {
    userRepository = new UserRepository();
  });

  describe('createUser', () => {
    it('should create a user successfully', () => {
      const newUser: IUser = {
        id: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
        hashed_password: 'hashedPassword123',
        created_at: new Date('2023-01-01'),
      };

      userRepository.createUser(newUser);

      const retrievedUser = userRepository.getUserByEmail('john@example.com');
      expect(retrievedUser).toEqual(newUser);
    });

    it('should store multiple users', () => {
      const user1: IUser = {
        id: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
        hashed_password: 'hashedPassword123',
        created_at: new Date('2023-01-01'),
      };

      const user2: IUser = {
        id: 'user-2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        hashed_password: 'hashedPassword456',
        created_at: new Date('2023-01-02'),
      };

      userRepository.createUser(user1);
      userRepository.createUser(user2);

      expect(userRepository.getUserByEmail('john@example.com')).toEqual(user1);
      expect(userRepository.getUserByEmail('jane@example.com')).toEqual(user2);
    });

    it('should allow duplicate users with same email', () => {
      const user1: IUser = {
        id: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
        hashed_password: 'hashedPassword123',
        created_at: new Date('2023-01-01'),
      };

      const user2: IUser = {
        id: 'user-2',
        name: 'John Smith',
        email: 'john@example.com',
        hashed_password: 'hashedPassword456',
        created_at: new Date('2023-01-02'),
      };

      userRepository.createUser(user1);
      userRepository.createUser(user2);

      const retrievedUser = userRepository.getUserByEmail('john@example.com');
      expect(retrievedUser).toEqual(user1);
    });
  });

  describe('getUserByEmail', () => {
    const testUser: IUser = {
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      hashed_password: 'hashedPassword123',
      created_at: new Date('2023-01-01'),
    };

    beforeEach(() => {
      userRepository.createUser(testUser);
    });

    it('should return user when email exists', () => {
      const result = userRepository.getUserByEmail('john@example.com');
      expect(result).toEqual(testUser);
    });

    it('should return null when email does not exist', () => {
      const result = userRepository.getUserByEmail('nonexistent@example.com');
      expect(result).toBeNull();
    });

    it('should be case sensitive for email lookup', () => {
      const result = userRepository.getUserByEmail('JOHN@EXAMPLE.COM');
      expect(result).toBeNull();
    });

    it('should return exact match for email', () => {
      const result = userRepository.getUserByEmail('john@example.co');
      expect(result).toBeNull();
    });

    it('should handle empty email string', () => {
      const result = userRepository.getUserByEmail('');
      expect(result).toBeNull();
    });

    it('should return first user when multiple users have same email', () => {
      const duplicateUser: IUser = {
        id: 'user-2',
        name: 'John Smith',
        email: 'john@example.com',
        hashed_password: 'hashedPassword456',
        created_at: new Date('2023-01-02'),
      };

      userRepository.createUser(duplicateUser);

      const result = userRepository.getUserByEmail('john@example.com');
      expect(result).toEqual(testUser);
      expect(result?.id).toBe('user-1');
    });
  });

  describe('Repository State Management', () => {
    it('should start with empty users array', () => {
      const freshRepository = new UserRepository();
      const result = freshRepository.getUserByEmail('any@example.com');
      expect(result).toBeNull();
    });

    it('should maintain users across multiple operations', () => {
      const user1: IUser = {
        id: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
        hashed_password: 'hashedPassword123',
        created_at: new Date('2023-01-01'),
      };

      const user2: IUser = {
        id: 'user-2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        hashed_password: 'hashedPassword456',
        created_at: new Date('2023-01-02'),
      };

      userRepository.createUser(user1);
      userRepository.createUser(user2);

      expect(userRepository.getUserByEmail('john@example.com')).toEqual(user1);
      expect(userRepository.getUserByEmail('jane@example.com')).toEqual(user2);

      const user3: IUser = {
        id: 'user-3',
        name: 'Bob Johnson',
        email: 'bob@example.com',
        hashed_password: 'hashedPassword789',
        created_at: new Date('2023-01-03'),
      };

      userRepository.createUser(user3);

      expect(userRepository.getUserByEmail('john@example.com')).toEqual(user1);
      expect(userRepository.getUserByEmail('jane@example.com')).toEqual(user2);
      expect(userRepository.getUserByEmail('bob@example.com')).toEqual(user3);
    });

    it('should handle users with all required IUser properties', () => {
      const completeUser: IUser = {
        id: 'complete-user-id',
        name: 'Complete User',
        email: 'complete@example.com',
        hashed_password: 'superSecureHashedPassword',
        created_at: new Date('2023-12-01T10:30:00Z'),
      };

      userRepository.createUser(completeUser);
      const retrieved = userRepository.getUserByEmail('complete@example.com');

      expect(retrieved).toEqual(completeUser);
      expect(retrieved?.id).toBe('complete-user-id');
      expect(retrieved?.name).toBe('Complete User');
      expect(retrieved?.email).toBe('complete@example.com');
      expect(retrieved?.hashed_password).toBe('superSecureHashedPassword');
      expect(retrieved?.created_at).toEqual(new Date('2023-12-01T10:30:00Z'));
    });
  });
});
