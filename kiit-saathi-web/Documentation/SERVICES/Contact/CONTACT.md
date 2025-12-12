# Contact Service

## Overview

The Contact service allows users to submit contact form messages through the platform. These messages are logged and can be sent to administrators for follow-up. This is a simple submission service that handles general inquiries, feedback, and support requests.

---

## Endpoint Details

| Property | Value |
|----------|-------|
| **Endpoint** | `/api/contact` |
| **Method** | `POST` |
| **Authentication** | Not Required |
| **Content-Type** | `application/json` |

---

## Inputs

### Request Body Schema

```typescript
{
  fullName: string;   // REQUIRED - Name of the person contacting
  email: string;      // REQUIRED - Valid email address
  phone?: string;     // OPTIONAL - Contact phone number
  subject: string;    // REQUIRED - Subject of the message
  message: string;    // REQUIRED - Message body
}
```

### Example Request

```json
{
  "fullName": "Rajesh Kumar",
  "email": "rajesh@example.com",
  "phone": "+91-9876543210",
  "subject": "Issue with Split Saathi Feature",
  "message": "I'm facing difficulties with the expense calculation in Split Saathi. The amount shown doesn't match my calculations."
}
```

---

## Outputs

### Success Response (200)

```typescript
{
  message: string;  // Confirmation message
}
```

### Example Success Response

```json
{
  "message": "Message received successfully!"
}
```

### Error Response (400/500)

```typescript
{
  message: string;  // Error description
}
```

### Error Examples

#### Missing Required Fields
```json
{
  "message": "Missing required fields."
}
```

#### Server Error
```json
{
  "message": "Something went wrong while submitting your message."
}
```

---

## Validations

| Field | Validation Rule | Status |
|-------|-----------------|--------|
| `fullName` | Must not be empty | Frontend |
| `email` | Must be valid email | Frontend |
| `subject` | Must not be empty | Frontend + Backend |
| `message` | Must not be empty | Frontend + Backend |
| `phone` | Optional - any format | Frontend |

---

## Dependencies

| Dependency | Purpose | Version |
|-----------|---------|---------|
| `next` | Framework | 14+ |

### Optional Services
- Email Service (Resend/SMTP) - For sending emails
- Database (Supabase) - For storing messages

### Environment Variables
```env
# Optional: Email service
RESEND_API_KEY=your_resend_key

# Optional: Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_key
```

---

## Data Flow

```
User fills contact form
        ↓
Frontend validation (Zod)
        ↓
POST /api/contact
        ↓
Backend validation
        ↓
Log to console (currently)
        ↓
Optionally: Save to database
        ↓
Optionally: Send email to admin
        ↓
Success response sent
        ↓
Frontend shows confirmation toast
```

---

## Success Example

### Request
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Rajesh Kumar",
    "email": "rajesh@example.com",
    "phone": "+91-9876543210",
    "subject": "Issue with Split Saathi Feature",
    "message": "I'\''m facing difficulties with the expense calculation in Split Saathi. The amount shown doesn'\''t match my calculations."
  }'
```

### Response
```json
{
  "message": "Message received successfully!"
}
```

---

## Error Example

### Missing Required Field
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Rajesh Kumar",
    "email": "rajesh@example.com",
    "subject": "Issue with Split Saathi"
    // message is missing
  }'
```

### Response
```json
{
  "message": "Missing required fields."
}
```

---

## Frontend Implementation Example

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const contactSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const ContactForm = () => {
  const { toast } = useToast();
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "Your message has been sent successfully!",
        });
        form.reset();
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to send message",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while sending your message",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
};

export default ContactForm;
```

---

## Server Logging Output

When a contact form is submitted, the server logs the following:

```
📩 New Contact Form Submission:
{
  fullName: "Rajesh Kumar",
  email: "rajesh@example.com",
  phone: "+91-9876543210",
  subject: "Issue with Split Saathi Feature",
  message: "I'm facing difficulties...",
  receivedAt: "2024-12-12T10:30:00Z"
}
```

---

## Future Enhancements

- [ ] Save messages to Supabase database
- [ ] Send email notifications to admin
- [ ] Add message priority/category field
- [ ] Implement response tracking system
- [ ] Add file attachment support
- [ ] Add ticket number for tracking

---

## Versioning

| Version | Changes | Date |
|---------|---------|------|
| 1.0.0 | Initial implementation | Dec 2024 |

---

## Related Services

- None (Standalone service)

---

**Last Updated**: December 2024  
**Maintained By**: KIIT Saathi Team
