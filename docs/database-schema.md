# Database Schema

This document outlines the database schema used in the Mini InstaPay platform.

## MongoDB Collections

The platform uses MongoDB as its database and consists of the following collections:

### Users Collection

Stores user information and account balances.

```javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String (hashed),
  balance: Number,
  createdAt: Date,
  updatedAt: Date
}
```

Indexes:
- `email`: Unique index
- `username`: Unique index

### Transactions Collection

Stores all transaction records between users.

```javascript
{
  _id: ObjectId,
  from: ObjectId (references Users._id),
  to: ObjectId (references Users._id),
  amount: Number,
  status: String (enum: "pending", "completed", "failed"),
  date: Date,
  description: String
}
```

Indexes:
- `from`: Index for faster queries
- `to`: Index for faster queries
- `date`: Index for sorting and filtering

### Notifications Collection

Stores notification records.

```javascript
{
  _id: ObjectId,
  userId: ObjectId (references Users._id),
  type: String (enum: "transfer", "receive", "system"),
  message: String,
  read: Boolean,
  date: Date
}
```

Indexes:
- `userId`: Index for faster queries
- `read`: Index for filtering unread notifications
- `date`: Index for sorting

## Relationships

- A User can have many Transactions (as sender or receiver)
- A User can have many Notifications
- A Transaction is associated with two Users (sender and receiver)

## Data Flow

1. When a user registers, a new document is created in the Users collection with an initial balance.
2. When a transaction occurs:
   - A new document is created in the Transactions collection
   - The balances of the sender and receiver are updated in the Users collection
   - Notifications are created for both the sender and receiver