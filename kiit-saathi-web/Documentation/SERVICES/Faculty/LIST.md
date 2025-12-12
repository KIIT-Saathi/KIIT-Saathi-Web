# Faculty Service

## Overview

The Faculty service provides comprehensive information about KIIT faculty members including their profiles, contact information, office hours, courses taught, and research interests. Students can access this information to connect with mentors and faculty advisors.

---

## Endpoint Details

| Property | Value |
|----------|-------|
| **Endpoint** | `/api/faculty/list` |
| **Method** | `GET` |
| **Authentication** | OPTIONAL |
| **Content-Type** | `application/json` |

---

## Inputs

### Query Parameters

```typescript
{
  department?: string;    // OPTIONAL - Faculty department
  designation?: string;   // OPTIONAL - Faculty designation
  search?: string;        // OPTIONAL - Search by name or expertise
  page?: number;          // OPTIONAL - Page number (default: 1)
  limit?: number;         // OPTIONAL - Items per page (default: 20)
}
```

---

## Outputs

### Success Response (200)

```typescript
{
  faculty: {
    id: string;
    name: string;
    designation: string;
    department: string;
    email: string;
    phone?: string;
    office_location: string;
    office_hours: string;
    qualifications: string[];
    expertise: string[];
    image_url: string;
  }[];
  total: number;
  page: number;
}
```

### Example Response

```json
{
  "faculty": [
    {
      "id": "faculty_uuid_1",
      "name": "Dr. Rajesh Kumar",
      "designation": "Associate Professor",
      "department": "Computer Science",
      "email": "rajesh@kiit.edu.in",
      "phone": "+91-9876543210",
      "office_location": "CSE Building, Room 305",
      "office_hours": "Monday-Friday, 2-4 PM",
      "qualifications": ["PhD in CS", "M.Tech"],
      "expertise": ["Machine Learning", "Data Science"],
      "image_url": "https://cdn.example.com/rajesh.jpg"
    }
  ],
  "total": 45,
  "page": 1
}
```

---

## Validations

| Parameter | Validation |
|-----------|-----------|
| `department` | Optional, must be valid department |
| `designation` | Optional, must be valid designation |
| `page` | Optional, must be positive integer |

---

## Dependencies

- `@supabase/supabase-js` - Database operations
- `next` - Framework

---

## Success Example

### Request
```bash
curl -X GET "http://localhost:3000/api/faculty/list?department=Computer%20Science"
```

### Response
```json
{
  "faculty": [
    {
      "id": "faculty_uuid_1",
      "name": "Dr. Rajesh Kumar",
      "designation": "Associate Professor",
      "department": "Computer Science",
      "email": "rajesh@kiit.edu.in",
      "phone": "+91-9876543210",
      "office_location": "CSE Building, Room 305",
      "office_hours": "Monday-Friday, 2-4 PM",
      "qualifications": ["PhD in CS", "M.Tech"],
      "expertise": ["Machine Learning", "Data Science"],
      "image_url": "https://cdn.example.com/rajesh.jpg"
    }
  ],
  "total": 15,
  "page": 1
}
```

---

**Last Updated**: December 2024
