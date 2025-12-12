# User Groups - Split Saathi Service

## Overview

The User Groups service retrieves all groups that a user is associated with, including groups they created and groups they are members of. The service automatically links users by roll number for group discovery.

---

## Endpoint Details

| Property | Value |
|----------|-------|
| **Endpoint** | `/api/split-saathi/user-groups` |
| **Method** | `POST` |
| **Authentication** | REQUIRED (Bearer Token or userId in body) |
| **Content-Type** | `application/json` |

---

## Inputs

### Headers (Option 1 - Bearer Token)
```typescript
{
  "Authorization": "Bearer <access_token>",
  "Content-Type": "application/json"
}
```

### Request Body (Option 2 - Manual user info)
```typescript
{
  userId?: string;      // OPTIONAL - User ID (if not using token)
  email?: string;       // OPTIONAL - User email (if not using token)
}
```

### Example Request

```bash
# Using Bearer Token
POST /api/split-saathi/user-groups
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OR using request body
{
  "userId": "user_123456",
  "email": "2105555@kiit.ac.in"
}
```

---

## Outputs

### Success Response (200)

```typescript
Array<{
  id: string;              // Group ID
  name: string;            // Group name
  description: string | null;
  currency: string;        // Currency symbol
  created_by: string;      // Creator user ID
  created_at: string;      // ISO timestamp
  // Additional fields from group relationships
}>
```

### Example Success Response

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Hostel Room Expenses",
    "description": "Splitting expenses for room 302",
    "currency": "₹",
    "created_by": "user_123456",
    "created_at": "2024-12-01T09:15:00Z"
  },
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "name": "Class Project Group",
    "description": "College project expenses",
    "currency": "₹",
    "created_by": "user_789012",
    "created_at": "2024-11-15T14:22:00Z"
  }
]
```

### Error Response (400/500)

```typescript
{
  error: string;  // Error description
}
```

### Error Examples

#### Missing User Information
```json
{
  "error": "Missing user information"
}
```

#### Database Error
```json
{
  "error": "Failed to load user groups"
}
```

---

## Validations

| Field | Validation Rule | Error Message |
|-------|-----------------|---------------|
| `Authorization` OR (`userId` + `email`) | Must have auth info | "Missing user information" |
| `email` | Used to extract roll number | Automatic parsing |

---

## Dependencies

| Dependency | Purpose | Version |
|-----------|---------|---------|
| `@supabase/supabase-js` | Database operations | ^2.53.0 |
| `next` | Framework & Runtime | 14+ |

### Database Tables
- `groups` - Group information
- `group_members` - Group membership records

### Environment Variables Required
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_key
```

---

## Data Flow

```
User Request with Authorization
        ↓
Extract user from Bearer token OR request body
        ↓
POST /api/split-saathi/user-groups
        ↓
Extract roll number from email (e.g., "2105555" from "2105555@kiit.ac.in")
        ↓
Query groups created by user
        ↓
Query groups where user is a member (via roll number)
        ↓
Merge and deduplicate results
        ↓
Return combined group list
```

---

## Success Example

### Request with Bearer Token
```bash
curl -X POST http://localhost:3000/api/split-saathi/user-groups \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

### Request with Body
```bash
curl -X POST http://localhost:3000/api/split-saathi/user-groups \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_123456",
    "email": "2105555@kiit.ac.in"
  }'
```

### Response
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Hostel Room Expenses",
    "description": "Splitting expenses for room 302",
    "currency": "₹",
    "created_by": "user_123456",
    "created_at": "2024-12-01T09:15:00Z"
  },
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "name": "Class Project Group",
    "description": "College project expenses",
    "currency": "₹",
    "created_by": "user_789012",
    "created_at": "2024-11-15T14:22:00Z"
  }
]
```

---

## Error Example

### Missing User Information
```bash
curl -X POST http://localhost:3000/api/split-saathi/user-groups \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Response
```json
{
  "error": "Missing user information"
}
```

---

## Frontend Implementation Example

```typescript
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Group {
  id: string;
  name: string;
  description?: string;
  currency: string;
  created_by: string;
  created_at: string;
}

const UserGroupsList = ({ accessToken }: { accessToken: string }) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch("/api/split-saathi/user-groups", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setGroups(data);
        } else {
          const error = await response.json();
          toast({
            title: "Error",
            description: error.error || "Failed to load groups",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred while loading groups",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroups();
  }, [accessToken]);

  if (isLoading) return <div>Loading groups...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Your Groups</h2>
      {groups.length === 0 ? (
        <p>No groups found. Create one to get started!</p>
      ) : (
        <div className="grid gap-4">
          {groups.map((group) => (
            <div key={group.id} className="border rounded p-4">
              <h3 className="text-xl font-semibold">{group.name}</h3>
              <p className="text-gray-600">{group.description}</p>
              <p className="text-sm text-gray-500">
                Currency: {group.currency}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserGroupsList;
```

---

## How Member Linking Works

The service automatically extracts roll numbers from email addresses:
- Email: `2105555@kiit.ac.in`
- Roll Number: `2105555`

When a user is added to a group with their roll number, the `user-groups` endpoint will find that group automatically.

---

## Versioning

| Version | Changes | Date |
|---------|---------|------|
| 1.0.0 | Initial implementation | Dec 2024 |
| 1.1.0 | Added bearer token support | Dec 2024 |

---

## Related Services

- [Create Group](./CREATE_GROUP.md)
- [Group Details](./GROUP_DETAILS.md)
- [Auto Link](./AUTO_LINK.md)

---

**Last Updated**: December 2024  
**Maintained By**: KIIT Saathi Team
