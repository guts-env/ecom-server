# E-commerce Server API

A modern Express.js REST API backend built with TypeScript, JWT authentication, and comprehensive testing.

## Prerequisites

- Node.js 20.x or higher
- Yarn package manager

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecom-server
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```bash
   cp src/.env.example .env
   ```
   
   Update `.env` with your values:
   ```env
   PORT=3100
   JWT_SECRET=your-jwt-secret-key
   GOOGLE_MAPS_API_KEY=your-google-maps-api-key
   NODE_ENV=development
   ```

4. **Start development server**
   ```bash
   yarn dev
   ```

5. **Build for production**
   ```bash
   yarn build
   yarn start
   ```

## Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn test` - Run tests
- `yarn test:coverage` - Run tests with coverage
- `yarn test:watch` - Run tests in watch mode

## API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login (returns JWT token)

### Products
- `GET /api/products` - List products (with filtering and pagination)
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/store/:storeId` - Get products by store

### Orders
- `POST /api/orders` - Create order (authenticated)
- `GET /api/orders/user/:userId` - Get user orders (authenticated)

### Stores
- `GET /api/stores` - List store locations
- `GET /api/stores/:id` - Get store by ID

## Features

- **Authentication**: JWT-based authentication system
- **Product Management**: CRUD operations with filtering and pagination
- **Order Processing**: Stock management with order validation
- **Store Locator**: Google Maps API integration for store locations
- **Input Validation**: Zod-based request validation
- **Rate Limiting**: Protection against API abuse
- **Caching**: In-memory product caching for performance
- **Comprehensive Testing**: Unit tests with Jest

## Technical Stack

- **Backend**: Express.js, TypeScript
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Zod
- **Testing**: Jest
- **Maps Integration**: Google Maps API
- **Logging**: Custom logging utility

## Project Structure

```
src/
├── controllers/     # Request handlers
├── services/        # Business logic
├── repositories/    # Data access layer
├── middleware/      # Auth, validation, rate limiting
├── routes/          # API route definitions
├── dto/             # Request validation schemas
├── entities/        # TypeScript interfaces
├── config/          # Configuration files
├── utils/           # Utility functions
└── __tests__/       # Test files
```

## Notes

- **Data Storage**: Currently uses in-memory arrays for demo purposes. Replace with a proper database (PostgreSQL, MongoDB) for production.
- **Caching**: In-memory caching is used for products. Consider Redis for production scalability.
- **Rate Limiting**: Basic implementation included. Production environments may need more sophisticated strategies.
- **Real-time Updates**: Not implemented yet. Can be added with WebSockets for live inventory updates.
- **Security**: Basic JWT implementation. Consider adding http only cookies and refresh tokens and additional security layers for production.
- **Response DTOs**: Only request validation is implemented. Response DTOs can be added for better API consistency.
- Google Maps API key is required for store location functionality
- Comprehensive unit test coverage with Jest testing framework
- TypeScript provides type safety throughout the application
