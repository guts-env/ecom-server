jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-123-456-789'),
  v1: jest.fn(() => 'test-uuid-v1-123'),
  validate: jest.fn(() => true),
  version: jest.fn(() => 4),
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password-123'),
  compare: jest.fn().mockResolvedValue(true),
  hashSync: jest.fn().mockReturnValue('hashed-password-sync-123'),
  compareSync: jest.fn().mockReturnValue(true),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mock-jwt-token-123'),
  verify: jest.fn().mockReturnValue({
    userId: 'test-user-id',
    email: 'test@example.com',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
  }),
  decode: jest.fn().mockReturnValue({
    userId: 'test-user-id',
    email: 'test@example.com',
  }),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key-for-jwt';
process.env.PORT = '3200';
process.env.GOOGLE_MAPS_API_KEY = 'test-google-maps-api-key';
