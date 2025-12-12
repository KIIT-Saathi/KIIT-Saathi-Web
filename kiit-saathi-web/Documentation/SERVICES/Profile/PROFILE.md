# User Profile Service

## Overview

The Profile service manages user profile information including personal details, contact information, and preferences. Users can retrieve and update their profile data after authentication.

---

## Endpoint Details

| Property | Value |
|----------|-------|
| **Endpoint** | `/api/profile` |
| **Method** | `GET` / `PUT` |
| **Authentication** | REQUIRED (Bearer Token) |
| **Content-Type** | `application/json` |

---

## Inputs (PUT)

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
  phone?: string;         // OPTIONAL - Phone number
  bio?: string;           // OPTIONAL - User biography
  avatar_url?: string;    // OPTIONAL - Avatar image URL
  department?: string;    // OPTIONAL - Department
  batch?: string;         // OPTIONAL - Batch year
  roll_number?: string;   // OPTIONAL - Roll number
}
```

### Example Request

```json
{
  "phone": "+91-9876543210",
  "bio": "Computer Science Student",
  "department": "CSE",
  "batch": "2024"
}
```

---

## Outputs

### Success Response (200)

```typescript
{
  profile: {
    id: string;              // Profile UUID
    user_id: string;         // User ID
    phone: string | null;
    bio: string | null;
    avatar_url: string | null;
    department: string | null;
    batch: string | null;
    created_at: string;      // ISO timestamp
    updated_at: string;      // ISO timestamp
  };
}
```

### Example Success Response

```json
{
  "profile": {
    "id": "profile_uuid",
    "user_id": "user_uuid",
    "phone": "+91-9876543210",
    "bio": "Computer Science Student",
    "avatar_url": null,
    "department": "CSE",
    "batch": "2024",
    "created_at": "2024-12-01T10:00:00Z",
    "updated_at": "2024-12-12T14:30:00Z"
  }
}
```

### Error Response (400/401/500)

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
| `phone` | Optional, any format |
| `bio` | Optional, max 500 characters |
| `department` | Optional, valid department |
| `batch` | Optional, valid batch year |

---

## Dependencies

- `@supabase/supabase-js` - Database operations
- `next` - Framework

---

## Success Example

### Request
```bash
curl -X PUT http://localhost:3000/api/profile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+91-9876543210",
    "bio": "CS Student",
    "department": "CSE"
  }'
```

### Response
```json
{
  "profile": {
    "id": "profile_uuid",
    "user_id": "user_uuid",
    "phone": "+91-9876543210",
    "bio": "CS Student",
    "department": "CSE",
    "batch": null,
    "avatar_url": null,
    "created_at": "2024-12-01T10:00:00Z",
    "updated_at": "2024-12-12T14:30:00Z"
  }
}
```

---

## Related Services

- [Ensure User](./ENSURE_USER.md)
- [Sign In](../Auth/SIGNIN.md)

---

**Last Updated**: December 2024
