# Sign In Service

## Overview

The Sign In service authenticates existing users and creates a session. It validates email and password credentials against the Supabase authentication service and returns JWT tokens for session management.

---

## Endpoint Details

| Property | Value |
|----------|-------|
| **Endpoint** | `/api/auth/signin` |
| **Method** | `POST` |
| **Authentication** | Not Required |
| **Content-Type** | `application/json` |

---

## Inputs

### Request Body Schema

```typescript
{
  email: string;        // REQUIRED - User's KIIT email
  password: string;     // REQUIRED - User's password
}
```

### Example Request

```json
{
  "email": "2105555@kiit.ac.in",
  "password": "SecurePassword123!"
}
```

---

## Outputs

### Success Response (200)

```typescript
{
  success: boolean;      // true
  session: {
    access_token: string;    // JWT Token for API requests
    refresh_token: string;   // Token to refresh access token
    expires_in: number;      // Expiry in seconds (default: 3600)
    expires_at: number;      // Unix timestamp
    token_type: string;      // "bearer"
    user: {
      id: string;            // User UUID
      email: string;         // User email
      email_confirmed_at: string | null;
      user_metadata: {
        full_name: string;   // User's full name
      };
      created_at: string;    // Account creation timestamp
    };
  };
}
```

### Example Success Response

```json
{
  "success": true,
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 3600,
    "expires_at": 1702380000,
    "token_type": "bearer",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "2105555@kiit.ac.in",
      "email_confirmed_at": "2024-12-01T10:30:00Z",
      "user_metadata": {
        "full_name": "Rahul Kumar Singh"
      },
      "created_at": "2024-12-01T09:15:00Z"
    }
  }
}
```

### Error Response (400/401)

```typescript
{
  error: string;  // Error message
}
```

### Error Examples

#### Invalid Credentials
```json
{
  "error": "Invalid login credentials"
}
```

#### Email Not Confirmed
```json
{
  "error": "Email not confirmed. Check your inbox for confirmation link."
}
```

#### Account Not Found
```json
{
  "error": "User not found"
}
```

#### Server Error (500)
```json
{
  "error": "Server error"
}
```

---

## Validations

| Field | Validation Rule | Error Message |
|-------|-----------------|---------------|
| `email` | Must not be empty | "Email is required" |
| `email` | Must be valid email format | "Invalid email format" |
| `password` | Must not be empty | "Password is required" |
| `email` + `password` | Must match a registered user | "Invalid login credentials" |
| `email` | Must be confirmed | "Email not confirmed. Check your inbox for confirmation link." |

---

## Dependencies

| Dependency | Purpose | Version |
|-----------|---------|---------|
| `@supabase/supabase-js` | Authentication service | ^2.53.0 |
| `next` | Framework & Runtime | 14+ |

### Environment Variables Required
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

---

## Data Flow

```
User Input (Email, Password)
        ↓
Frontend Validation
        ↓
POST /api/auth/signin
        ↓
Supabase Auth Service
        ↓
Credentials verification against PostgreSQL
        ↓
Generate JWT Tokens
        ↓
Response with session
        ↓
Store tokens (secure httpOnly cookies or localStorage)
        ↓
Frontend redirect to dashboard
```

---

## Success Example

### Request
```bash
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "2105555@kiit.ac.in",
    "password": "SecurePassword123!"
  }'
```

### Response
```json
{
  "success": true,
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3Byb2plY3QuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDEyMzQ1Njc4OTAiLCJhdWQiOiJodHRwczovL2FwaS5leGFtcGxlLmNvbSIsImV4cCI6MTcwMjM4MDAwMCwiaWF0IjoxNzAyMzc2NDAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
    "refresh_token": "refresh_token_value",
    "expires_in": 3600,
    "expires_at": 1702380000,
    "token_type": "bearer",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "2105555@kiit.ac.in",
      "email_confirmed_at": "2024-12-01T10:30:00Z",
      "user_metadata": {
        "full_name": "Rahul Kumar Singh"
      },
      "created_at": "2024-12-01T09:15:00Z"
    }
  }
}
```

---

## Error Example

### Invalid Credentials
```bash
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "2105555@kiit.ac.in",
    "password": "WrongPassword123!"
  }'
```

### Response
```json
{
  "error": "Invalid login credentials"
}
```

---

## Versioning

| Version | Changes | Date |
|---------|---------|------|
| 1.0.0 | Initial implementation | Dec 2024 |

---

## Frontend Implementation Example

```typescript
// using React Hook Form + Zod
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";

const signinSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

type SigninFormData = z.infer<typeof signinSchema>;

const SigninForm = () => {
  const router = useRouter();
  const form = useForm<SigninFormData>({
    resolver: zodResolver(signinSchema),
  });

  const onSubmit = async (data: SigninFormData) => {
    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        // Store token securely
        localStorage.setItem("access_token", result.session.access_token);
        // Redirect to dashboard
        router.push("/dashboard");
      } else {
        // Show error toast
        console.error(result.error);
      }
    } catch (error) {
      console.error("Sign in failed:", error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
};

export default SigninForm;
```

---

## Token Usage in Subsequent Requests

After successful sign in, include the access token in Authorization header:

```typescript
const headers = {
  "Authorization": `Bearer ${accessToken}`,
  "Content-Type": "application/json",
};

fetch("/api/protected-endpoint", {
  method: "GET",
  headers,
});
```

---

## Session Management

```typescript
// Refresh Token
const refreshSession = async (refreshToken: string) => {
  const response = await fetch("/api/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
  const { session } = await response.json();
  // Update stored token
};

// Check Session
const checkSession = async (token: string) => {
  const response = await fetch("/api/auth/session", {
    headers: { "Authorization": `Bearer ${token}` },
  });
  return response.ok;
};
```

---

## Related Services

- [Sign Up](./SIGNUP.md)
- [Sign Out](./SIGNOUT.md)
- [Forgot Password](./FORGOT_PASSWORD.md)
- [Session](./SESSION.md)

---

**Last Updated**: December 2024  
**Maintained By**: KIIT Saathi Team
