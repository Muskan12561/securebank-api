# SecureBank API

A RESTful banking transaction backend built with **Node.js, Express, TypeScript, PostgreSQL, and Prisma**. SecureBank API demonstrates authentication, account management, financial transactions, role-based access, input validation, and transfer idempotency.

> **Disclaimer:** This is an educational banking simulation. It does not connect to real financial institutions or process real money.

## Features

- **Authentication:** User registration, login, and JWT-based authentication.
- **Account management:** Create, list, and retrieve accounts.
- **Financial operations:** Deposits, withdrawals, and account-to-account transfers.
- **Transfer idempotency:** Supports an `Idempotency-Key` header to safely handle retried transfer requests.
- **Transaction history:** View transactions with query validation, filtering, and pagination.
- **Access control:** Customer account isolation and admin-only endpoints.
- **Input validation:** Validates authentication, account operations, transfers, and transaction queries.
- **Currency validation:** Supports INR, USD, and EUR, with INR as the default.
- **API documentation:** Swagger UI for exploring and testing endpoints.
- **Security middleware:** Includes HTTP security headers, CORS configuration, and rate limiting.
- **Automated tests:** Vitest and Supertest test suites.

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express | REST API framework |
| TypeScript | Static typing |
| PostgreSQL | Relational database |
| Prisma ORM | Database access and migrations |
| JWT | Authentication |
| Zod | Request validation |
| Vitest | Automated testing |
| Supertest | HTTP endpoint testing |
| Swagger UI | API documentation |

## Requirements

- Node.js 20 or later
- npm
- PostgreSQL 14 or later
- Git

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Muskan12561/securebank-api.git
cd securebank-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create the PostgreSQL database

Create a database named `securebank` using pgAdmin or `psql`:

```sql
CREATE DATABASE securebank;
```

### 4. Configure environment variables

Create your local `.env` file from the example:

```powershell
Copy-Item .env.example .env
```

Open `.env` and configure your PostgreSQL connection string and the other required environment variables using `.env.example` as your reference.

Example database URL:

```text
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/securebank?schema=public"
```

Use your actual PostgreSQL credentials and a strong, unique JWT secret. Never commit `.env` or real credentials to GitHub.

### 5. Generate Prisma Client

```bash
npx prisma generate
```

### 6. Apply database migrations

```bash
npx prisma migrate dev
```

Use the migrations included in the repository to create the database schema.

### 7. Seed demo data

```bash
npm run seed
```

The seed script creates local demo users and their associated data.

**Demo credentials for local development**

| Role | Email | Password |
|---|---|---|
| Admin | `admin@securebank.local` | `Admin@12345` |
| Customer | `user@securebank.local` | `User@12345` |

The seeded customer starts with account number `1000000001` and an initial balance of ₹10,000, assuming the seed script is unchanged.

These credentials are for local development only. Do not use them in a deployed environment.

### 8. Start the development server

```bash
npm run dev
```

The API runs locally at:

- Base URL: `http://localhost:4000`
- Swagger UI: `http://localhost:4000/docs`
- Health check: `http://localhost:4000/health`

## API Endpoints

Protected endpoints require a valid JWT unless otherwise specified.

### Authentication

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register a customer |
| POST | `/api/auth/login` | Authenticate a user |
| GET | `/api/auth/me` | Get the authenticated user's information |

### Accounts

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/accounts` | Create an account |
| GET | `/api/accounts` | List the authenticated user's accounts |
| GET | `/api/accounts/:id` | Retrieve an account |
| POST | `/api/accounts/:id/deposit` | Deposit funds |
| POST | `/api/accounts/:id/withdraw` | Withdraw funds |

### Transfers

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/transfers` | Transfer funds between accounts |

Transfers require an `Idempotency-Key` header. Reusing a key for a retried request is intended to prevent duplicate processing.

### Transactions

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/transactions` | Retrieve transaction history |
| GET | `/api/transactions?page=1&limit=20&type=TRANSFER` | Retrieve filtered and paginated transactions |

### Admin

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/admin/users` | List users |
| GET | `/api/admin/accounts` | List accounts |
| GET | `/api/admin/transactions` | View transactions |

Admin endpoints require appropriate authorization.

## Example Requests

### Log in

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@securebank.local",
  "password": "User@12345"
}
```

Use the JWT returned by a successful login in the `Authorization` header of protected requests:

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

### Transfer funds

```http
POST /api/transfers
Authorization: Bearer YOUR_JWT_TOKEN
Idempotency-Key: transfer-demo-001
Content-Type: application/json

{
  "fromAccountId": "YOUR_ACCOUNT_ID",
  "toAccountNumber": "DESTINATION_ACCOUNT_NUMBER",
  "amount": 500,
  "description": "Test transfer"
}
```

Replace the example account identifiers with valid accounts in your local database.

## Validation and Error Handling

The API validates incoming request data and rejects invalid inputs. Depending on the endpoint and failure, responses may include errors for invalid data, authentication failures, authorization restrictions, missing resources, duplicate registrations, or insufficient funds.

Use the Swagger UI to inspect the available schemas and endpoint responses.

## Running Tests

Run the automated test suite:

```bash
npm test
```

Build the TypeScript project:

```bash
npm run build
```

Generate Prisma Client:

```bash
npx prisma generate
```

The current verified test suite contains **33 tests across 6 test files**. Run these commands locally to verify the current state after any changes.

## Security Notes

- Store secrets in `.env`, not in source control.
- Use strong, unique secrets outside local development.
- Keep dependencies updated and review security audit results.
- Verify authorization for every protected operation.
- Test concurrent transactions and database consistency before treating the system as production-ready.

A clean dependency audit does not, by itself, guarantee application security.

## Future Improvements

- More automated integration and authorization tests
- Concurrent transfer and withdrawal testing
- Structured audit logging
- Docker Compose for reproducible local setup
- Refresh-token flow
- Account number collision retry handling
- Deployment with production-appropriate configuration

## Project Status

The core API features are implemented. Authentication, account operations, transfers, transaction history, validation, and admin access have been exercised during development. The project also has automated tests, a successful TypeScript build, and Swagger documentation.

This is a learning and portfolio project, not a production banking platform.