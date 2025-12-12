# Events Service

## Overview

The Events service manages campus events including creation, listing, registration, and tracking of various activities like club meetings, workshops, competitions, and seminars. Users can discover events and register their participation.

---

## Endpoint Details

| Property | Value |
|----------|-------|
| **Endpoint** | `/api/events/list` |
| **Method** | `GET` |
| **Authentication** | OPTIONAL |
| **Content-Type** | `application/json` |

---

## Inputs

### Query Parameters

```typescript
{
  category?: string;      // OPTIONAL - Event category (technical, cultural, sports)
  status?: string;        // OPTIONAL - Event status (upcoming, ongoing, completed)
  organizer?: string;     // OPTIONAL - Organizing society/club
  search?: string;        // OPTIONAL - Search term
  page?: number;          // OPTIONAL - Page number (default: 1)
  limit?: number;         // OPTIONAL - Items per page (default: 15)
}
```

---

## Outputs

### Success Response (200)

```typescript
{
  events: {
    id: string;
    title: string;
    description: string;
    date: string;          // ISO timestamp
    location: string;
    category: string;
    organizer: string;
    image_url: string;
    registered_count: number;
    capacity: number;
    status: "upcoming" | "ongoing" | "completed";
  }[];
  total: number;
  page: number;
  hasMore: boolean;
}
```

### Example Response

```json
{
  "events": [
    {
      "id": "event_uuid_1",
      "title": "Code Storm 2024",
      "description": "Annual coding competition",
      "date": "2024-12-20T10:00:00Z",
      "location": "Central Auditorium",
      "category": "technical",
      "organizer": "CSE Society",
      "image_url": "https://cdn.example.com/codestorm.jpg",
      "registered_count": 250,
      "capacity": 500,
      "status": "upcoming"
    }
  ],
  "total": 12,
  "page": 1,
  "hasMore": false
}
```

---

## Validations

| Parameter | Validation |
|-----------|-----------|
| `category` | Optional, must be valid category |
| `status` | Optional, must be: upcoming, ongoing, completed |
| `page` | Optional, must be positive integer |

---

## Dependencies

- `@supabase/supabase-js` - Database operations
- `next` - Framework

---

## Success Example

### Request
```bash
curl -X GET "http://localhost:3000/api/events/list?category=technical"
```

### Response
```json
{
  "events": [
    {
      "id": "event_uuid_1",
      "title": "Code Storm 2024",
      "description": "Annual coding competition",
      "date": "2024-12-20T10:00:00Z",
      "location": "Central Auditorium",
      "category": "technical",
      "organizer": "CSE Society",
      "image_url": "https://cdn.example.com/codestorm.jpg",
      "registered_count": 250,
      "capacity": 500,
      "status": "upcoming"
    }
  ],
  "total": 5,
  "page": 1,
  "hasMore": false
}
```

---

## Related Services

- [Register Event](./REGISTER.md)
- [Event Details](./DETAILS.md)

---

**Last Updated**: December 2024
