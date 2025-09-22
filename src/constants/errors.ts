export const AUTH_ERROR = {
  code: 'AUTH_ERROR',
  message: 'Authentication error',
  statusCode: 400,
};

export const INVALID_CREDENTIALS = {
  code: 'INVALID_CREDENTIALS',
  message: 'Invalid credentials',
  statusCode: 401,
};

export const INVALID_TOKEN = {
  code: 'INVALID_TOKEN',
  message: 'Invalid token',
  statusCode: 401,
};

export const RATE_LIMIT_EXCEEDED = {
  code: 'RATE_LIMIT_EXCEEDED',
  message: 'Too many requests, please try again later',
  statusCode: 429,
};

export const TOKEN_EXPIRED = {
  code: 'TOKEN_EXPIRED',
  message: 'Invalid token',
  statusCode: 401,
};

export const TOKEN_REQUIRED = {
  code: 'TOKEN_REQUIRED',
  message: 'Invalid token',
  statusCode: 401,
};

export const USER_EXISTS = {
  code: 'USER_EXISTS',
  message: 'User with this email already exists',
  statusCode: 409,
};

export const VALIDATION_ERROR = {
  code: 'VALIDATION_ERROR',
  message: 'Validation error',
  statusCode: 400,
};
