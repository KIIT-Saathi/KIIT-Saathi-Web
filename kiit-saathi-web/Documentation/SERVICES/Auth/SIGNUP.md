# Sign Up Service

## Overview

The Sign Up service allows new users to create an account on KIIT Saathi. This service includes email validation, password requirements, and sends verification emails to confirm user identity.

---

## Endpoint Details

| Property | Value |
|----------|-------|
| **Endpoint** | `/api/auth/signup` |
| **Method** | `POST` |
| **Authentication** | Not Required |
| **Content-Type** | `application/json` |

---

## Inputs

### Request Body Schema

```typescript
{
  email: string;        // REQUIRED - KIIT email (@kiit.ac.in domain)
  password: string;     // REQUIRED - Minimum 8 characters
  fullName: string;     // REQUIRED - User's full name
}
```

### Example Request

```json
{
  "email": "2105555@kiit.ac.in",
  "password": "SecurePassword123!",
  "fullName": "Rahul Kumar Singh"
}
```

---

## Outputs

### Success Response (200)

```typescript
{
  success: boolean;          // true
  user: {
    id: string;              // User ID
    email: string;           // User email
    user_metadata: {
      full_name: string;     // Full name from signup
    };
    created_at: string;      // ISO timestamp
    email_confirmed_at: string | null; // Null until verified
    phone_confirmed_at: string | null;
    last_sign_in_at: string | null;
  };
  session: {
    access_token: string;    // JWT Token
    refresh_token: string;   // Refresh token
    expires_in: number;      // Expiry in seconds
    expires_at: number;      // Unix timestamp
    token_type: string;      // "bearer"
    user: User;              // User object
  } | null;
  message: string;           // "Check your email for confirmation link" OR 
                             // "Account created successfully"
}
```

### Example Success Response

```json
{
  "success": true,
  "user": {
    "id": "user_123456",
    "email": "2105555@kiit.ac.in",
    "user_metadata": {
      "full_name": "Rahul Kumar Singh"
    },
    "created_at": "2024-12-12T10:30:00Z",
    "email_confirmed_at": null
  },
  "session": null,
  "message": "Check your email for the confirmation link"
}
```

### Error Response (400)

```typescript
{
  error: string;  // Error message describing what went wrong
}
```

### Error Examples

#### Invalid Email Domain
```json
{
  "error": "Only KIIT College Email IDs (@kiit.ac.in) are allowed."
}
```

#### Weak Password
```json
{
  "error": "Password should be at least 8 characters"
}
```

#### Email Already Exists
```json
{
  "error": "User already exists with this email"
}
```

#### Server Error (500)
```json
{
  "error": "Sign up failed"
}
```

---

## Validations

| Field | Validation Rule | Error Message |
|-------|-----------------|---------------|
| `email` | Must be KIIT domain (@kiit.ac.in) | "Only KIIT College Email IDs (@kiit.ac.in) are allowed." |
| `email` | Must be valid email format | "Invalid email format" |
| `password` | Minimum 8 characters | "Password should be at least 8 characters" |
| `password` | Cannot be empty | "Password is required" |
| `fullName` | Cannot be empty | "Full name is required" |
| `email` | Must not already exist | "User already exists with this email" |

---

## Dependencies

| Dependency | Purpose | Version |
|-----------|---------|---------|
| `@supabase/supabase-js` | Database & Authentication | ^2.53.0 |
| `next` | Framework & Runtime | 14+ |

### Environment Variables Required
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## Data Flow

```
User Input (Email, Password, Full Name)
        ↓
Frontend Validation (Zod/React Hook Form)
        ↓
POST /api/auth/signup
        ↓
Backend Validation (Email domain check, password strength)
        ↓
Supabase Auth Service
        ↓
User created in PostgreSQL
        ↓
Confirmation email sent
        ↓
Response with session (or null if email verification pending)
        ↓
Frontend redirect to login or confirmation page
```

---

## Success Example

### Request
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "2105555@kiit.ac.in",
    "password": "MySecurePass123!",
    "fullName": "Rahul Kumar Singh"
  }'
```

### Response
```json
{
  "success": true,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "2105555@kiit.ac.in",
    "user_metadata": {
      "full_name": "Rahul Kumar Singh"
    },
    "created_at": "2024-12-12T10:30:00Z",
    "email_confirmed_at": null
  },
  "session": null,
  "message": "Check your email for the confirmation link"
}
```

---

## Error Example

### Invalid Email Domain
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@gmail.com",
    "password": "MySecurePass123!",
    "fullName": "John Doe"
  }'
```

### Response
```json
{
  "error": "Only KIIT College Email IDs (@kiit.ac.in) are allowed."
}
```

---

## Versioning

| Version | Changes | Date |
|---------|---------|------|
| 1.0.0 | Initial implementation | Dec 2024 |
| 1.1.0 | Added full_name field | Dec 2024 |

---

## Frontend Implementation Example

```typescript
// using React Hook Form + Zod
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const signupSchema = z.object({
  email: z.string().email().refine(
    (val) => val.endsWith("@kiit.ac.in"),
    "Only KIIT email addresses allowed"
  ),
  password: z.string().min(8, "Password must be at least 8 characters"),
  fullName: z.string().min(2, "Name must be at least 2 characters"),
});

type SignupFormData = z.infer<typeof signupSchema>;

const SignupForm = () => {
  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        // Show success message
        console.log("Account created! Check your email for confirmation.");
        // Redirect to verification page or login
      } else {
        // Show error message
        console.error(result.error);
      }
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
};
```

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Email already exists" | User should use Sign In or reset password |
| "Invalid email domain" | Must use @kiit.ac.in email address |
| "Weak password" | Password needs to be 8+ characters, preferably with mixed case and symbols |
| "Confirmation email not received" | Check spam folder or use Resend Confirmation endpoint |

---

## Related Services

- [Sign In](./SIGNIN.md)
- [Email Verification](./EMAIL_VERIFICATION.md)
- [Forgot Password](./FORGOT_PASSWORD.md)

---

**Last Updated**: December 2024  
**Maintained By**: KIIT Saathi Team
