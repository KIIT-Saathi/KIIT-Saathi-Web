# Quick Start Guide - API Documentation

## Getting Started with KIIT Saathi APIs

This guide will help you quickly understand and start using the KIIT Saathi API.

---

## Prerequisites

- KIIT College Email (@kiit.ac.in)
- API Client (Postman, Insomnia, or cURL)
- Basic understanding of REST APIs and JSON

---

## Environment Setup

### Local Development

```bash
# Clone the repository
git clone https://github.com/KIIT-Saathi/KIIT-Saathi-Web.git
cd kiit-saathi-web

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your values

# Start development server
npm run dev
```

### Environment Variables Needed

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Razorpay (for payments)
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_secret

# Authentication
NEXTAUTH_SECRET=your_random_secret
NEXTAUTH_URL=http://localhost:3000

# Optional: Google Generative AI
GOOGLE_GENAI_API_KEY=your_api_key
```

---

## API Base URL

### Development
```
http://localhost:3000/api
```

### Production
```
https://ksaathi.vercel.app/api
```

---

## Complete Usage Workflow

### 1. User Registration

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "2105555@kiit.ac.in",
    "password": "SecurePass123!",
    "fullName": "Rahul Kumar Singh"
  }'
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_uuid",
    "email": "2105555@kiit.ac.in",
    "user_metadata": {"full_name": "Rahul Kumar Singh"},
    "created_at": "2024-12-12T10:30:00Z"
  },
  "session": null,
  "message": "Check your email for the confirmation link"
}
```

**Next Steps:**
- User checks email for verification link
- Clicks link to verify email
- Redirected to login page

---

### 2. Email Verification

Typically handled automatically via email callback, but can be verified:

```bash
curl -X GET "http://localhost:3000/auth/callback?code=verification_code&type=signup"
```

---

### 3. User Login

```bash
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "2105555@kiit.ac.in",
    "password": "SecurePass123!"
  }'
```

**Response:**
```json
{
  "success": true,
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "refresh_token_value",
    "expires_in": 3600,
    "expires_at": 1702380000,
    "token_type": "bearer",
    "user": {
      "id": "user_uuid",
      "email": "2105555@kiit.ac.in",
      "user_metadata": {"full_name": "Rahul Kumar Singh"}
    }
  }
}
```

**Store the tokens:**
```javascript
localStorage.setItem("access_token", response.session.access_token);
localStorage.setItem("refresh_token", response.session.refresh_token);
```

---

### 4. Ensure User Profile Exists

After login, create user profile if not exists:

```bash
curl -X POST http://localhost:3000/api/profile/ensure \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Response:**
```json
{
  "profile": {
    "id": "profile_uuid",
    "user_id": "user_uuid",
    "phone": null,
    "bio": null,
    "avatar_url": null,
    "created_at": "2024-12-12T10:35:00Z"
  }
}
```

---

### 5. Using Split Saathi - Create Group

```bash
curl -X POST http://localhost:3000/api/split-saathi/create-group \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "groupForm": {
      "name": "Room 302 Expenses",
      "description": "Hostel room shared expenses",
      "currency": "₹",
      "members": [
        {"name": "Rahul Kumar", "rollNumber": "2105555"},
        {"name": "Priya Singh", "rollNumber": "2105556"},
        {"name": "Amit Patel", "rollNumber": "2105557"}
      ]
    }
  }'
```

**Response:**
```json
{
  "message": "Group created successfully",
  "group": {
    "id": "group_uuid",
    "name": "Room 302 Expenses",
    "description": "Hostel room shared expenses",
    "currency": "₹",
    "created_by": "user_uuid",
    "created_at": "2024-12-12T10:40:00Z"
  },
  "memberCount": 3
}
```

---

### 6. Retrieve User's Groups

```bash
curl -X POST http://localhost:3000/api/split-saathi/user-groups \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

**Response:**
```json
[
  {
    "id": "group_uuid",
    "name": "Room 302 Expenses",
    "description": "Hostel room shared expenses",
    "currency": "₹",
    "created_by": "user_uuid",
    "created_at": "2024-12-12T10:40:00Z"
  }
]
```

---

### 7. Report Lost Item

```bash
curl -X POST http://localhost:3000/api/lostfound/submit-lost-item-application \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "itemName": "Blue Backpack",
    "description": "Blue Nike backpack with KIIT tag",
    "location": "Hostel 3, Room 302",
    "category": "bag",
    "images": ["image_url_1", "image_url_2"]
  }'
```

---

### 8. Create Payment Order (Lost & Found)

```bash
curl -X POST http://localhost:3000/api/payments/create-lost-found-order \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "itemId": "lost_item_uuid",
    "amount": 50
  }'
```

**Response:**
```json
{
  "orderId": "razorpay_order_id",
  "amount": 5000,
  "currency": "INR",
  "keyId": "rzp_live_key"
}
```

---

### 9. Verify Payment

After Razorpay payment:

```bash
curl -X POST http://localhost:3000/api/lostfound/verify-application-unlock-payment \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "paymentId": "razorpay_payment_id",
    "orderId": "razorpay_order_id",
    "signature": "razorpay_signature"
  }'
```

---

### 10. Submit Contact Form

```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Rajesh Kumar",
    "email": "rajesh@example.com",
    "phone": "+91-9876543210",
    "subject": "Issue with Split Saathi",
    "message": "The expense calculation is showing incorrect amounts"
  }'
```

---

## Common Headers Reference

### All Requests
```
Content-Type: application/json
```

### Protected Endpoints (Require Authorization)
```
Authorization: Bearer <your_access_token>
Content-Type: application/json
```

---

## Error Handling

### Standard Error Response Format

```json
{
  "error": "Description of what went wrong"
}
```

### Common Status Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Success | Continue |
| 400 | Bad Request | Check input data |
| 401 | Unauthorized | Provide valid token |
| 403 | Forbidden | Check permissions |
| 404 | Not Found | Verify resource exists |
| 409 | Conflict | Resource already exists |
| 500 | Server Error | Try again or contact support |

---

## Testing with Postman

### 1. Create Environment Variables

```json
{
  "base_url": "http://localhost:3000/api",
  "access_token": "your_token_here",
  "email": "2105555@kiit.ac.in",
  "password": "YourPassword123!"
}
```

### 2. Create Collection

Import all endpoints and organize by service:
- Authentication
- Profile
- Split Saathi
- Lost & Found
- Payments
- Contact

### 3. Save Tokens Automatically

In response scripts:
```javascript
if (pm.response.code === 200) {
  var jsonData = pm.response.json();
  if (jsonData.session && jsonData.session.access_token) {
    pm.environment.set("access_token", jsonData.session.access_token);
  }
}
```

---

## Testing with cURL

### Setup a variable
```bash
export TOKEN="your_access_token_here"
export BASE_URL="http://localhost:3000/api"
```

### Reuse in requests
```bash
curl -X POST $BASE_URL/split-saathi/user-groups \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

---

## Rate Limiting

Currently, no rate limiting is enforced. However, please:
- Avoid making more than 100 requests/minute per IP
- Implement exponential backoff for retries
- Cache responses when possible

---

## Debugging Tips

### 1. Enable Verbose Logging
```bash
# In cURL, use -v flag
curl -v -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{...}'
```

### 2. Check Response Headers
```bash
curl -i -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{...}'
```

### 3. Validate Token
```bash
# Check token in jwt.io (don't use in production!)
# Decode to see payload and verify signature
```

### 4. Check Timestamps
- Verify `expires_at` is in the future
- Refresh token if expired (expires_in seconds)

---

## Common Issues & Solutions

### Issue: "Only KIIT College Email IDs are allowed"
**Solution**: Use email with @kiit.ac.in domain
```json
{
  "email": "2105555@kiit.ac.in",  // ✓ Correct
  // NOT: "student@gmail.com"     // ✗ Wrong
}
```

### Issue: "Unauthorized" with valid token
**Solution**: Check token format
```bash
# Correct format:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# NOT: Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Issue: Empty response or 500 error
**Solution**: 
- Check environment variables are set correctly
- Verify database connection
- Check server logs: `npm run dev`

### Issue: CORS errors
**Solution**: Ensure request from correct origin
- Development: `http://localhost:3000`
- Production: `https://ksaathi.vercel.app`

---

## Next Steps

1. **Read Service Documentation**: See individual service docs for detailed API specifications
2. **Explore Database**: Understand data models in `DATA_FLOW_ARCHITECTURE.md`
3. **Test Endpoints**: Use Postman collection or cURL to test APIs
4. **Build Features**: Integrate APIs into your frontend/backend application

---

## Support

- **Documentation**: See `TABLE_OF_CONTENTS.md` for all docs
- **GitHub Issues**: Report bugs on GitHub
- **Email**: support@kiitsaathi.com

---

**Last Updated**: December 2024  
**Maintained By**: KIIT Saathi Team
