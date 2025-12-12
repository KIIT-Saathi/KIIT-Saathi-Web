# Get Admin Dashboard Data Service

## Overview

The Get Admin Dashboard Data service provides administrators with comprehensive analytics and management data including user statistics, service usage, recent activities, reports, and system health metrics. This serves as the central hub for admin monitoring and decision-making.

---

## Endpoint Details

| Property | Value |
|----------|-------|
| **Endpoint** | `/api/admin/dashboard` |
| **Method** | `GET` |
| **Authentication** | REQUIRED (Admin/Bearer Token) |
| **Content-Type** | `application/json` |

---

## Inputs

### Headers
```typescript
{
  "Authorization": "Bearer <admin_token>",
}
```

### Query Parameters

```typescript
{
  period?: string;        // OPTIONAL - Time period (today, week, month, year)
  date_from?: string;     // OPTIONAL - Start date (ISO format)
  date_to?: string;       // OPTIONAL - End date (ISO format)
}
```

---

## Outputs

### Success Response (200)

```typescript
{
  dashboard: {
    stats: {
      total_users: number;
      active_users: number;
      total_services_used: number;
      total_revenue: number;
    };
    service_analytics: {
      service_name: string;
      usage_count: number;
      revenue: number;
      active_users: number;
    }[];
    recent_activities: {
      user_name: string;
      service: string;
      action: string;
      timestamp: string;
    }[];
    system_health: {
      status: "healthy" | "warning" | "critical";
      uptime: number;
      response_time: number;
      error_rate: number;
    };
  };
}
```

### Example Response

```json
{
  "dashboard": {
    "stats": {
      "total_users": 1250,
      "active_users": 450,
      "total_services_used": 3200,
      "total_revenue": 125000
    },
    "service_analytics": [
      {
        "service_name": "Split Saathi",
        "usage_count": 850,
        "revenue": 25000,
        "active_users": 150
      },
      {
        "service_name": "Lost & Found",
        "usage_count": 340,
        "revenue": 45000,
        "active_users": 80
      }
    ],
    "recent_activities": [
      {
        "user_name": "John Doe",
        "service": "Split Saathi",
        "action": "Created Group",
        "timestamp": "2024-12-12T11:30:00Z"
      }
    ],
    "system_health": {
      "status": "healthy",
      "uptime": 99.98,
      "response_time": 120,
      "error_rate": 0.02
    }
  }
}
```

---

## Validations

| Field | Validation Rule |
|-------|-----------------|
| `Authorization` | Must be valid admin Bearer token |
| `period` | Optional, must be: today, week, month, year |
| `date_from` | Optional, must be ISO format |
| `date_to` | Optional, must be ISO format |

---

## Dependencies

- `@supabase/supabase-js` - Database operations
- `next` - Framework

---

## Success Example

### Request
```bash
curl -X GET "http://localhost:3000/api/admin/dashboard?period=month" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### Response
```json
{
  "dashboard": {
    "stats": {
      "total_users": 1250,
      "active_users": 450,
      "total_services_used": 3200,
      "total_revenue": 125000
    },
    "service_analytics": [
      {
        "service_name": "Split Saathi",
        "usage_count": 850,
        "revenue": 25000,
        "active_users": 150
      }
    ],
    "recent_activities": [
      {
        "user_name": "John Doe",
        "service": "Split Saathi",
        "action": "Created Group",
        "timestamp": "2024-12-12T11:30:00Z"
      }
    ],
    "system_health": {
      "status": "healthy",
      "uptime": 99.98,
      "response_time": 120,
      "error_rate": 0.02
    }
  }
}
```

---

## Related Services

- [Admin Users](./USERS.md)
- [Admin Reports](./REPORTS.md)

---

**Last Updated**: December 2024
