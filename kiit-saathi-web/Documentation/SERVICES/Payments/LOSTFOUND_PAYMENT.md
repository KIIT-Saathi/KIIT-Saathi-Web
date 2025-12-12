# Lost & Found Payment Service

## Overview

The Lost & Found Payment service handles payment processing for unlocking lost item reporter contact information using Razorpay. This service generates payment orders and verifies payment completion through Razorpay webhooks.

---

## Endpoint Details

| Property | Value |
|----------|-------|
| **Endpoint** | `/api/payments/lostfound` |
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
  item_id: string;         // REQUIRED - Lost item UUID
  amount: number;          // REQUIRED - Amount in rupees (minimum: 10)
  user_email: string;      // REQUIRED - Payer email
  user_phone: string;      // REQUIRED - Payer phone number
}
```

### Example Request

```json
{
  "item_id": "item_uuid_123",
  "amount": 99,
  "user_email": "user@kiit.ac.in",
  "user_phone": "+91-9876543210"
}
```

---

## Outputs

### Success Response (200)

```typescript
{
  success: true;
  order: {
    id: string;              // Order UUID
    razorpay_order_id: string;
    amount: number;
    currency: string;        // "INR"
    status: string;          // "created"
  };
  payment_url?: string;      // Payment gateway URL
}
```

### Example Response

```json
{
  "success": true,
  "order": {
    "id": "order_uuid_123",
    "razorpay_order_id": "order_1234567890abcd",
    "amount": 99,
    "currency": "INR",
    "status": "created"
  },
  "payment_url": "https://checkout.razorpay.com/..."
}
```

### Error Response (400/401/500)

```typescript
{
  success: false;
  error: string;
}
```

---

## Validations

| Field | Validation Rule |
|-------|-----------------|
| `Authorization` | Bearer token must be valid |
| `item_id` | Must be valid item UUID |
| `amount` | Must be >= 10 rupees |
| `user_email` | Must be valid email format |
| `user_phone` | Must be valid phone format |

---

## Dependencies

- `@supabase/supabase-js` - Database operations
- `razorpay` - Payment gateway integration
- `next` - Framework

---

## Success Example

### Request
```bash
curl -X POST http://localhost:3000/api/payments/lostfound \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "item_id": "item_uuid_123",
    "amount": 99,
    "user_email": "user@kiit.ac.in",
    "user_phone": "+91-9876543210"
  }'
```

### Response
```json
{
  "success": true,
  "order": {
    "id": "order_uuid_123",
    "razorpay_order_id": "order_1234567890abcd",
    "amount": 99,
    "currency": "INR",
    "status": "created"
  },
  "payment_url": "https://checkout.razorpay.com/..."
}
```

---

## Error Examples

### Invalid Amount
```json
{
  "success": false,
  "error": "Amount must be at least 10 rupees"
}
```

### Invalid Email
```json
{
  "success": false,
  "error": "Invalid email format"
}
```

---

## Data Flow

```
Frontend User Click "Unlock"
    ↓
POST /api/payments/lostfound with item_id & amount
    ↓
Create Razorpay Order
    ↓
Store Order in Database
    ↓
Return Razorpay Order ID
    ↓
Open Razorpay Checkout
    ↓
User Completes Payment
    ↓
Razorpay Webhook Callback
    ↓
Verify Signature
    ↓
Update Order Status to "success"
    ↓
Unlock Item Contact Info
    ↓
Success Response to User
```

---

## Related Services

- [Verify Payment](../LostFound/VERIFY_PAYMENT.md)
- [Create Unlock Order](../LostFound/CREATE_UNLOCK_ORDER.md)

---

**Last Updated**: December 2024
