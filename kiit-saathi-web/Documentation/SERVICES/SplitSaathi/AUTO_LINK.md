# Auto Link Group Members Service

## Overview

The Auto Link Group Members service automatically adds users to a Split Saathi group based on their roll numbers. Users can join groups of peers without manually searching and adding each member, promoting automatic discovery and group formation among students with similar roll numbers or batches.

---

## Endpoint Details

| Property | Value |
|----------|-------|
| **Endpoint** | `/api/split-saathi/auto-link` |
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
  group_id: string;        // REQUIRED - UUID of group to join
}
```

### Example Request

```json
{
  "group_id": "group_uuid_123"
}
```

---

## Outputs

### Success Response (200)

```typescript
{
  success: true;
  message: string;
  members: {
    id: string;
    user_id: string;
    user_name: string;
    roll_number: string;
    joined_at: string;
  }[];
  total_members: number;
}
```

### Example Response

```json
{
  "success": true,
  "message": "Auto-linked members added successfully",
  "members": [
    {
      "id": "member_uuid_1",
      "user_id": "user_uuid_1",
      "user_name": "John Doe",
      "roll_number": "B21001",
      "joined_at": "2024-12-12T10:00:00Z"
    },
    {
      "id": "member_uuid_2",
      "user_id": "user_uuid_2",
      "user_name": "Jane Smith",
      "roll_number": "B21002",
      "joined_at": "2024-12-12T10:00:00Z"
    }
  ],
  "total_members": 2
}
```

---

## Validations

| Field | Validation Rule |
|-------|-----------------|
| `Authorization` | Bearer token must be valid |
| `group_id` | Must be valid group UUID |
| `User Eligibility` | User roll number must match group criteria |

---

## Dependencies

- `@supabase/supabase-js` - Database operations
- `next` - Framework

---

## Success Example

### Request
```bash
curl -X POST http://localhost:3000/api/split-saathi/auto-link \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "group_id": "group_uuid_123"
  }'
```

### Response
```json
{
  "success": true,
  "message": "Auto-linked members added successfully",
  "members": [
    {
      "id": "member_uuid_1",
      "user_id": "user_uuid_1",
      "user_name": "John Doe",
      "roll_number": "B21001",
      "joined_at": "2024-12-12T10:00:00Z"
    }
  ],
  "total_members": 1
}
```

---

## Error Example

### Request (User Not Eligible)
```bash
curl -X POST http://localhost:3000/api/split-saathi/auto-link \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "group_id": "group_uuid_123"
  }'
```

### Response
```json
{
  "success": false,
  "error": "Your roll number does not match this group's criteria"
}
```

---

## Related Services

- [Create Group](./CREATE_GROUP.md)
- [User Groups](./USER_GROUPS.md)
- [Group Details](./GROUP_DETAILS.md)

---

**Last Updated**: December 2024
