# Group Details Service

## Overview

The Group Details service retrieves comprehensive information about a specific Split Saathi group including all members, group settings, expenses, and settlement history. This service provides the complete view of a group for management and settlement operations.

---

## Endpoint Details

| Property | Value |
|----------|-------|
| **Endpoint** | `/api/split-saathi/group-details` |
| **Method** | `GET` |
| **Authentication** | REQUIRED (Bearer Token) |
| **Content-Type** | `application/json` |

---

## Inputs

### Headers
```typescript
{
  "Authorization": "Bearer <access_token>"
}
```

### Query Parameters

```typescript
{
  group_id: string;       // REQUIRED - UUID of group
}
```

### Example Query

```
GET /api/split-saathi/group-details?group_id=group_uuid_123
```

---

## Outputs

### Success Response (200)

```typescript
{
  group: {
    id: string;
    name: string;
    description?: string;
    created_by: string;
    created_at: string;
    total_members: number;
    total_expenses: number;
    currency: string;
  };
  members: {
    id: string;
    user_id: string;
    user_name: string;
    roll_number: string;
    email: string;
    joined_at: string;
  }[];
  expenses: {
    id: string;
    description: string;
    amount: number;
    paid_by: string;
    created_at: string;
  }[];
  settlements: {
    id: string;
    from: string;
    to: string;
    amount: number;
    status: "pending" | "settled";
    created_at: string;
  }[];
}
```

### Example Response

```json
{
  "group": {
    "id": "group_uuid_123",
    "name": "Hostel 3 Group",
    "description": "Expense sharing for hostel meals",
    "created_by": "user_uuid",
    "created_at": "2024-12-01T10:00:00Z",
    "total_members": 4,
    "total_expenses": 5000,
    "currency": "INR"
  },
  "members": [
    {
      "id": "member_uuid_1",
      "user_id": "user_uuid_1",
      "user_name": "John Doe",
      "roll_number": "B21001",
      "email": "john@kiit.ac.in",
      "joined_at": "2024-12-01T10:00:00Z"
    }
  ],
  "expenses": [
    {
      "id": "expense_uuid_1",
      "description": "Lunch",
      "amount": 1200,
      "paid_by": "John Doe",
      "created_at": "2024-12-10T12:30:00Z"
    }
  ],
  "settlements": [
    {
      "id": "settlement_uuid_1",
      "from": "Jane Smith",
      "to": "John Doe",
      "amount": 300,
      "status": "pending",
      "created_at": "2024-12-11T15:00:00Z"
    }
  ]
}
```

---

## Validations

| Field | Validation Rule |
|-------|-----------------|
| `Authorization` | Bearer token must be valid |
| `group_id` | Must be valid group UUID |
| `Access` | User must be member of group |

---

## Dependencies

- `@supabase/supabase-js` - Database operations
- `next` - Framework

---

## Success Example

### Request
```bash
curl -X GET "http://localhost:3000/api/split-saathi/group-details?group_id=group_uuid_123" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Response
```json
{
  "group": {
    "id": "group_uuid_123",
    "name": "Hostel 3 Group",
    "description": "Expense sharing for hostel meals",
    "created_by": "user_uuid",
    "created_at": "2024-12-01T10:00:00Z",
    "total_members": 4,
    "total_expenses": 5000,
    "currency": "INR"
  },
  "members": [
    {
      "id": "member_uuid_1",
      "user_id": "user_uuid_1",
      "user_name": "John Doe",
      "roll_number": "B21001",
      "email": "john@kiit.ac.in",
      "joined_at": "2024-12-01T10:00:00Z"
    }
  ],
  "expenses": [
    {
      "id": "expense_uuid_1",
      "description": "Lunch",
      "amount": 1200,
      "paid_by": "John Doe",
      "created_at": "2024-12-10T12:30:00Z"
    }
  ],
  "settlements": [
    {
      "id": "settlement_uuid_1",
      "from": "Jane Smith",
      "to": "John Doe",
      "amount": 300,
      "status": "pending",
      "created_at": "2024-12-11T15:00:00Z"
    }
  ]
}
```

---

## Related Services

- [Create Group](./CREATE_GROUP.md)
- [User Groups](./USER_GROUPS.md)
- [Auto Link](./AUTO_LINK.md)

---

**Last Updated**: December 2024
