# Create Unlock Order Service

## Overview

The Create Unlock Order service creates a payment order for unlocking a lost item's reporter contact information. When a user wants to contact the reporter of a lost item, they must create an unlock order and complete the payment. Once payment is verified, the reporter's contact details become visible.

---

## Endpoint Details

| Property | Value |
|----------|-------|
| **Endpoint** | `/api/lostfound/create-unlock-order` |
| **Method** | `POST` |
| **Authentication** | REQUIRED (Bearer Token) |
| **Content-Type** | `application/json` |

---

## Inputs

### Headers
```typescript
{
  "Authorization": "Bearer <access_token>",
  "Content-Type": "application/json"
}
```

### Request Body Schema

```typescript
{
  item_id: string;         // REQUIRED - UUID of lost item
  amount: number;          // REQUIRED - Amount to pay (in rupees)
}
```

### Example Request

```json
{
  "item_id": "item_uuid_123",
  "amount": 99
}
```

---

## Outputs

### Success Response (200)

```typescript
{
  order: {
    id: string;              // Order UUID
    user_id: string;         // Requester's user ID
    item_id: string;         // Lost item ID
    amount: number;          // Amount in rupees
    status: "pending";       // Initial status
    razorpay_order_id: string;
    created_at: string;      // ISO timestamp
  };
}
```

### Example Response

```json
{
  "order": {
    "id": "order_uuid_123",
    "user_id": "user_uuid",
    "item_id": "item_uuid_123",
    "amount": 99,
    "status": "pending",
    "razorpay_order_id": "order_1234567890",
    "created_at": "2024-12-12T11:15:00Z"
  }
}
```

---

## Validations

| Field | Validation Rule |
|-------|-----------------|
| `Authorization` | Bearer token must be valid |
| `item_id` | Must be valid item UUID |
| `amount` | Must be positive number > 0 |

---

## Dependencies

- `@supabase/supabase-js` - Database operations
- `razorpay` - Payment gateway
- `next` - Framework

---

## Success Example

### Request
```bash
curl -X POST http://localhost:3000/api/lostfound/create-unlock-order \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "item_id": "item_uuid_123",
    "amount": 99
  }'
```

### Response
```json
{
  "order": {
    "id": "order_uuid_123",
    "user_id": "user_uuid",
    "item_id": "item_uuid_123",
    "amount": 99,
    "status": "pending",
    "razorpay_order_id": "order_1234567890",
    "created_at": "2024-12-12T11:15:00Z"
  }
}
```

---

## Related Services

- [Verify Payment](./VERIFY_PAYMENT.md)
- [View Items](./VIEW_ITEMS.md)

---

**Last Updated**: December 2024
