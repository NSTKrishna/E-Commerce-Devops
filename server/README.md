# E-Commerce Platform Backend

This is the Node.js/Express backend for the E-Commerce Platform. It provides RESTful APIs for user authentication, product management, and order processing, utilizing a PostgreSQL database accessed via Prisma ORM.

## Features

- **Authentication**: JWT-based login and registration with hashed passwords.
- **Product Management**: CRUD endpoints for products with admin protection.
- **Order Processing**: Create orders and view order history with proper relationships between users, products, and orders.
- **Validation**: Schema validation using `express-validator` to ensure data integrity.
- **Logging**: HTTP request logging using `morgan`.
- **Error Handling**: Centralized global error handling ensuring uniform JSON responses.

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Copy the provided `.env.example` file to `.env` and fill in your values:
   ```bash
   cp .env.example .env
   ```
   At minimum, you will need `DATABASE_URL` for PostgreSQL and `JWT_SECRET` for token signing.

3. **Database Migration:**
   Ensure the database is synced with Prisma:
   ```bash
   npx prisma db push
   # OR
   npx prisma migrate dev
   ```

4. **Start the Server:**
   ```bash
   # Development Server
   npm run dev

   # Or standard execution
   node index.js
   ```

## API Documentation

### Base URL: `/api`

### Authentication Routes

| Method | Endpoint        | Protection | Description                      | Body Requirements                          |
| ------ | --------------- | ---------- | -------------------------------- | ------------------------------------------ |
| POST   | `/auth/register`| Public     | Register a new user              | `{ name, email, password }`                |
| POST   | `/auth/login`   | Public     | Authenticate user and get token  | `{ email, password }`                      |

*Note: Auth responses include the generated `token`, which should be sent as a Bearer token in the `Authorization` header for protected endpoints.*

### Product Routes

| Method | Endpoint        | Protection | Description                      | Body Requirements                          |
| ------ | --------------- | ---------- | -------------------------------- | ------------------------------------------ |
| GET    | `/products`     | Public     | Fetch all products               | None                                       |
| GET    | `/products/:id` | Public     | Fetch product by ID              | None                                       |
| POST   | `/products`     | Admin      | Create a new product             | `{ name, description, price, stock, imageUrl }` |
| PUT    | `/products/:id` | Admin      | Update an existing product       | `{ name, description, price, stock, imageUrl }` |
| DELETE | `/products/:id` | Admin      | Delete a product                 | None                                       |

### Order Routes

| Method | Endpoint          | Protection| Description                      | Body Requirements                                    |
| ------ | ----------------- | --------- | -------------------------------- | ---------------------------------------------------- |
| POST   | `/orders`         | User      | Create a new order               | `{ orderItems: [{ productId, quantity, price }], totalPrice }` |
| GET    | `/orders/myorders`| User      | Get logged-in user's orders      | None                                                 |
| GET    | `/orders/:id`     | User      | Get details for a specific order | None                                                 |
| GET    | `/orders`         | Admin     | Get all orders in the system     | None                                                 |

## Architecture Context
Built utilizing a clean route/controller/middleware file structure. The system intercepts validation errors early down the pipeline, passing standard validation checks onto centralized error handlers for clean 400 Bad Request responses.
