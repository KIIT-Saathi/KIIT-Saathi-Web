# Service Visibility Configuration Service

## Overview

The Service Visibility Configuration service manages which services are visible and accessible to different user roles and groups. Admins can control feature visibility, enable/disable services, and manage service availability across the platform.

---

## Endpoint Details

| Property | Value |
|----------|-------|
| **Endpoint** | `/api/service-visibility/config` |
| **Method** | `GET` / `PUT` |
| **Authentication** | REQUIRED (Admin/Bearer Token) |
| **Content-Type** | `application/json` |

---

## Inputs (PUT)

### Headers
```typescript
{
  "Authorization": "Bearer <admin_token>",
  "Content-Type": "application/json"
}
```

### Request Body Schema

```typescript
{
  service_name: string;       // REQUIRED - Service identifier
  is_visible: boolean;        // REQUIRED - Visibility status
  allowed_roles?: string[];   // OPTIONAL - Roles that can access
  maintenance_mode?: boolean; // OPTIONAL - Enable maintenance
  description?: string;       // OPTIONAL - Service description
}
```

---

## Outputs

### Success Response (200)

```typescript
{
  config: {
    service_name: string;
    is_visible: boolean;
    allowed_roles: string[];
    maintenance_mode: boolean;
    updated_at: string;
    updated_by: string;
  };
}
```

### Example Response

```json
{
  "config": {
    "service_name": "split-saathi",
    "is_visible": true,
    "allowed_roles": ["student", "alumni"],
    "maintenance_mode": false,
    "updated_at": "2024-12-12T11:00:00Z",
    "updated_by": "admin_user"
  }
}
```

---

## Validations

| Field | Validation Rule |
|-------|-----------------|
| `Authorization` | Must be valid admin token |
| `service_name` | Must be valid service identifier |
| `is_visible` | Boolean value |
| `allowed_roles` | Optional, must be valid role names |

---

## Dependencies

- `@supabase/supabase-js` - Database operations
- `next` - Framework

---

## Success Example

### Request
```bash
curl -X PUT http://localhost:3000/api/service-visibility/config \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "service_name": "split-saathi",
    "is_visible": true,
    "allowed_roles": ["student", "alumni"],
    "maintenance_mode": false
  }'
```

### Response
```json
{
  "config": {
    "service_name": "split-saathi",
    "is_visible": true,
    "allowed_roles": ["student", "alumni"],
    "maintenance_mode": false,
    "updated_at": "2024-12-12T11:00:00Z",
    "updated_by": "admin_user"
  }
}
```

---

**Last Updated**: December 2024
