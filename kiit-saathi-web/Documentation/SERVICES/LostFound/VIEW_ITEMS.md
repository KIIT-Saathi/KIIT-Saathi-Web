# View Lost Items Service

## Overview

The View Lost Items service retrieves a list of reported lost items with optional filtering by category, location, or search term. Contact information of reporters is locked unless the item has been unlocked via payment.

---

## Endpoint Details

| Property | Value |
|----------|-------|
| **Endpoint** | `/api/lostfound/get-lost-and-found-list` |
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
  category?: string;      // OPTIONAL - Filter by category
  location?: string;      // OPTIONAL - Filter by location
  search?: string;        // OPTIONAL - Search term
  page?: number;          // OPTIONAL - Page number (default: 1)
  limit?: number;         // OPTIONAL - Items per page (default: 10)
}
```

### Example Query

```
GET /api/lostfound/get-lost-and-found-list?category=bag&limit=20
```

---

## Outputs

### Success Response (200)

```typescript
{
  items: {
    id: string;
    item_name: string;
    description: string;
    location: string;
    category: string;
    images_urls: string[];
    status: "active" | "claimed";
    contact_info_locked: boolean;
    contact_phone?: string;  // Only if unlocked
    contact_email?: string;  // Only if unlocked
    created_at: string;
    reporter_name?: string;  // Only if unlocked
  }[];
  total: number;
  page: number;
  hasMore: boolean;
}
```

### Example Response

```json
{
  "items": [
    {
      "id": "item_uuid_1",
      "item_name": "Blue Nike Backpack",
      "description": "Blue Nike backpack with KIIT ID tag",
      "location": "Hostel 3",
      "category": "bag",
      "images_urls": ["https://cdn.example.com/image1.jpg"],
      "status": "active",
      "contact_info_locked": true,
      "created_at": "2024-12-12T11:00:00Z"
    },
    {
      "id": "item_uuid_2",
      "item_name": "iPhone 13",
      "description": "Black iPhone 13 with case",
      "location": "Library",
      "category": "electronics",
      "images_urls": ["https://cdn.example.com/image2.jpg"],
      "status": "active",
      "contact_info_locked": false,
      "contact_phone": "+91-9876543210",
      "contact_email": "user@kiit.ac.in",
      "reporter_name": "John Doe",
      "created_at": "2024-12-11T09:30:00Z"
    }
  ],
  "total": 45,
  "page": 1,
  "hasMore": true
}
```

---

## Validations

| Parameter | Validation |
|-----------|-----------|
| `Authorization` | Must be valid Bearer token |
| `category` | Optional, must be valid category |
| `page` | Optional, must be positive integer |
| `limit` | Optional, must be 1-100 |

---

## Dependencies

- `@supabase/supabase-js` - Database operations
- `next` - Framework

---

## Success Example

### Request
```bash
curl -X GET "http://localhost:3000/api/lostfound/get-lost-and-found-list?category=bag&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Response
```json
{
  "items": [
    {
      "id": "item_uuid_1",
      "item_name": "Blue Nike Backpack",
      "description": "Blue Nike backpack with KIIT ID tag",
      "location": "Hostel 3",
      "category": "bag",
      "images_urls": ["https://cdn.example.com/image1.jpg"],
      "status": "active",
      "contact_info_locked": true,
      "created_at": "2024-12-12T11:00:00Z"
    }
  ],
  "total": 5,
  "page": 1,
  "hasMore": false
}
```

---

## Related Services

- [Submit Item](./SUBMIT_ITEM.md)
- [Create Unlock Order](./CREATE_UNLOCK_ORDER.md)

---

**Last Updated**: December 2024
