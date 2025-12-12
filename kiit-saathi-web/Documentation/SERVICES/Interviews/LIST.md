# Interview Deadlines Service

## Overview

The Interview Deadlines service tracks and displays interview schedules for various companies and organizations recruiting on campus. Students can view upcoming interviews, deadlines, eligibility criteria, and register for interview slots.

---

## Endpoint Details

| Property | Value |
|----------|-------|
| **Endpoint** | `/api/interviews/list` |
| **Method** | `GET` |
| **Authentication** | OPTIONAL |
| **Content-Type** | `application/json` |

---

## Inputs

### Query Parameters

```typescript
{
  company?: string;       // OPTIONAL - Filter by company
  status?: string;        // OPTIONAL - Status (upcoming, ongoing, closed)
  deadline_from?: string; // OPTIONAL - Start date (ISO format)
  deadline_to?: string;   // OPTIONAL - End date (ISO format)
  page?: number;          // OPTIONAL - Page number (default: 1)
  limit?: number;         // OPTIONAL - Items per page (default: 15)
}
```

---

## Outputs

### Success Response (200)

```typescript
{
  interviews: {
    id: string;
    company_name: string;
    position: string;
    description: string;
    eligibility_criteria: string;
    application_deadline: string; // ISO timestamp
    interview_date: string;        // ISO timestamp
    ctc: string;
    company_logo: string;
    status: "upcoming" | "ongoing" | "closed";
    registered_count: number;
  }[];
  total: number;
  page: number;
  hasMore: boolean;
}
```

### Example Response

```json
{
  "interviews": [
    {
      "id": "interview_uuid_1",
      "company_name": "Google",
      "position": "Software Engineer",
      "description": "Entry-level SDE position",
      "eligibility_criteria": "CGPA >= 7.0, CSE/IT branch",
      "application_deadline": "2024-12-25T23:59:59Z",
      "interview_date": "2025-01-15T10:00:00Z",
      "ctc": "40 LPA",
      "company_logo": "https://cdn.example.com/google.png",
      "status": "upcoming",
      "registered_count": 320
    }
  ],
  "total": 28,
  "page": 1,
  "hasMore": true
}
```

---

## Validations

| Parameter | Validation |
|-----------|-----------|
| `company` | Optional, must be existing company |
| `status` | Optional, must be: upcoming, ongoing, closed |
| `page` | Optional, must be positive integer |

---

## Dependencies

- `@supabase/supabase-js` - Database operations
- `next` - Framework

---

## Success Example

### Request
```bash
curl -X GET "http://localhost:3000/api/interviews/list?status=upcoming"
```

### Response
```json
{
  "interviews": [
    {
      "id": "interview_uuid_1",
      "company_name": "Google",
      "position": "Software Engineer",
      "description": "Entry-level SDE position",
      "eligibility_criteria": "CGPA >= 7.0, CSE/IT branch",
      "application_deadline": "2024-12-25T23:59:59Z",
      "interview_date": "2025-01-15T10:00:00Z",
      "ctc": "40 LPA",
      "company_logo": "https://cdn.example.com/google.png",
      "status": "upcoming",
      "registered_count": 320
    }
  ],
  "total": 15,
  "page": 1,
  "hasMore": false
}
```

---

## Related Services

- [Interview Details](./DETAILS.md)
- [Register Interview](./REGISTER.md)

---

**Last Updated**: December 2024
