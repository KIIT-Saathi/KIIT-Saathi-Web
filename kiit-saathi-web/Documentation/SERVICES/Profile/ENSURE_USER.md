# Ensure User Profile Service

## Overview

The Ensure User service creates a user profile if it doesn't already exist. This is typically called immediately after a user signs up or logs in for the first time to initialize their profile in the database.

---

## Endpoint Details

| Property | Value |
|----------|-------|
| **Endpoint** | `/api/profile/ensure` |
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

### Request Body
```typescript
{
  // No required body parameters
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
    phone: null;
    bio: null;
    avatar_url: null;
    department: null;
    batch: null;
    created_at: string;      // ISO timestamp
    updated_at: string;      // ISO timestamp
  };
  created: boolean;          // true if new profile created
}
```

### Example Response

```json
{
  "profile": {
    "id": "profile_uuid",
    "user_id": "user_uuid",
    "phone": null,
    "bio": null,
    "avatar_url": null,
    "department": null,
    "batch": null,
    "created_at": "2024-12-12T10:35:00Z",
    "updated_at": "2024-12-12T10:35:00Z"
  },
  "created": true
}
```

---

## Validations

| Field | Validation |
|-------|-----------|
| `Authorization` | Must be valid Bearer token |

---

## Dependencies

- `@supabase/supabase-js` - Database operations
- `next` - Framework

---

## Success Example

### Request
```bash
curl -X POST http://localhost:3000/api/profile/ensure \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

### Response
```json
{
  "profile": {
    "id": "profile_uuid",
    "user_id": "user_uuid",
    "phone": null,
    "bio": null,
    "avatar_url": null,
    "department": null,
    "batch": null,
    "created_at": "2024-12-12T10:35:00Z",
    "updated_at": "2024-12-12T10:35:00Z"
  },
  "created": true
}
```

---

## Related Services

- [Profile](./PROFILE.md)

---

**Last Updated**: December 2024
