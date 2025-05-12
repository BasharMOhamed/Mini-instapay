# API Documentation

This document provides details about the APIs exposed by each service in the Mini InstaPay platform.

## User Service API

Base URL: `http://localhost:5000/user`

### Authentication Endpoints

#### Register a new user

```
POST /register
```

Request body:
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

Response:
```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "60d21b4667d0d8992e610c85",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

#### Login

```
POST /login
```

Request body:
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

Response:
```json
{
  "message": "Login successful",
  "user": {
    "_id": "60d21b4667d0d8992e610c85",
    "username": "johndoe",
    "email": "john@example.com",
    "balance": 1000
  }
}
```

#### Get user profile

```
GET /profile
```

Headers:
```
Authorization: Bearer <token>
```

Response:
```json
{
  "user": {
    "_id": "60d21b4667d0d8992e610c85",
    "username": "johndoe",
    "email": "john@example.com",
    "balance": 1000
  }
}
```

## Transaction Service API

Base URL: `http://localhost:5002/transaction`

### Transaction Endpoints

#### Transfer money

```
POST /transfere
```

Headers:
```
Authorization: Bearer <token>
```

Request body:
```json
{
  "to": "60d21b4667d0d8992e610c86",
  "amount": 100
}
```

Response:
```json
{
  "message": "Transfer successful",
  "transaction": {
    "_id": "60d21b4667d0d8992e610c87",
    "from": "60d21b4667d0d8992e610c85",
    "to": "60d21b4667d0d8992e610c86",
    "amount": 100,
    "date": "2023-06-18T12:00:00.000Z"
  }
}
```

#### Get transaction history

```
GET /history
```

Headers:
```
Authorization: Bearer <token>
```

Response:
```json
{
  "transactions": [
    {
      "_id": "60d21b4667d0d8992e610c87",
      "from": {
        "_id": "60d21b4667d0d8992e610c85",
        "username": "johndoe"
      },
      "to": {
        "_id": "60d21b4667d0d8992e610c86",
        "username": "janedoe"
      },
      "amount": 100,
      "date": "2023-06-18T12:00:00.000Z"
    }
  ]
}
```

## Notification Service API

Base URL: `http://localhost:5004`

### Notification Endpoints

#### Send notification

```
POST /notify
```

Request body:
```json
{
  "email": "john@example.com",
  "subject": "Money Received",
  "message": "You have received $100 from Jane Doe",
  "html": "<p>You have received <strong>$100</strong> from Jane Doe</p>"
}
```

Response:
```json
{
  "success": true,
  "message": "Notification sent",
  "messageId": "<1234567890@example.com>"
}
```