# Get Reporter Contact Details Service

## Overview

The Get Reporter Contact Details service retrieves the contact information of a lost item's reporter after the contact information has been unlocked via payment verification. This service ensures users can only view contact details after proper payment authorization.

---

## Endpoint Details

| Property | Value |
|----------|-------|
| **Endpoint** | `/api/lostfound/contact-details` |
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
  item_id: string;        // REQUIRED - UUID of lost item
}
```

### Example Query

```
GET /api/lostfound/contact-details?item_id=item_uuid_123
```

---

## Outputs

### Success Response (200)

```typescript
{
  contact_info: {
    reporter_name: string;
    reporter_email: string;
    reporter_phone: string;
    item_id: string;
    item_name: string;
  };
}
```

### Example Response

```json
{
  "contact_info": {
    "reporter_name": "John Doe",
    "reporter_email": "john@kiit.ac.in",
    "reporter_phone": "+91-9876543210",
    "item_id": "item_uuid_123",
    "item_name": "Blue Nike Backpack"
  }
}
```

### Error Response (403/404)

```typescript
{
  error: string;
}
```

---

## Validations

| Field | Validation Rule |
|-------|-----------------|
| `Authorization` | Bearer token must be valid |
| `item_id` | Must be valid item UUID |
| `Payment Status` | Item must be unlocked for current user |

---

## Dependencies

- `@supabase/supabase-js` - Database operations
- `next` - Framework

---

## Success Example

### Request
```bash
curl -X GET "http://localhost:3000/api/lostfound/contact-details?item_id=item_uuid_123" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Response
```json
{
  "contact_info": {
    "reporter_name": "John Doe",
    "reporter_email": "john@kiit.ac.in",
    "reporter_phone": "+91-9876543210",
    "item_id": "item_uuid_123",
    "item_name": "Blue Nike Backpack"
  }
}
```

---

## Error Example

### Request (No Permission)
```bash
curl -X GET "http://localhost:3000/api/lostfound/contact-details?item_id=item_uuid_123" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Response
```json
{
  "error": "Contact information is locked. Purchase unlock to view details."
}
```

---

## Related Services

- [Verify Payment](./VERIFY_PAYMENT.md)
- [View Items](./VIEW_ITEMS.md)

---

**Last Updated**: December 2024
