# Sign Out Service

## Overview

The Sign Out service terminates the user's current session and removes authentication tokens. This service should be called when the user explicitly logs out or when the session expires.

---

## Endpoint Details

| Property | Value |
|----------|-------|
| **Endpoint** | `/api/auth/signout` |
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

### Request Body
```typescript
{
  // No body parameters required
}
```

### Example Request

```bash
curl -X POST http://localhost:3000/api/auth/signout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

---

## Outputs

### Success Response (200)

```typescript
{
  message: string;  // "Signed out successfully"
  success: boolean; // true
}
```

### Example Success Response

```json
{
  "message": "Signed out successfully",
  "success": true
}
```

### Error Response (401/500)

```typescript
{
  error: string;  // Error message
}
```

### Error Examples

#### Unauthorized (Missing Token)
```json
{
  "error": "Unauthorized"
}
```

#### Invalid Token
```json
{
  "error": "Invalid token"
}
```

#### Server Error
```json
{
  "error": "Sign out failed"
}
```

---

## Validations

| Field | Validation Rule | Error Message |
|-------|-----------------|---------------|
| `Authorization` | Bearer token must be valid | "Unauthorized" |

---

## Dependencies

| Dependency | Purpose | Version |
|-----------|---------|---------|
| `@supabase/supabase-js` | Auth service | ^2.53.0 |
| `next` | Framework & Runtime | 14+ |

### Environment Variables Required
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
```

---

## Data Flow

```
User clicks Sign Out
        ↓
Frontend collects authorization token
        ↓
POST /api/auth/signout with token
        ↓
Backend verifies token validity
        ↓
Supabase revokes session
        ↓
Success response returned
        ↓
Frontend clears stored token
        ↓
Frontend clears user state
        ↓
Redirect to login page
```

---

## Success Example

### Request
```bash
curl -X POST http://localhost:3000/api/auth/signout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3Byb2plY3QuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDEyMzQ1Njc4OTAiLCJhdWQiOiJodHRwczovL2FwaS5leGFtcGxlLmNvbSIsImV4cCI6MTcwMjM4MDAwMCwiaWF0IjoxNzAyMzc2NDAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c" \
  -H "Content-Type: application/json"
```

### Response
```json
{
  "message": "Signed out successfully",
  "success": true
}
```

---

## Error Example

### Missing Authorization Header
```bash
curl -X POST http://localhost:3000/api/auth/signout \
  -H "Content-Type: application/json"
```

### Response
```json
{
  "error": "Unauthorized"
}
```

---

## Frontend Implementation Example

```typescript
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const useSignOut = () => {
  const router = useRouter();
  const { toast } = useToast();

  const signOut = async () => {
    try {
      const token = localStorage.getItem("access_token");
      
      if (!token) {
        // No token, just redirect
        router.push("/auth");
        return;
      }

      const response = await fetch("/api/auth/signout", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Clear stored token
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        
        // Clear user state (from context/store)
        // setUser(null);
        
        toast({
          title: "Success",
          description: "You have been signed out successfully",
        });
        
        // Redirect to login
        router.push("/auth");
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to sign out",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while signing out",
        variant: "destructive",
      });
    }
  };

  return { signOut };
};

// Usage in a component
const LogoutButton = () => {
  const { signOut } = useSignOut();

  return (
    <button onClick={signOut} className="btn btn-outline">
      Sign Out
    </button>
  );
};

export default LogoutButton;
```

---

## Best Practices

1. **Always clear tokens after sign out**
   ```typescript
   localStorage.removeItem("access_token");
   localStorage.removeItem("refresh_token");
   ```

2. **Clear user state/context**
   ```typescript
   // Using context or state management
   setAuthUser(null);
   ```

3. **Redirect to login page**
   ```typescript
   router.push("/auth");
   ```

4. **Show confirmation to user**
   ```typescript
   toast({ title: "Signed out", description: "Goodbye!" });
   ```

---

## Versioning

| Version | Changes | Date |
|---------|---------|------|
| 1.0.0 | Initial implementation | Dec 2024 |

---

## Related Services

- [Sign In](./SIGNIN.md)
- [Sign Up](./SIGNUP.md)
- [Session](./SESSION.md)

---

**Last Updated**: December 2024  
**Maintained By**: KIIT Saathi Team
