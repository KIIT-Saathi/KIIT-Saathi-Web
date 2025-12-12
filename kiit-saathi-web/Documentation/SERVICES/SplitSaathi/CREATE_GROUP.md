# Create Group - Split Saathi Service

## Overview

The Create Group service allows users to create expense sharing groups in the Split Saathi application. This is the first step in creating a group for splitting expenses among friends, classmates, or roommates.

---

## Endpoint Details

| Property | Value |
|----------|-------|
| **Endpoint** | `/api/split-saathi/create-group` |
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
  groupForm: {
    name: string;              // REQUIRED - Group name
    description?: string;      // OPTIONAL - Group description
    currency?: string;         // OPTIONAL - Currency symbol (default: ₹)
    members: Array<{
      name: string;            // REQUIRED - Member name
      rollNumber?: string;     // OPTIONAL - KIIT roll number
    }>;
  };
}
```

### Example Request

```json
{
  "groupForm": {
    "name": "Hostel Room Expenses",
    "description": "Splitting expenses for room 302",
    "currency": "₹",
    "members": [
      {
        "name": "Rahul Kumar",
        "rollNumber": "2105555"
      },
      {
        "name": "Priya Singh",
        "rollNumber": "2105556"
      },
      {
        "name": "Amit Patel",
        "rollNumber": "2105557"
      }
    ]
  }
}
```

---

## Outputs

### Success Response (200)

```typescript
{
  message: string;      // "Group created successfully"
  group: {
    id: string;         // Group UUID
    name: string;       // Group name
    description: string | null;
    currency: string;   // Currency symbol
    created_by: string; // Creator user ID
    created_at: string; // ISO timestamp
  };
  memberCount: number;  // Number of members added
}
```

### Example Success Response

```json
{
  "message": "Group created successfully",
  "group": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Hostel Room Expenses",
    "description": "Splitting expenses for room 302",
    "currency": "₹",
    "created_by": "user_123456",
    "created_at": "2024-12-12T10:30:00Z"
  },
  "memberCount": 3
}
```

### Error Response (400/401/500)

```typescript
{
  error: string;  // Error description
}
```

### Error Examples

#### Unauthorized (Missing Token)
```json
{
  "error": "Unauthorized"
}
```

#### Missing Group Name
```json
{
  "error": "Missing required fields"
}
```

#### No Members
```json
{
  "error": "At least one member with a name is required"
}
```

#### Server Error
```json
{
  "error": "Failed to create group"
}
```

---

## Validations

| Field | Validation Rule | Error Message |
|-------|-----------------|---------------|
| `Authorization` | Bearer token must be valid | "Unauthorized" |
| `groupForm.name` | Must not be empty/whitespace | "Missing required fields" |
| `groupForm.members` | Must have at least 1 member | "At least one member with a name is required" |
| `member.name` | Must not be empty/whitespace | Filtered out during processing |
| `member.rollNumber` | Optional - KIIT format | Trimmed if provided |

---

## Dependencies

| Dependency | Purpose | Version |
|-----------|---------|---------|
| `@supabase/supabase-js` | Database operations | ^2.53.0 |
| `next` | Framework & Runtime | 14+ |

### Database Tables
- `groups` - Stores group information
- `group_members` - Stores member information

### Environment Variables Required
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_key
```

---

## Data Flow

```
User Input (Group details + Members)
        ↓
Frontend Validation
        ↓
POST /api/split-saathi/create-group
        ↓
Extract user from Authorization header
        ↓
Validate group name and members
        ↓
Insert group into 'groups' table
        ↓
Insert members into 'group_members' table
        ↓
Return success response
        ↓
Frontend updates UI and shows success message
```

---

## Success Example

### Request
```bash
curl -X POST http://localhost:3000/api/split-saathi/create-group \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "groupForm": {
      "name": "Hostel Room Expenses",
      "description": "Splitting expenses for room 302",
      "currency": "₹",
      "members": [
        {"name": "Rahul Kumar", "rollNumber": "2105555"},
        {"name": "Priya Singh", "rollNumber": "2105556"},
        {"name": "Amit Patel", "rollNumber": "2105557"}
      ]
    }
  }'
```

### Response
```json
{
  "message": "Group created successfully",
  "group": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Hostel Room Expenses",
    "description": "Splitting expenses for room 302",
    "currency": "₹",
    "created_by": "user_123456",
    "created_at": "2024-12-12T10:30:00Z"
  },
  "memberCount": 3
}
```

---

## Error Example

### No Members Provided
```bash
curl -X POST http://localhost:3000/api/split-saathi/create-group \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "groupForm": {
      "name": "Hostel Room Expenses",
      "members": []
    }
  }'
```

### Response
```json
{
  "error": "At least one member with a name is required"
}
```

---

## Frontend Implementation Example

```typescript
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";

interface GroupMember {
  name: string;
  rollNumber?: string;
}

interface GroupFormData {
  name: string;
  description?: string;
  currency: string;
  members: GroupMember[];
}

const CreateGroupForm = ({ accessToken }: { accessToken: string }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (formData: GroupFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/split-saathi/create-group", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ groupForm: formData }),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: `Group "${formData.name}" created with ${result.memberCount} members!`,
        });
        // Redirect to group details page
        // router.push(`/split-saathi/${result.group.id}`);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create group",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while creating the group",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      // Collect form data and call onSubmit
    }}>
      {/* Form fields for group name, description, currency, members */}
    </form>
  );
};

export default CreateGroupForm;
```

---

## Versioning

| Version | Changes | Date |
|---------|---------|------|
| 1.0.0 | Initial implementation | Dec 2024 |

---

## Related Services

- [User Groups](./USER_GROUPS.md)
- [Group Details](./GROUP_DETAILS.md)
- [Auto Link](./AUTO_LINK.md)

---

**Last Updated**: December 2024  
**Maintained By**: KIIT Saathi Team
