# Study Materials Service

## Overview

The Study Materials service manages sharing and retrieving educational resources like notes, books, previous year question papers, and study guides among KIIT students. Users can upload, browse, and download materials organized by course and semester.

---

## Endpoint Details

| Property | Value |
|----------|-------|
| **Endpoint** | `/api/study-materials/list` |
| **Method** | `GET` |
| **Authentication** | OPTIONAL (works for both guest and authenticated) |
| **Content-Type** | `application/json` |

---

## Inputs

### Query Parameters

```typescript
{
  course?: string;        // OPTIONAL - Filter by course
  semester?: string;      // OPTIONAL - Filter by semester
  type?: string;          // OPTIONAL - Material type (notes, pyq, book)
  search?: string;        // OPTIONAL - Search term
  page?: number;          // OPTIONAL - Page number (default: 1)
  limit?: number;         // OPTIONAL - Items per page (default: 20)
}
```

### Example Query

```
GET /api/study-materials/list?course=DSA&semester=3
```

---

## Outputs

### Success Response (200)

```typescript
{
  materials: {
    id: string;
    title: string;
    description: string;
    course: string;
    semester: number;
    type: "notes" | "pyq" | "book";
    file_url: string;
    uploaded_by: string;
    downloads: number;
    rating: number;
    created_at: string;
  }[];
  total: number;
  page: number;
  hasMore: boolean;
}
```

### Example Response

```json
{
  "materials": [
    {
      "id": "material_uuid_1",
      "title": "DSA Complete Notes - Semester 3",
      "description": "Comprehensive notes covering all DSA topics",
      "course": "DSA",
      "semester": 3,
      "type": "notes",
      "file_url": "https://cdn.example.com/dsa_notes.pdf",
      "uploaded_by": "John Doe",
      "downloads": 245,
      "rating": 4.5,
      "created_at": "2024-12-01T10:00:00Z"
    }
  ],
  "total": 42,
  "page": 1,
  "hasMore": true
}
```

---

## Validations

| Parameter | Validation |
|-----------|-----------|
| `course` | Optional, must be valid course |
| `semester` | Optional, must be 1-8 |
| `type` | Optional, must be one of: notes, pyq, book |
| `page` | Optional, must be positive integer |

---

## Dependencies

- `@supabase/supabase-js` - Database operations
- Supabase Storage - For file URLs
- `next` - Framework

---

## Success Example

### Request
```bash
curl -X GET "http://localhost:3000/api/study-materials/list?course=DSA&semester=3" \
  -H "Content-Type: application/json"
```

### Response
```json
{
  "materials": [
    {
      "id": "material_uuid_1",
      "title": "DSA Complete Notes - Semester 3",
      "description": "Comprehensive notes covering all DSA topics",
      "course": "DSA",
      "semester": 3,
      "type": "notes",
      "file_url": "https://cdn.example.com/dsa_notes.pdf",
      "uploaded_by": "John Doe",
      "downloads": 245,
      "rating": 4.5,
      "created_at": "2024-12-01T10:00:00Z"
    }
  ],
  "total": 5,
  "page": 1,
  "hasMore": false
}
```

---

## Related Services

- [Upload Material](./UPLOAD.md)
- [Material Details](./DETAILS.md)

---

**Last Updated**: December 2024
