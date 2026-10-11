# SecureBank API

A zero-cost local banking transaction backend built with TypeScript, Node.js, Express, PostgreSQL and Prisma.

## Requirements

- Node.js 20+
- npm
- PostgreSQL 14+
- VS Code recommended
- Git recommended

## 1. Install dependencies

```bash
npm install
```

## 2. Create PostgreSQL database

Using psql:

```sql
CREATE DATABASE securebank;
```

Or create a database named `securebank` in pgAdmin.

## 3. Create environment file

Copy `.env.example` to `.env`.

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Then edit `.env` if your PostgreSQL username/password differ.

Default expected connection:

```text
postgresql://postgres:postgres@localhost:5432/securebank?schema=public
```

## 4. Generate Prisma client

```bash
npx prisma generate
```

## 5. Create database tables

```bash
npx prisma migrate dev --name init
```

## 6. Seed demo users

```bash
npm run seed
```

Demo accounts:

- Admin: `admin@securebank.local` / `Admin@12345`
- Customer: `user@securebank.local` / `User@12345`

The demo customer starts with account `1000000001` and ₹10,000.

## 7. Start the API

```bash
npm run dev
```

API:

```text
http://localhost:4000
```

Health check:

```text
GET http://localhost:4000/health
```

## Main endpoints

### Auth

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Accounts

```text
POST /api/accounts
GET  /api/accounts
GET  /api/accounts/:id
POST /api/accounts/:id/deposit
POST /api/accounts/:id/withdraw
```

### Transfers

```text
POST /api/transfers
```

Required header:

```text
Idempotency-Key: some-unique-key-123
```

### Transactions

```text
GET /api/transactions
GET /api/transactions?page=1&limit=20&type=TRANSFER
```

### Admin

```text
GET /api/admin/users
GET /api/admin/accounts
GET /api/admin/transactions
```

## Example login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@securebank.local",
  "password": "User@12345"
}
```

Copy the returned JWT and send:

```text
Authorization: Bearer YOUR_TOKEN
```

## Example transfer

```http
POST /api/transfers
Authorization: Bearer YOUR_TOKEN
Idempotency-Key: transfer-demo-001
Content-Type: application/json

{
  "fromAccountId": "YOUR_ACCOUNT_ID",
  "toAccountNumber": "DESTINATION_ACCOUNT_NUMBER",
  "amount": 500,
  "description": "Test transfer"
}
```

## Notes

This is an educational local banking simulation. It does not connect to real financial institutions or process real money.

## Next hardening steps

- Redis-backed rate limiting/caching
- OpenAPI/Swagger documentation
- More integration tests
- Concurrency/locking hardening
- Docker Compose
- Production deployment
- Audit logging
- Refresh tokens
- Account number collision retry


## Swagger UI

With the server running, open:

```text
http://localhost:4000/docs
```

## Important

This is a learning project, not a real banking product. It never handles real money.
