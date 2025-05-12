# Mini InstaPay Documentation

This documentation provides a comprehensive guide to the Mini InstaPay platform, including its architecture, components, setup instructions, and deployment options.

## Table of Contents

1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Component Documentation](#component-documentation)
4. [Development Environment Setup](#development-environment-setup)
5. [Deployment Options](#deployment-options)
6. [API Documentation](#api-documentation)
7. [Troubleshooting](#troubleshooting)

## Project Overview

Mini InstaPay is a microservices-based payment platform that allows users to register, login, check balances, send money to other users, and view transaction history. The system is built using a modern tech stack including Node.js, Express, MongoDB, React, and can be deployed using Docker or Kubernetes.

### Key Features

- User registration and authentication
- Balance checking
- Money transfers between users
- Transaction history
- Email notifications for transactions

## System Architecture

The system follows a microservices architecture with the following components:

- **Client**: React-based frontend application
- **User Service**: Handles user authentication and profile management
- **Transaction Service**: Manages money transfers and transaction history
- **Notification Service**: Sends email notifications for transactions
- **MongoDB**: Database for storing user and transaction data

![Architecture Diagram](./images/architecture.png)

## Component Documentation

Detailed documentation for each component can be found in their respective folders:

- [Client Documentation](./client.md)
- [User Service Documentation](./user-service.md)
- [Transaction Service Documentation](./transaction-service.md)
- [Notification Service Documentation](./notification-service.md)
- [Database Schema](./database-schema.md)