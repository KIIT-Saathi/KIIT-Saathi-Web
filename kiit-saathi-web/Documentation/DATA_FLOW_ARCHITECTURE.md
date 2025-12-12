# Data Flow Architecture Guide

## Complete Application Data Flows

This document provides detailed data flow diagrams and explanations for all major features of KIIT Saathi.

---

## Table of Contents

1. [Authentication Flow](#authentication-flow)
2. [User Onboarding Flow](#user-onboarding-flow)
3. [Lost & Found Flow](#lost--found-flow)
4. [Split Saathi Flow](#split-saathi-flow)
5. [Study Materials Flow](#study-materials-flow)
6. [Payment Flow](#payment-flow)
7. [Database Schema Overview](#database-schema-overview)

---

## Authentication Flow

### User Registration (Sign Up)

```
┌─────────────────────────────────────────────────────────────┐
│                        USER BROWSER                          │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Sign Up Page Component                        │  │
│  │  - Email Input (@kiit.ac.in validation)             │  │
│  │  - Password Input (strength check)                   │  │
│  │  - Full Name Input                                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                         ↓                                    │
│          Frontend Validation (Zod)                           │
│                         ↓                                    │
│      HTTP POST /api/auth/signup                             │
│  {email, password, fullName}                                │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │
┌────────────────────────▼────────────────────────────────────┐
│                     NEXT.JS SERVER                           │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Route Handler: /api/auth/signup                     │  │
│  │                                                      │  │
│  │  1. Parse Request Body                              │  │
│  │  2. Validate Email Domain (@kiit.ac.in)             │  │
│  │  3. Check Password Requirements                      │  │
│  │  4. Verify Email Uniqueness                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                         ↓                                    │
│          Supabase Auth Service API                           │
│                         ↓                                    │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                   SUPABASE (PostgreSQL)                      │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  auth.users Table                                    │  │
│  │  - id (UUID)                                         │  │
│  │  - email (VARCHAR)                                   │  │
│  │  - encrypted_password                                │  │
│  │  - email_confirmed_at (TIMESTAMP)                    │  │
│  │  - user_metadata (JSONB)                             │  │
│  │    ├── full_name                                     │  │
│  │    └── other_fields                                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                         ↓                                    │
│  Generate Confirmation Email                                │
│  Send to user's email with callback URL                     │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    EMAIL SERVICE                             │
│                                                              │
│  Sends: "Verify your email - Click here"                    │
│  Includes: Callback URL with token                          │
│  Contains: /auth/callback?token=xyz&type=signup             │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                     USER BROWSER                             │
│                                                              │
│  1. Receives Email                                           │
│  2. Clicks Verification Link                                │
│  3. Callback Handler Verifies Token                          │
│  4. Email Confirmed in Database                             │
│  5. Redirected to Login Page                                │
└────────────────────────────────────────────────────────────┘
```

### User Login (Sign In)

```
USER INPUT (Email, Password)
        ↓
Frontend Validation (Zod)
        ↓
HTTP POST /api/auth/signin
        ↓
Next.js Route Handler
        ├─ Extract email & password
        ├─ Check for required fields
        └─ Call Supabase Auth
        ↓
Supabase Auth Service
        ├─ Find user by email
        ├─ Compare password hash
        ├─ Check email_confirmed_at
        └─ Generate JWT Tokens
        ↓
Response with Session
        ├─ access_token (3600s expiry)
        ├─ refresh_token (long-lived)
        ├─ user object
        └─ expires_at timestamp
        ↓
Frontend Storage
        ├─ localStorage: access_token
        ├─ localStorage: refresh_token
        └─ Context/State: user info
        ↓
Redirect to Dashboard
```

---

## User Onboarding Flow

```
POST /api/profile/ensure
        ↓
Create user profile in:
        ├─ profiles table
        ├─ user_metadata
        └─ Initialize preferences
        ↓
User Profile Created Successfully
```

---

## Lost & Found Flow

### Complete Lost Item Report to Contact Unlock

```
┌─────────────────────────────────────────────────────┐
│         Step 1: Report Lost Item                     │
└────────────┬────────────────────────────────────────┘
             │
    User fills Lost Item Form
    - Item name, description
    - Location lost
    - Item category
    - Photos/images
             │
    POST /api/lostfound/submit-lost-item-application
             │
┌────────────▼────────────────────────────────────────┐
│  Database: lost_items Table                          │
│  - id                                                │
│  - user_id (reporter)                                │
│  - item_name                                         │
│  - description                                       │
│  - location                                          │
│  - category                                          │
│  - images_urls[]                                     │
│  - status: 'active'                                  │
│  - created_at                                        │
│  - contact_info_locked: true                         │
└────────────┬────────────────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────────────────┐
│    Item Listed Publicly (Contact Hidden)             │
│    - Other users can see item details                │
│    - Reporter's contact NOT visible                  │
└────────────┬────────────────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────────────────┐
│   Step 2: Someone Finds Item / User Wants Contact   │
└────────────┬────────────────────────────────────────┘
             │
    User clicks "Contact Item Reporter"
             │
    POST /api/lostfound/create-application-unlock-order
    {
      itemId: string,
      userId: string
    }
             │
┌────────────▼────────────────────────────────────────┐
│  Create Razorpay Payment Order                       │
│  - Amount: ₹50 (configurable)                        │
│  - Order ID generated                                │
│  - Status: pending                                   │
│  - User ID recorded                                  │
└────────────┬────────────────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────────────────┐
│   Step 3: User Pays via Razorpay                     │
│   - Razorpay Payment Gateway                         │
│   - User enters UPI/Card details                     │
│   - Payment processed                                │
└────────────┬────────────────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────────────────┐
│   Step 4: Verify Payment                             │
└────────────┬────────────────────────────────────────┘
             │
    POST /api/lostfound/verify-application-unlock-payment
    {
      paymentId: string,
      orderId: string,
      signature: string
    }
             │
┌────────────▼────────────────────────────────────────┐
│  Razorpay Signature Verification                     │
│  - Verify: HMAC-SHA256(orderId|paymentId, secret)    │
│  - Signature matches Razorpay signature              │
│  - Payment confirmed valid                           │
└────────────┬────────────────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────────────────┐
│  Create payment_records entry                        │
│  - user_id (who paid)                                │
│  - item_id                                           │
│  - amount: 50                                        │
│  - razorpay_payment_id                               │
│  - status: 'completed'                               │
└────────────┬────────────────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────────────────┐
│   Step 5: Send Contact Details                       │
└────────────┬────────────────────────────────────────┘
             │
    POST /api/payments/send-contact-details
    {
      itemId: string,
      userId: string (who paid)
    }
             │
┌────────────▼────────────────────────────────────────┐
│  Fetch Reporter's Contact Info                       │
│  - From profiles table                               │
│  - Phone number                                      │
│  - Email (already visible)                           │
└────────────┬────────────────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────────────────┐
│  Send Email/Notification to User                     │
│  - "You can now contact the item reporter"           │
│  - Show phone & email                                │
│  - Link to messaging (optional)                      │
└────────────┬────────────────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────────────────┐
│   Users Can Now Contact Each Other                   │
│   - Direct communication to resolve item             │
│   - Meetup to return item                            │
└─────────────────────────────────────────────────────┘
```

---

## Split Saathi Flow

### Create Group → Track Expenses → Settle Up

```
┌──────────────────────────────────────┐
│  Step 1: User Creates Group          │
└─────────────┬────────────────────────┘
              │
    POST /api/split-saathi/create-group
    {
      groupForm: {
        name: "Room 302 Expenses",
        members: [
          {name: "Rahul", rollNumber: "2105555"},
          {name: "Priya", rollNumber: "2105556"}
        ]
      }
    }
              │
┌─────────────▼────────────────────────┐
│  Database Operations:                 │
│                                       │
│  1. INSERT groups table               │
│  - id (UUID)                          │
│  - name                               │
│  - description                        │
│  - currency                           │
│  - created_by (user_id)               │
│  - created_at                         │
│                                       │
│  2. INSERT group_members table        │
│  - group_id                           │
│  - name                               │
│  - roll_number                        │
│  - email_phone                        │
└─────────────┬────────────────────────┘
              │
              ↓
┌──────────────────────────────────────┐
│  Group Created - Members Linked       │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│  Step 2: Add Expenses                 │
└─────────────┬────────────────────────┘
              │
    POST /api/split-saathi/group/add-expense
    {
      groupId: "group_uuid",
      paidBy: "Rahul",
      amount: 300,
      description: "Groceries",
      splitAmong: ["Rahul", "Priya", "Amit"]
    }
              │
┌─────────────▼────────────────────────┐
│  Database Operations:                 │
│                                       │
│  1. INSERT expenses table             │
│  - id, group_id, paid_by              │
│  - amount, description                │
│  - created_at                         │
│                                       │
│  2. INSERT splits table               │
│  - For each member in splitAmong      │
│  - member_name, share_amount          │
│  - settled_status: false              │
└─────────────┬────────────────────────┘
              │
              ↓
┌──────────────────────────────────────┐
│  Expense Recorded                     │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│  Step 3: Calculate Balances           │
└─────────────┬────────────────────────┘
              │
    Algorithm: For each member
    ┌─────────────────────────────┐
    │ Total Paid = sum of all     │
    │            expenses they    │
    │            paid             │
    │                             │
    │ Total Owed = sum of all     │
    │            expenses split   │
    │            to them          │
    │                             │
    │ Balance = Total Paid - Owed │
    │ (Positive = they are owed)  │
    │ (Negative = they owe)       │
    └─────────────┬───────────────┘
                  │
                  ↓
        Show Settlement Matrix
        Rahul owes Priya ₹50
        Amit owes Rahul ₹100

┌──────────────────────────────────────┐
│  Step 4: Mark as Settled              │
└─────────────┬────────────────────────┘
              │
    POST /api/split-saathi/settle-expense
    {
      expenseId: "expense_uuid",
      settledBy: "userId"
    }
              │
┌─────────────▼────────────────────────┐
│  Database Update:                     │
│  UPDATE splits                        │
│  SET settled_status = true            │
│  WHERE expense_id = xyz               │
└─────────────┬────────────────────────┘
              │
              ↓
┌──────────────────────────────────────┐
│  Settlement Confirmed                │
│  - Expense marked as settled         │
│  - Updated in balance calculations    │
└──────────────────────────────────────┘
```

---

## Study Materials Flow

### Upload → Review → Approve/Reject

```
┌─────────────────────────────────┐
│  Step 1: Student Uploads         │
└────────────┬────────────────────┘
             │
    POST /api/study-materials/upload
    FormData {
      title,
      description,
      subject,
      file (PDF/JPG)
    }
             │
┌────────────▼────────────────────┐
│  Supabase Storage                │
│  Upload file to bucket:          │
│  /study-materials/<uuid>         │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│  Database: study_materials       │
│  - id (UUID)                     │
│  - title                         │
│  - description                   │
│  - subject                       │
│  - uploaded_by (user_id)         │
│  - file_url (Supabase URL)       │
│  - status: 'pending'             │
│  - uploaded_at                   │
│  - approved_by (NULL)            │
│  - approved_at (NULL)            │
└────────────┬────────────────────┘
             │
             ↓
┌─────────────────────────────────┐
│  Status: PENDING ADMIN REVIEW    │
└─────────────┬────────────────────┘
             │
    Notification: "Material awaiting approval"
             │
┌─────────────────────────────────┐
│  Step 2: Admin Reviews           │
└────────────┬────────────────────┘
             │
    Admin visits approval panel
    - Views all pending materials
    - Reads title, description
    - Downloads to review content
             │
    Decision: Approve or Reject
             │
┌────────────▼────────────────────┐
│  If APPROVED:                    │
│  POST /api/admin/approve-material│
│                                  │
│  UPDATE study_materials          │
│  SET status = 'approved'         │
│  SET approved_by = admin_id      │
│  SET approved_at = NOW()         │
│                                  │
│  Send notification to student:   │
│  "Your material approved!"       │
│  "Now visible to all students"   │
└────────────┬────────────────────┘
             │
             ↓
┌─────────────────────────────────┐
│  Material Publicly Available     │
│  - Listed in Study Materials     │
│  - Downloadable by all students  │
│  - Attributed to uploader        │
└─────────────────────────────────┘

┌────────────────────────────────┐
│  If REJECTED:                   │
│  POST /api/admin/reject-material│
│                                 │
│  UPDATE study_materials         │
│  SET status = 'rejected'        │
│  SET rejected_by = admin_id     │
│  SET rejection_reason = reason  │
│                                 │
│  Send notification to student:  │
│  "Your material was rejected"   │
│  "Reason: [reason from admin]"  │
└────────────┬────────────────────┘
             │
             ↓
┌─────────────────────────────────┐
│  Student can:                    │
│  - View rejection reason         │
│  - Upload revised version        │
│  - Delete submission             │
└─────────────────────────────────┘
```

---

## Payment Flow

```
USER INITIATES PAYMENT
        ↓
SELECT SERVICE & AMOUNT
├─ Lost & Found Unlock: ₹50
└─ Other services...
        ↓
CREATE RAZORPAY ORDER
POST /api/payments/create-order
        ├─ ORDER ID: generated by Razorpay
        ├─ AMOUNT: in paise (₹50 = 5000)
        ├─ STATUS: "created"
        └─ USER_ID: recorded
        ↓
STORE ORDER IN DATABASE
        ├─ TABLE: payment_orders
        ├─ order_id (Razorpay)
        ├─ user_id
        ├─ amount
        ├─ service_type
        ├─ status: 'pending'
        └─ created_at
        ↓
DISPLAY RAZORPAY PAYMENT MODAL
        ├─ User enters: UPI/Card/Wallet
        ├─ Razorpay processes securely
        ├─ Returns: payment_id
        └─ Returns: signature
        ↓
VERIFY PAYMENT
POST /api/payments/verify-payment
        ├─ Calculate HMAC-SHA256(order_id|payment_id, secret)
        ├─ Compare with signature from Razorpay
        ├─ Must match for valid payment
        └─ Prevent tampering
        ↓
UPDATE ORDER STATUS
        ├─ TABLE: payment_orders
        ├─ status: 'completed'
        ├─ payment_id: (from Razorpay)
        ├─ verified_at: NOW()
        └─ completed_at: NOW()
        ↓
FULFILL SERVICE
        ├─ For Lost & Found:
        │  - Unlock contact details
        │  - Send contact info to user
        │  - Update lost_item status
        └─ For other services:
           - Similar service fulfillment
        ↓
SEND CONFIRMATION
        ├─ Email receipt
        ├─ Thank you message
        ├─ Service access link
        └─ FAQ support
```

---

## Database Schema Overview

### Core Tables

```
users (from Supabase Auth)
├─ id (UUID) - PK
├─ email
├─ encrypted_password
├─ email_confirmed_at
├─ user_metadata (JSONB)
│  └─ full_name
└─ created_at

profiles
├─ id (UUID) - PK
├─ user_id (FK → users.id)
├─ phone
├─ bio
├─ avatar_url
├─ department
├─ batch
└─ updated_at

groups (Split Saathi)
├─ id (UUID) - PK
├─ name
├─ description
├─ currency
├─ created_by (FK → users.id)
├─ created_at
└─ updated_at

group_members
├─ id (UUID) - PK
├─ group_id (FK → groups.id)
├─ name
├─ roll_number
├─ email_phone
└─ created_at

expenses
├─ id (UUID) - PK
├─ group_id (FK → groups.id)
├─ paid_by
├─ amount
├─ description
├─ created_at
└─ updated_at

lost_items
├─ id (UUID) - PK
├─ user_id (FK → users.id)
├─ item_name
├─ description
├─ location
├─ category
├─ images_urls (JSONB)
├─ status ('active', 'found', 'closed')
├─ contact_info_locked
├─ created_at
└─ updated_at

payment_orders (Payments)
├─ id (UUID) - PK
├─ user_id (FK → users.id)
├─ razorpay_order_id
├─ amount
├─ service_type
├─ status ('pending', 'completed', 'failed')
├─ created_at
└─ completed_at

study_materials
├─ id (UUID) - PK
├─ title
├─ description
├─ subject
├─ uploaded_by (FK → users.id)
├─ file_url (Supabase Storage)
├─ status ('pending', 'approved', 'rejected')
├─ approved_by (FK → users.id, nullable)
├─ uploaded_at
├─ approved_at
└─ rejection_reason
```

---

## Error Handling Flow

```
CLIENT REQUEST
        ↓
┌───────────────────────────┐
│ INPUT VALIDATION          │
│ (Frontend + Backend)      │
└────────┬──────────────────┘
         │
         ├─ VALID → Continue
         │
         └─ INVALID
              └─ Return 400 Bad Request
                 {error: "Validation failed"}
         ↓
┌───────────────────────────┐
│ AUTHENTICATION CHECK      │
└────────┬──────────────────┘
         │
         ├─ AUTHENTICATED → Continue
         │
         └─ NOT AUTHENTICATED
              └─ Return 401 Unauthorized
                 {error: "Authentication required"}
         ↓
┌───────────────────────────┐
│ AUTHORIZATION CHECK       │
│ (Roles, Permissions)      │
└────────┬──────────────────┘
         │
         ├─ AUTHORIZED → Continue
         │
         └─ NOT AUTHORIZED
              └─ Return 403 Forbidden
                 {error: "Insufficient permissions"}
         ↓
┌───────────────────────────┐
│ BUSINESS LOGIC EXECUTION  │
└────────┬──────────────────┘
         │
         ├─ SUCCESS → Continue
         │
         └─ FAILURE
              └─ Return 400/409 Client Error
                 {error: "Business logic error"}
         ↓
┌───────────────────────────┐
│ DATABASE OPERATIONS       │
└────────┬──────────────────┘
         │
         ├─ SUCCESS → Continue
         │
         └─ FAILURE
              └─ Return 500 Server Error
                 {error: "Database error"}
         ↓
┌───────────────────────────┐
│ SEND RESPONSE             │
│ Success: 200/201          │
│ Error: 400/401/403/500    │
└───────────────────────────┘
```

---

## Async Operations Flow

```
WEBHOOK / ASYNC TASK
        ↓
REQUEST RECEIVED
├─ Payment confirmation
├─ Email delivery confirmation
└─ File upload completion
        ↓
PROCESS IN BACKGROUND
├─ Update database
├─ Trigger notifications
└─ Send confirmations
        ↓
LOG OPERATION
├─ Success/failure status
├─ Timestamp
└─ Error details if any
        ↓
RETRY LOGIC (if failed)
├─ Exponential backoff
├─ Max retries: 3-5
└─ Alert if persistent failure
        ↓
NOTIFICATION TO USER
├─ Email confirmation
├─ In-app notification
└─ Toast message
```

---

**Last Updated**: December 2024  
**Maintained By**: KIIT Saathi Team
