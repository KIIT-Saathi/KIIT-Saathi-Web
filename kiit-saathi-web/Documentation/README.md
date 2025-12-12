# KIIT Saathi - Complete API Documentation

Welcome to the comprehensive API documentation for KIIT Saathi - the all-in-one campus management platform for KIIT students.

## 📋 Documentation Structure

This documentation is organized into the following sections:

### 1. **Getting Started**
   - [Quick Start Guide](./QUICK_START.md) - Start here if you're new
   - [Application Overview](./APPLICATION_OVERVIEW.md) - Understand the system architecture
   - [Data Flow & Architecture](./DATA_FLOW_ARCHITECTURE.md) - Visual diagrams of data flows

### 2. **API Services**
   - [API Index](./SERVICES/API_INDEX.md) - Quick reference for all endpoints
   - **Authentication Services** - User login, signup, verification
   - **Profile Services** - User profile management
   - **Contact Service** - Contact form submission
   - **Split Saathi** - Expense sharing and settlement
   - **Lost & Found** - Lost item reporting and contact unlock
   - **Payments** - Payment processing and verification
   - **Study Materials** - Upload, review, and approval system
   - **Admin Services** - Administrative functions
   - **Other Services** - Events, Faculty, Interviews, Societies

### 3. **Database**
   - Complete schema documentation
   - Table relationships
   - Data models

---

## 🚀 Quick Navigation

### For API Users
1. Read [Quick Start Guide](./QUICK_START.md)
2. Check [API Index](./SERVICES/API_INDEX.md) for endpoint list
3. Visit specific service docs for details

### For Developers
1. Review [Application Overview](./APPLICATION_OVERVIEW.md)
2. Study [Data Flow Architecture](./DATA_FLOW_ARCHITECTURE.md)
3. Check individual service implementations

### For Admins
1. See [API Index](./SERVICES/API_INDEX.md)
2. Review admin-specific endpoints
3. Check [Application Overview](./APPLICATION_OVERVIEW.md) for system overview

---

## 📚 Complete Service Documentation

### Authentication (`/api/auth`)
| Service | Endpoint | Method | Doc |
|---------|----------|--------|-----|
| Sign Up | `/signup` | POST | [SIGNUP.md](./SERVICES/Auth/SIGNUP.md) |
| Sign In | `/signin` | POST | [SIGNIN.md](./SERVICES/Auth/SIGNIN.md) |
| Sign Out | `/signout` | POST | [SIGNOUT.md](./SERVICES/Auth/SIGNOUT.md) |
| Forgot Password | `/forgot-password` | POST | [FORGOT_PASSWORD.md](./SERVICES/Auth/FORGOT_PASSWORD.md) |
| Email Verification | `/verify-email-callback` | POST | [EMAIL_VERIFICATION.md](./SERVICES/Auth/EMAIL_VERIFICATION.md) |
| Session | `/session` | GET | [SESSION.md](./SERVICES/Auth/SESSION.md) |

### Profile (`/api/profile`)
| Service | Endpoint | Method | Doc |
|---------|----------|--------|-----|
| Get/Update Profile | `/` | GET/PUT | [PROFILE.md](./SERVICES/Profile/PROFILE.md) |
| Ensure User | `/ensure` | POST | [ENSURE_USER.md](./SERVICES/Profile/ENSURE_USER.md) |

### Contact (`/api/contact`)
| Service | Endpoint | Method | Doc |
|---------|----------|--------|-----|
| Submit Form | `/` | POST | [CONTACT.md](./SERVICES/Contact/CONTACT.md) |

### Split Saathi (`/api/split-saathi`)
| Service | Endpoint | Method | Doc |
|---------|----------|--------|-----|
| Create Group | `/create-group` | POST | [CREATE_GROUP.md](./SERVICES/SplitSaathi/CREATE_GROUP.md) |
| User Groups | `/user-groups` | POST | [USER_GROUPS.md](./SERVICES/SplitSaathi/USER_GROUPS.md) |
| Auto Link | `/auto-link` | POST | [AUTO_LINK.md](./SERVICES/SplitSaathi/AUTO_LINK.md) |
| Group Details | `/group/[groupID]` | GET | [GROUP_DETAILS.md](./SERVICES/SplitSaathi/GROUP_DETAILS.md) |

### Lost & Found (`/api/lostfound`)
| Service | Endpoint | Method | Doc |
|---------|----------|--------|-----|
| Submit Item | `/submit-lost-item-application` | POST | [SUBMIT_ITEM.md](./SERVICES/LostFound/SUBMIT_ITEM.md) |
| View Items | `/items` | GET | [VIEW_ITEMS.md](./SERVICES/LostFound/VIEW_ITEMS.md) |
| Create Unlock Order | `/create-application-unlock-order` | POST | [CREATE_UNLOCK_ORDER.md](./SERVICES/LostFound/CREATE_UNLOCK_ORDER.md) |
| Verify Payment | `/verify-application-unlock-payment` | POST | [VERIFY_PAYMENT.md](./SERVICES/LostFound/VERIFY_PAYMENT.md) |
| Contact Details | `/has-paid-lost-found-contact` | GET | [CONTACT_DETAILS.md](./SERVICES/LostFound/CONTACT_DETAILS.md) |

### Payments (`/api/payments`)
| Service | Endpoint | Method | Doc |
|---------|----------|--------|-----|
| Create Order | `/create-lost-found-order` | POST | [LOSTFOUND_PAYMENT.md](./SERVICES/Payments/LOSTFOUND_PAYMENT.md) |
| Send Details | `/send-contact-details` | POST | [LOSTFOUND_PAYMENT.md](./SERVICES/Payments/LOSTFOUND_PAYMENT.md) |

### Study Materials (`/api/study-materials`)
| Service | Endpoint | Method | Doc |
|---------|----------|--------|-----|
| Upload | `/upload` | POST | [UPLOAD.md](./SERVICES/StudyMaterials/UPLOAD.md) |
| Preview | `/preview` | GET | [PREVIEW.md](./SERVICES/StudyMaterials/PREVIEW.md) |

### Admin (`/api/admin`)
| Service | Endpoint | Method | Doc |
|---------|----------|--------|-----|
| Approve Material | `/study-material-approve` | POST | [ADMIN.md](./SERVICES/Admin/ADMIN.md) |
| Reject Material | `/study-material-reject` | POST | [ADMIN.md](./SERVICES/Admin/ADMIN.md) |

---

## 📖 Documentation Features

Every API endpoint documentation includes:

✅ **Overview** - What the service does  
✅ **Endpoint Details** - Path, method, auth requirements  
✅ **Inputs** - Request body schema and example  
✅ **Outputs** - Response structure with examples  
✅ **Validations** - Input validation rules  
✅ **Dependencies** - Required services and environment variables  
✅ **Data Flow** - Step-by-step process flow  
✅ **Success Examples** - Real request/response examples  
✅ **Error Examples** - Common errors and solutions  
✅ **Usage Examples** - Frontend implementation code  
✅ **Related Services** - Links to related endpoints  
✅ **Versioning** - API version history  

---

## 🔑 Key Information

### Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

### Base URL
- **Development**: `http://localhost:3000/api`
- **Production**: `https://ksaathi.vercel.app/api`

### Content Type
All requests must have:
```
Content-Type: application/json
```

### Response Format
All responses are in JSON format:
```json
{
  "data": "response data",
  "error": "error message if failed",
  "success": true/false
}
```

---

## 🔐 Security

- All sensitive data should be passed in the request body, not URL
- Tokens should be stored securely (httpOnly cookies preferred)
- Always validate input on the frontend and backend
- Use HTTPS in production
- Implement rate limiting for production use

---

## 📊 Data Flow Overview

```
Client Request
    ↓
Frontend Validation
    ↓
API Endpoint (/api/...)
    ↓
Backend Validation
    ↓
Business Logic
    ↓
Database Operations
    ↓
Response Sent
    ↓
Client Handles Response
```

For detailed data flows, see [Data Flow Architecture](./DATA_FLOW_ARCHITECTURE.md)

---

## 🛠️ Development Guide

### Setting Up Development Environment
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up `.env.local` with required variables
4. Start dev server: `npm run dev`
5. APIs available at `http://localhost:3000/api`

### Testing APIs
- Use Postman for GUI-based testing
- Use cURL for command-line testing
- Check [Quick Start Guide](./QUICK_START.md) for examples

### Debugging
1. Check server logs in terminal
2. Use browser DevTools Network tab
3. Verify token format and expiry
4. Check database connections

---

## 📝 Common Use Cases

### User Registration & Login
1. User fills signup form
2. System validates KIIT email
3. User receives confirmation email
4. User clicks confirmation link
5. User can now sign in

See: [SIGNUP.md](./SERVICES/Auth/SIGNUP.md), [SIGNIN.md](./SERVICES/Auth/SIGNIN.md)

### Creating Expense Group
1. User creates group with name and members
2. System stores group in database
3. Other users can join via roll number linking
4. Users add expenses
5. System calculates who owes whom

See: [CREATE_GROUP.md](./SERVICES/SplitSaathi/CREATE_GROUP.md), [USER_GROUPS.md](./SERVICES/SplitSaathi/USER_GROUPS.md)

### Reporting Lost Item
1. User reports lost item with photos
2. Item listed publicly (contact hidden)
3. Interested user pays ₹50 to unlock contact
4. System verifies payment
5. Contact details revealed
6. Users can communicate directly

See: [SUBMIT_ITEM.md](./SERVICES/LostFound/SUBMIT_ITEM.md), [VERIFY_PAYMENT.md](./SERVICES/LostFound/VERIFY_PAYMENT.md)

---

## ❓ FAQ

**Q: How do I get an access token?**  
A: Sign in using `/api/auth/signin` endpoint. You'll receive `access_token` in response.

**Q: How long is a token valid?**  
A: By default, 3600 seconds (1 hour). Use refresh token to get a new one.

**Q: Can I test APIs without authentication?**  
A: Yes, some endpoints are public (Sign Up, Contact, Faculty list). Protected endpoints require a token.

**Q: What's the difference between access and refresh token?**  
A: Access token is short-lived and used for requests. Refresh token is long-lived and used to get new access tokens.

**Q: How do I handle expired tokens?**  
A: Use the refresh token to request a new access token, or ask user to sign in again.

**Q: Where can I report API bugs?**  
A: Create an issue on GitHub or email support@kiitsaathi.com

---

## 🤝 Contributing

Found an issue in the documentation? Want to improve it?
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📞 Support

- **Email**: support@kiitsaathi.com
- **GitHub Issues**: [Report a bug](https://github.com/KIIT-Saathi/KIIT-Saathi-Web/issues)
- **Documentation**: This folder
- **Status Page**: [Check API status](https://status.kiitsaathi.com)

---

## 📅 Versioning

**Current API Version**: 1.0.0

### Version History
| Version | Release Date | Changes |
|---------|--------------|---------|
| 1.0.0 | Dec 2024 | Initial API release |

### Upcoming
- [ ] Rate limiting implementation
- [ ] API keys for third-party integrations
- [ ] Webhooks support
- [ ] GraphQL endpoint
- [ ] WebSocket for real-time updates

---

## 📄 License

All API documentation and specifications are licensed under the MIT License.

---

## ✨ Credits

**Documentation Created By**: KIIT Saathi Development Team  
**Last Updated**: December 2024  
**Maintained By**: KIIT Saathi Team

---

## 🎯 Quick Links

| Document | Purpose |
|----------|---------|
| [Quick Start](./QUICK_START.md) | Learn API basics quickly |
| [Application Overview](./APPLICATION_OVERVIEW.md) | Understand system architecture |
| [API Index](./SERVICES/API_INDEX.md) | Find all endpoints |
| [Data Flow](./DATA_FLOW_ARCHITECTURE.md) | See how data flows |
| [Table of Contents](./TABLE_OF_CONTENTS.md) | Navigate all docs |

---

**Happy Coding!** 🚀

For the latest updates, visit: [KIIT Saathi Documentation](https://github.com/KIIT-Saathi/KIIT-Saathi-Web/tree/main/Documentation)
