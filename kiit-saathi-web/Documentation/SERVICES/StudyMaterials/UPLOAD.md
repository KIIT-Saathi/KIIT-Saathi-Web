# Upload Study Material Service

## Overview

The Upload Study Material service allows authenticated users to contribute educational materials (notes, previous year question papers, books) to the platform. Materials are reviewed and catalogued by course and semester before becoming available for other students to download.

---

## Endpoint Details

| Property | Value |
|----------|-------|
| **Endpoint** | `/api/study-materials/upload` |
| **Method** | `POST` |
| **Authentication** | REQUIRED (Bearer Token) |
| **Content-Type** | `multipart/form-data` |

---

## Inputs

### Headers
```typescript
{
  "Authorization": "Bearer <access_token>",
  "Content-Type": "multipart/form-data"
}
```

### Request Body (FormData)

```typescript
{
  file: File;              // REQUIRED - PDF file (max 50MB)
  title: string;           // REQUIRED - Material title
  description?: string;    // OPTIONAL - Material description
  course: string;          // REQUIRED - Course code
  semester: number;        // REQUIRED - Semester (1-8)
  type: string;            // REQUIRED - Type (notes, pyq, book)
}
```

---

## Outputs

### Success Response (200)

```typescript
{
  success: true;
  material: {
    id: string;
    title: string;
    course: string;
    semester: number;
    type: string;
    file_url: string;
    status: "pending" | "approved";
    created_at: string;
  };
  message: string;
}
```

### Example Response

```json
{
  "success": true,
  "material": {
    "id": "material_uuid_1",
    "title": "DSA Complete Notes - Semester 3",
    "course": "DSA",
    "semester": 3,
    "type": "notes",
    "file_url": "https://cdn.example.com/dsa_notes.pdf",
    "status": "pending",
    "created_at": "2024-12-12T11:00:00Z"
  },
  "message": "Material uploaded successfully. Pending review."
}
```

---

## Validations

| Field | Validation Rule |
|-------|-----------------|
| `Authorization` | Bearer token must be valid |
| `file` | PDF file, max 50MB |
| `title` | Not empty |
| `course` | Valid course code |
| `semester` | Must be 1-8 |
| `type` | Must be: notes, pyq, or book |

---

## Dependencies

- `@supabase/supabase-js` - Database and storage operations
- Supabase Storage - For file uploads
- `next` - Framework

---

## Success Example

### Request
```bash
curl -X POST http://localhost:3000/api/study-materials/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@dsa_notes.pdf" \
  -F "title=DSA Complete Notes - Semester 3" \
  -F "course=DSA" \
  -F "semester=3" \
  -F "type=notes"
```

### Response
```json
{
  "success": true,
  "material": {
    "id": "material_uuid_1",
    "title": "DSA Complete Notes - Semester 3",
    "course": "DSA",
    "semester": 3,
    "type": "notes",
    "file_url": "https://cdn.example.com/dsa_notes.pdf",
    "status": "pending",
    "created_at": "2024-12-12T11:00:00Z"
  },
  "message": "Material uploaded successfully. Pending review."
}
```

---

## Related Services

- [List Materials](./LIST.md)
- [Material Details](./DETAILS.md)

---

**Last Updated**: December 2024
