# Application Overview

## System Architecture

KIIT Saathi is a comprehensive campus management platform built with modern web technologies, designed to serve students, faculty, and administration at KIIT (Kalinga Institute of Industrial Technology).

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Layer                              │
│                   (Next.js React Frontend)                       │
│                  (Mobile & Desktop Responsive)                   │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                    API Layer (Next.js)                           │
│                  Route Handlers & Middleware                     │
├──────────────────────────────────────────────────────────────────┤
│  Auth │ Profile │ Contact │ Events │ Faculty │ Interviews       │
│  LostFound │ Payments │ Admin │ SplitSaathi │ StudyMaterials    │
│  Services │ Societies │ Visibility                               │
└────────────────────────┬────────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
┌───────▼──────┐  ┌──────▼──────┐  ┌─────▼────────┐
│   Supabase   │  │   External  │  │   Firebase   │
│  Database    │  │   Services  │  │  Analytics   │
│  (PostgreSQL)│  │  (Payments) │  │              │
└──────────────┘  └─────────────┘  └──────────────┘
```

---

## Technology Stack

### Frontend
- **Framework**: Next.js 14+ (React)
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI / Shadcn
- **State Management**: React Query (TanStack), React Hooks
- **Form Handling**: React Hook Form + Zod
- **Icons**: Lucide React
- **PDF Rendering**: React PDF
- **3D Graphics**: Three.js (React Three Fiber)
- **Maps**: Leaflet.js

### Backend
- **Runtime**: Node.js (Next.js API Routes)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (OAuth, Email)
- **File Storage**: Supabase Storage

### External Services
- **Payments**: Razorpay / Stripe
- **Analytics**: Vercel Analytics, Vercel Speed Insights
- **AI**: Google GenAI

### Development Tools
- **Language**: TypeScript
- **Linting**: ESLint
- **Build**: Next.js Build System
- **Package Manager**: npm/yarn

---

## Key Features

### 1. **Authentication & Authorization**
- Email/Password Sign Up & Sign In
- OAuth Integration
- JWT Token Management
- Role-Based Access Control (Admin, Student, Faculty)
- Email Verification
- Password Reset

### 2. **User Profile Management**
- Student Profile
- Faculty Profile
- Profile Picture Upload
- Bio & Personal Information
- Department & Batch Information

### 3. **Lost & Found**
- Report Lost Items
- View Lost Items Database
- Payment to unlock contact details
- Application Status Tracking

### 4. **Split Saathi (Bill Splitter)**
- Create expense groups
- Auto-link groups by proximity
- Expense tracking
- Settlement calculations
- Group management

### 5. **Study Materials**
- Upload study materials (notes, PDFs)
- Admin approval workflow
- Material preview
- Categorization by subject/course

### 6. **Interview Deadlines**
- Track company interview deadlines
- Status updates
- Notification system

### 7. **Campus Map**
- Interactive campus navigation
- Floor layouts (PDF-based)
- Location search
- Building directories

### 8. **KIIT Societies**
- Society information
- Event listings
- Interviews & recruitment

### 9. **Faculty Directory**
- Faculty search
- Department information
- Office hours

### 10. **Events Management**
- Event creation & management
- Event listings
- RSVP tracking
- Calendar integration

---

## Data Flow Overview

### User Authentication Flow

```
User Input (Email, Password)
        ↓
   Frontend Validation (Zod)
        ↓
   POST /api/auth/signin
        ↓
   Supabase Auth Service
        ↓
   JWT Token Generated
        ↓
   Session Created
        ↓
   Redirect to Dashboard
```

### Lost & Found Flow

```
User Reports Item
        ↓
   POST /api/lostfound/submit-lost-item-application
        ↓
   Store in Database
        ↓
   Item Listed Publicly
        ↓
   Interested User Clicks Contact
        ↓
   Payment Required
        ↓
   POST /api/payments/create-lost-found-order
        ↓
   Razorpay Payment Gateway
        ↓
   Payment Verification
        ↓
   Contact Details Unlocked
```

### Split Saathi Flow

```
User Creates Group
        ↓
   POST /api/split-saathi/create-group
        ↓
   Group Created in Database
        ↓
   Add Members & Expenses
        ↓
   System Calculates Settlements
        ↓
   Settlement Details Displayed
        ↓
   Mark as Paid
```

### Study Materials Flow

```
Student Uploads Material
        ↓
   POST /api/study-materials/upload
        ↓
   File Stored in Supabase
        ↓
   Pending Admin Review
        ↓
   Admin Reviews: Approve/Reject
        ↓
   If Approved: Available for Download
        ↓
   If Rejected: Notification Sent
```

---

## Environment Variables

Required environment variables:

```env
# Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Authentication
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000

# Payments
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_secret

# External Services
GOOGLE_GENAI_API_KEY=your_google_ai_key
```

---

## API Request Flow

1. **Client Request** → Frontend sends HTTP request
2. **Middleware Processing** → CORS, Auth verification
3. **Route Handler** → Next.js processes request
4. **Validation** → Input validation using Zod
5. **Business Logic** → Service layer processing
6. **Database Operations** → Supabase queries
7. **Response** → JSON response sent to client
8. **Error Handling** → Appropriate error codes & messages

---

## Security Considerations

- All sensitive endpoints require authentication
- JWT tokens stored securely in httpOnly cookies
- CORS enabled for authorized domains
- Input validation on all API endpoints
- SQL injection prevention through Supabase ORM
- XSS protection through React sanitization
- CSRF token validation
- Environment variables for secrets

---

## Performance Optimization

- Next.js Server Components for static content
- Image optimization with Next.js Image component
- Database query optimization with indexes
- Caching strategies for frequently accessed data
- API response compression
- CDN integration through Vercel

---

## Versioning

**Current Version**: 1.0.0

### Semantic Versioning
- Major (X.0.0): Breaking changes
- Minor (0.X.0): New features
- Patch (0.0.X): Bug fixes

---

## Support & Contact

- **Documentation**: See individual service documentation
- **Issues**: GitHub Issues
- **Email**: support@kiitsaathi.com
- **Slack**: #dev-support channel

---

**Last Updated**: December 2025
