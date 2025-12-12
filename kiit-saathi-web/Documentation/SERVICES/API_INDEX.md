# API Services Index

## Quick Reference Guide

This document provides a quick reference for all API endpoints available in KIIT Saathi.

---

## Authentication Services

### ✅ Sign Up
- **Endpoint**: `POST /api/auth/signup`
- **Auth**: Not Required
- **Purpose**: Create new user account
- **Doc**: [SIGNUP.md](./Auth/SIGNUP.md)

### ✅ Sign In
- **Endpoint**: `POST /api/auth/signin`
- **Auth**: Not Required
- **Purpose**: Authenticate user and get session token
- **Doc**: [SIGNIN.md](./Auth/SIGNIN.md)

### ✅ Sign Out
- **Endpoint**: `POST /api/auth/signout`
- **Auth**: Required (Bearer Token)
- **Purpose**: Logout user and invalidate session
- **Doc**: [SIGNOUT.md](./Auth/SIGNOUT.md)

### 📄 Forgot Password
- **Endpoint**: `POST /api/auth/forgot-password`
- **Auth**: Not Required
- **Purpose**: Request password reset
- **Doc**: [FORGOT_PASSWORD.md](./Auth/FORGOT_PASSWORD.md)

### 📧 Email Verification
- **Endpoint**: `POST /api/auth/verify-email-callback`
- **Auth**: Not Required
- **Purpose**: Verify email after signup
- **Doc**: [EMAIL_VERIFICATION.md](./Auth/EMAIL_VERIFICATION.md)

### 📋 Session
- **Endpoint**: `GET /api/auth/session`
- **Auth**: Required (Bearer Token)
- **Purpose**: Check active session status
- **Doc**: [SESSION.md](./Auth/SESSION.md)

---

## Contact Service

### ✉️ Submit Contact Form
- **Endpoint**: `POST /api/contact`
- **Auth**: Not Required
- **Purpose**: Submit contact/support message
- **Doc**: [CONTACT.md](./Contact/CONTACT.md)

---

## Profile Services

### 👤 Get/Update Profile
- **Endpoint**: `GET/PUT /api/profile`
- **Auth**: Required (Bearer Token)
- **Purpose**: Retrieve or update user profile
- **Doc**: [PROFILE.md](./Profile/PROFILE.md)

### ✔️ Ensure User
- **Endpoint**: `POST /api/profile/ensure`
- **Auth**: Required (Bearer Token)
- **Purpose**: Create user profile if doesn't exist
- **Doc**: [ENSURE_USER.md](./Profile/ENSURE_USER.md)

---

## Split Saathi Services

### 🏠 Create Group
- **Endpoint**: `POST /api/split-saathi/create-group`
- **Auth**: Required (Bearer Token)
- **Purpose**: Create new expense sharing group
- **Doc**: [CREATE_GROUP.md](./SplitSaathi/CREATE_GROUP.md)

### 👥 User Groups
- **Endpoint**: `POST /api/split-saathi/user-groups`
- **Auth**: Required (Bearer Token)
- **Purpose**: Get all groups for user
- **Doc**: [USER_GROUPS.md](./SplitSaathi/USER_GROUPS.md)

### 🔗 Auto Link
- **Endpoint**: `POST /api/split-saathi/auto-link`
- **Auth**: Required (Bearer Token)
- **Purpose**: Auto-link groups by proximity
- **Doc**: [AUTO_LINK.md](./SplitSaathi/AUTO_LINK.md)

### 📊 Group Details
- **Endpoint**: `GET /api/split-saathi/group/[groupID]`
- **Auth**: Required (Bearer Token)
- **Purpose**: Get group details and member info
- **Doc**: [GROUP_DETAILS.md](./SplitSaathi/GROUP_DETAILS.md)

---

## Lost & Found Services

### 📌 Submit Lost Item
- **Endpoint**: `POST /api/lostfound/submit-lost-item-application`
- **Auth**: Required (Bearer Token)
- **Purpose**: Report lost item
- **Doc**: [SUBMIT_ITEM.md](./LostFound/SUBMIT_ITEM.md)

### 📋 View Lost Items
- **Endpoint**: `GET /api/lostfound/items`
- **Auth**: Not Required
- **Purpose**: View list of lost items
- **Doc**: [VIEW_ITEMS.md](./LostFound/VIEW_ITEMS.md)

### 💳 Create Unlock Order
- **Endpoint**: `POST /api/lostfound/create-application-unlock-order`
- **Auth**: Required (Bearer Token)
- **Purpose**: Create payment order to unlock contact details
- **Doc**: [CREATE_UNLOCK_ORDER.md](./LostFound/CREATE_UNLOCK_ORDER.md)

### ✅ Verify Payment
- **Endpoint**: `POST /api/lostfound/verify-application-unlock-payment`
- **Auth**: Required (Bearer Token)
- **Purpose**: Verify payment and unlock contact details
- **Doc**: [VERIFY_PAYMENT.md](./LostFound/VERIFY_PAYMENT.md)

### 📞 Contact Details
- **Endpoint**: `GET /api/lostfound/has-paid-lost-found-contact`
- **Auth**: Required (Bearer Token)
- **Purpose**: Check if user has paid for contact details
- **Doc**: [CONTACT_DETAILS.md](./LostFound/CONTACT_DETAILS.md)

---

## Payments Services

### 💰 Create Lost & Found Payment
- **Endpoint**: `POST /api/payments/create-lost-found-order`
- **Auth**: Required (Bearer Token)
- **Purpose**: Create payment order for lost & found service
- **Doc**: [LOSTFOUND_PAYMENT.md](./Payments/LOSTFOUND_PAYMENT.md)

### 🔐 Send Contact Details
- **Endpoint**: `POST /api/payments/send-contact-details`
- **Auth**: Required (Bearer Token)
- **Purpose**: Send contact details after payment
- **Doc**: [LOSTFOUND_PAYMENT.md](./Payments/LOSTFOUND_PAYMENT.md)

---

## Study Materials Services

### 📚 Upload Material
- **Endpoint**: `POST /api/study-materials/upload`
- **Auth**: Required (Bearer Token)
- **Purpose**: Upload study material/notes
- **Doc**: [UPLOAD.md](./StudyMaterials/UPLOAD.md)

### 👁️ Preview Material
- **Endpoint**: `GET /api/study-materials/preview`
- **Auth**: Required (Bearer Token)
- **Purpose**: Get preview URL for material
- **Doc**: [PREVIEW.md](./StudyMaterials/PREVIEW.md)

---

## Admin Services

### ✔️ Approve Material
- **Endpoint**: `POST /api/admin/study-material-approve`
- **Auth**: Required (Admin Role)
- **Purpose**: Approve uploaded study material
- **Doc**: [ADMIN.md](./Admin/ADMIN.md)

### ❌ Reject Material
- **Endpoint**: `POST /api/admin/study-material-reject`
- **Auth**: Required (Admin Role)
- **Purpose**: Reject uploaded study material
- **Doc**: [ADMIN.md](./Admin/ADMIN.md)

---

## Service Visibility

### 👁️ Service Visibility
- **Endpoint**: `GET/POST /api/service-visibility`
- **Auth**: Required (Admin Role)
- **Purpose**: Toggle service visibility
- **Doc**: [VISIBILITY.md](./ServiceVisibility/VISIBILITY.md)

---

## Other Services

### 📅 Events
- **Endpoint**: `/api/events`
- **Auth**: Required (Bearer Token)
- **Purpose**: Event management
- **Doc**: [EVENTS.md](./Events/EVENTS.md)

### 👨‍🏫 Faculty
- **Endpoint**: `/api/faculty`
- **Auth**: Not Required
- **Purpose**: Faculty directory
- **Doc**: [FACULTY.md](./Faculty/FACULTY.md)

### 🏢 KIIT Societies
- **Endpoint**: `/api/kiit-societies`
- **Auth**: Not Required
- **Purpose**: Societies information
- **Doc**: [SOCIETIES.md](./Societies/SOCIETIES.md)

### 💼 Interviews
- **Endpoint**: `/api/interviews`
- **Auth**: Not Required
- **Purpose**: Interview tracking
- **Doc**: [INTERVIEWS.md](./Interviews/INTERVIEWS.md)

---

## Authentication Requirements Summary

| Authentication | Services |
|---|---|
| **Not Required** | Sign Up, Sign In, Contact, View Lost Items, Faculty, Societies, Interviews |
| **Bearer Token** | Sign Out, Profile, Split Saathi, Lost & Found (except list), Payments, Study Materials |
| **Admin Role** | Admin endpoints, Service Visibility |

---

## HTTP Status Codes Reference

| Code | Meaning | Common Use |
|------|---------|-----------|
| 200 | OK | Successful request |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid input/validation failed |
| 401 | Unauthorized | Missing/invalid authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists |
| 500 | Server Error | Internal server error |
| 503 | Service Unavailable | Service temporarily down |

---

## Error Response Format

All error responses follow this format:

```json
{
  "error": "Error message describing what went wrong"
}
```

Or in some cases:

```json
{
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

---

## Rate Limiting

Currently, no rate limiting is implemented. Please use APIs responsibly.

Future rate limits will be documented here.

---

## Versioning

**Current API Version**: 1.0.0

All endpoints are v1 by default. Version will be included in URLs if versioning is introduced (e.g., `/api/v1/...`).

---

## Common Headers

### Request Headers
```
Content-Type: application/json
Authorization: Bearer <access_token>  // For protected endpoints
```

### Response Headers
```
Content-Type: application/json
X-Request-Id: <unique-id>             // For tracking
X-Response-Time: <milliseconds>       // Performance metric
```

---

## Documentation Navigation

- [Application Overview](../APPLICATION_OVERVIEW.md)
- [Authentication Services](./Auth/README.md)
- [Profile Services](./Profile/README.md)
- [Split Saathi Services](./SplitSaathi/README.md)
- [Lost & Found Services](./LostFound/README.md)
- [Payments Services](./Payments/README.md)
- [Study Materials](./StudyMaterials/README.md)

---

**Last Updated**: December 2024  
**Maintained By**: KIIT Saathi Team
