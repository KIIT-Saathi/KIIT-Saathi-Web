# KIIT Societies Service

## Overview

The KIIT Societies service provides comprehensive information about all clubs and societies on campus including their profiles, members, events, and interview schedules. Students can discover societies and learn about membership opportunities.

---

## Endpoint Details

| Property | Value |
|----------|-------|
| **Endpoint** | `/api/kiit-societies/list` |
| **Method** | `GET` |
| **Authentication** | OPTIONAL |
| **Content-Type** | `application/json` |

---

## Inputs

### Query Parameters

```typescript
{
  category?: string;      // OPTIONAL - Society category (technical, cultural, sports)
  search?: string;        // OPTIONAL - Search by name
  page?: number;          // OPTIONAL - Page number (default: 1)
  limit?: number;         // OPTIONAL - Items per page (default: 12)
}
```

---

## Outputs

### Success Response (200)

```typescript
{
  societies: {
    id: string;
    name: string;
    category: string;
    description: string;
    logo_url: string;
    member_count: number;
    founded_year: number;
    contact_email: string;
    contact_person: string;
    social_links: {
      instagram?: string;
      facebook?: string;
      linkedin?: string;
    };
  }[];
  total: number;
  page: number;
  hasMore: boolean;
}
```

### Example Response

```json
{
  "societies": [
    {
      "id": "society_uuid_1",
      "name": "Code Club",
      "category": "technical",
      "description": "Platform for programming enthusiasts",
      "logo_url": "https://cdn.example.com/codeclub.png",
      "member_count": 250,
      "founded_year": 2015,
      "contact_email": "codeclub@kiit.ac.in",
      "contact_person": "John Doe",
      "social_links": {
        "instagram": "https://instagram.com/codeclub",
        "facebook": "https://facebook.com/codeclub"
      }
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
| `category` | Optional, must be valid category |
| `page` | Optional, must be positive integer |

---

## Dependencies

- `@supabase/supabase-js` - Database operations
- `next` - Framework

---

## Success Example

### Request
```bash
curl -X GET "http://localhost:3000/api/kiit-societies/list?category=technical"
```

### Response
```json
{
  "societies": [
    {
      "id": "society_uuid_1",
      "name": "Code Club",
      "category": "technical",
      "description": "Platform for programming enthusiasts",
      "logo_url": "https://cdn.example.com/codeclub.png",
      "member_count": 250,
      "founded_year": 2015,
      "contact_email": "codeclub@kiit.ac.in",
      "contact_person": "John Doe",
      "social_links": {
        "instagram": "https://instagram.com/codeclub",
        "facebook": "https://facebook.com/codeclub"
      }
    }
  ],
  "total": 8,
  "page": 1,
  "hasMore": false
}
```

---

## Related Services

- [Society Details](./DETAILS.md)
- [Join Society](./JOIN.md)

---

**Last Updated**: December 2024
