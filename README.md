# Infraction Service

A microservice for managing traffic infractions (AITs - Auto de Infração de Trânsito) with CSV export capabilities using RabbitMQ for async processing.

## 🚀 Features

- Create and manage traffic infractions
- Async CSV export using message queue
- Dead letter queue for failed operations
- Validation using Zod
- Type-safe development with TypeScript

## 🏗️ Architecture

```
src/
├── application/      # Application use cases
├── domain/          # Domain entities and business rules
├── infra/           # Infrastructure layer
│   ├── broker/      # Message broker (RabbitMQ)
│   ├── http/        # HTTP controllers and DTOs
│   └── database/    # Database configurations
└── config/          # Environment and app configurations
```

## 🔧 Prerequisites

- Node.js >= 14
- RabbitMQ >= 3.8
- PostgreSQL >= 12

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/infraction"

# RabbitMQ
RABBITMQ_URI="amqp://localhost:5672"
RABBITMQ_QUEUE_CSV="csv_queue"
```

## 🚀 Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start RabbitMQ (using Docker):

```bash
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:management
```

3. Run database migrations:

```bash
npm run prisma:migrate
```

4. Start the service:

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## 📤 CSV Export Process

1. Make a POST request to trigger CSV generation:

```bash
curl -X POST http://localhost:3000/api/aits/export \
  -H "Content-Type: application/json" \
  -d '{"startDate": "2023-01-01", "endDate": "2023-12-31"}'
```

2. The request is queued in RabbitMQ
3. The consumer processes the request asynchronously
4. CSV file is generated in the `exports` directory

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📚 API Documentation

Access the Swagger documentation at:

```
http://localhost:3000/api/docs
```

## 🛠️ Error Handling

- Failed CSV generations are retried up to 3 times
- Failed messages after retries go to Dead Letter Queue (DLQ)
- Monitor DLQ at RabbitMQ Management Console: http://localhost:15672

## 🤝
