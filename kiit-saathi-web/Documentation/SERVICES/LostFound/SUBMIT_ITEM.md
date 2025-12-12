# Submit Lost Item Service

## Overview

The Submit Lost Item service allows users to report lost items on campus. Users can provide detailed descriptions, upload photos, and specify the location where the item was lost. The item is then listed in the Lost & Found database with the reporter's contact information hidden until someone pays to unlock it.

---

## Endpoint Details

| Property | Value |
|----------|-------|
| **Endpoint** | `/api/lostfound/submit-lost-item-application` |
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
  itemName: string;        // REQUIRED - Name/type of lost item
  description: string;     // REQUIRED - Detailed description
  location: string;        // REQUIRED - Where item was lost
  category: string;        // REQUIRED - Category (bag, electronics, etc.)
  images?: string[];       // OPTIONAL - Array of image URLs
}
```

### Example Request

```json
{
  "itemName": "Blue Nike Backpack",
  "description": "Blue Nike backpack with KIIT ID tag, contains laptop charger",
  "location": "Hostel 3, near room 302",
  "category": "bag",
  "images": ["https://cdn.example.com/image1.jpg"]
}
```

---

## Outputs

### Success Response (200)

```typescript
{
  item: {
    id: string;              // Item UUID
    user_id: string;         // Reporter's user ID
    item_name: string;
    description: string;
    location: string;
    category: string;
    images_urls: string[];
    status: "active";        // Current status
    contact_info_locked: true;
    created_at: string;      // ISO timestamp
  };
  message: string;
}
```

### Example Response

```json
{
  "item": {
    "id": "item_uuid",
    "user_id": "user_uuid",
    "item_name": "Blue Nike Backpack",
    "description": "Blue Nike backpack with KIIT ID tag",
    "location": "Hostel 3, near room 302",
    "category": "bag",
    "images_urls": ["https://cdn.example.com/image1.jpg"],
    "status": "active",
    "contact_info_locked": true,
    "created_at": "2024-12-12T11:00:00Z"
  },
  "message": "Lost item reported successfully"
}
```

---

## Validations

| Field | Validation Rule |
|-------|-----------------|
| `Authorization` | Bearer token must be valid |
| `itemName` | Must not be empty |
| `description` | Must not be empty |
| `location` | Must not be empty |
| `category` | Must be valid category |
| `images` | Optional, array of URLs |

---

## Dependencies

- `@supabase/supabase-js` - Database operations
- Supabase Storage - For image URLs
- `next` - Framework

---

## Success Example

### Request
```bash
curl -X POST http://localhost:3000/api/lostfound/submit-lost-item-application \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "itemName": "Blue Nike Backpack",
    "description": "Blue Nike backpack with KIIT ID tag",
    "location": "Hostel 3, Room 302",
    "category": "bag",
    "images": ["https://cdn.example.com/image1.jpg"]
  }'
```

### Response
```json
{
  "item": {
    "id": "item_uuid_123",
    "user_id": "user_uuid",
    "item_name": "Blue Nike Backpack",
    "description": "Blue Nike backpack with KIIT ID tag",
    "location": "Hostel 3, Room 302",
    "category": "bag",
    "images_urls": ["https://cdn.example.com/image1.jpg"],
    "status": "active",
    "contact_info_locked": true,
    "created_at": "2024-12-12T11:00:00Z"
  },
  "message": "Lost item reported successfully"
}
```

---

## Related Services

- [View Items](./VIEW_ITEMS.md)
- [Create Unlock Order](./CREATE_UNLOCK_ORDER.md)

---

**Last Updated**: December 2024
