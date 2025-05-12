# Development Environment Setup

This guide will help you set up your development environment for working on the Mini InstaPay platform.

## Prerequisites

- Node.js (v18 or later)
- npm (v9 or later)
- MongoDB (v6 or later)
- Docker (optional, for containerized development)
- Kubernetes (optional, for Kubernetes deployment)

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/BasharMOhamed/mini-instapay.git
cd mini-instapay
```



### 2. Start Services

Open separate terminal windows for each service:

```bash
# Start client
cd client
npm run dev

# Start user service
cd services/user-service
npm start

# Start transaction service
cd services/transaction-service
npm start

# Start notification service
cd services/notification-service
npm start
```

The client will be available at http://localhost:5173

## Docker Development Environment

For a containerized development environment, use Docker Compose:

```bash
# Start all services
docker-compose up

# Start specific services
docker-compose up user-service transaction-service

# Rebuild containers after changes
docker-compose up --build
```

## VS Code Setup

For an optimal development experience with VS Code:

1. Install recommended extensions:
   - ESLint
   - Prettier
   - Docker
   - MongoDB for VS Code

2. Use the provided workspace settings in `.vscode/settings.json`
