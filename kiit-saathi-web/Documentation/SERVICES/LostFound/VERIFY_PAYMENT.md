# Verify Lost & Found Payment Service

## Overview

The Verify Lost & Found Payment service confirms payment for unlocking a lost item's reporter contact information. After successful payment verification, the item's contact information is unlocked and the reporter's details become visible to the purchaser.

---

## Endpoint Details

| Property | Value |
|----------|-------|
| **Endpoint** | `/api/lostfound/verify-payment` |
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
  order_id: string;        // REQUIRED - Order UUID from create-unlock-order
  razorpay_payment_id: string;  // REQUIRED - Payment ID from Razorpay
  razorpay_signature: string;   // REQUIRED - Signature from Razorpay webhook
}
```

### Example Request

```json
{
  "order_id": "order_uuid_123",
  "razorpay_payment_id": "pay_1234567890",
  "razorpay_signature": "9ef4dffbfd84f1318f6739a3ce19f9d85851857ae648f114332d8401e0949a"
}
```

---

## Outputs

### Success Response (200)

```typescript
{
  success: true;
  message: string;
  item_details: {
    reporter_name: string;
    reporter_email: string;
    reporter_phone: string;
  };
}
```

### Example Response

```json
{
  "success": true,
  "message": "Payment verified successfully. Contact information unlocked.",
  "item_details": {
    "reporter_name": "John Doe",
    "reporter_email": "john@kiit.ac.in",
    "reporter_phone": "+91-9876543210"
  }
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
| `order_id` | Must be valid order UUID |
| `razorpay_payment_id` | Must match Razorpay records |
| `razorpay_signature` | Must be valid signature from Razorpay |

---

## Dependencies

- `@supabase/supabase-js` - Database operations
- `razorpay` - Payment gateway verification
- `crypto` - Signature verification
- `next` - Framework

---

## Success Example

### Request
```bash
curl -X POST http://localhost:3000/api/lostfound/verify-payment \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": "order_uuid_123",
    "razorpay_payment_id": "pay_1234567890",
    "razorpay_signature": "9ef4dffbfd84f1318f6739a3ce19f9d85851857ae648f114332d8401e0949a"
  }'
```

### Response
```json
{
  "success": true,
  "message": "Payment verified successfully. Contact information unlocked.",
  "item_details": {
    "reporter_name": "John Doe",
    "reporter_email": "john@kiit.ac.in",
    "reporter_phone": "+91-9876543210"
  }
}
```

---

## Related Services

- [Create Unlock Order](./CREATE_UNLOCK_ORDER.md)
- [Contact Details](./CONTACT_DETAILS.md)

---

**Last Updated**: December 2024
