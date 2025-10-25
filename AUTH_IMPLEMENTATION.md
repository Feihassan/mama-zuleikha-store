# Production-Grade Authentication & Authorization System

## 🔐 Implementation Overview

This system provides enterprise-level authentication and authorization with JWT tokens, role-based access control, and comprehensive security features.

## 🏗️ Architecture

### Backend Components

#### 1. Database Schema
```sql
-- Users table with enhanced security fields
users (
  id, name, email, password, role,
  email_verified, email_verification_token,
  password_reset_token, password_reset_expires,
  last_login, login_attempts, locked_until
)

-- Refresh tokens for secure session management
refresh_tokens (
  id, user_id, token, expires_at, device_info
)

-- Audit logs for security monitoring
audit_logs (
  id, user_id, action, resource, ip_address, user_agent
)
```

#### 2. JWT Token System
- **Access Tokens**: 15-minute expiry, stored in localStorage
- **Refresh Tokens**: 7-day expiry, HTTP-only cookies
- **Auto-refresh**: Tokens refresh automatically before expiry

#### 3. Security Features
- **Password Hashing**: bcrypt with 12 rounds
- **Rate Limiting**: 5 login attempts per 15 minutes
- **Account Locking**: 30-minute lockout after 5 failed attempts
- **Brute Force Protection**: IP-based rate limiting
- **Email Verification**: Required before account activation
- **Password Reset**: Secure token-based reset via email

### Frontend Components

#### 1. AuthContext
- Centralized authentication state management
- Automatic token refresh
- Role-based access control helpers

#### 2. ProtectedRoute
- Route-level authentication and authorization
- Role-based access control (admin, seller, customer)
- Automatic redirects for unauthorized access

## 🚀 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | User registration with email verification | No |
| POST | `/login` | User login with JWT tokens | No |
| POST | `/refresh` | Refresh access token | Refresh Token |
| POST | `/logout` | Logout and revoke tokens | Access Token |
| GET | `/verify-email/:token` | Verify email address | No |
| POST | `/forgot-password` | Request password reset | No |
| POST | `/reset-password` | Reset password with token | No |
| GET | `/me` | Get current user info | Access Token |

### Role-Based Access Control

#### Admin Routes
- Full access to all resources
- User management capabilities
- System configuration access

#### Seller Routes
- Manage own products only
- View orders for own products
- Limited dashboard access

#### Customer Routes
- View products and place orders
- Manage own profile and orders
- Basic user functionality

## 🛡️ Security Implementation

### Password Security
```javascript
// Password requirements
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter  
- At least 1 number
- At least 1 special character

// Hashing with bcrypt
const hashedPassword = await bcrypt.hash(password, 12);
```

### Rate Limiting
```javascript
// Authentication endpoints
- 5 attempts per 15 minutes per IP
- Account lockout after 5 failed attempts
- 30-minute lockout duration

// Registration endpoints  
- 3 registrations per hour per IP
```

### Token Security
```javascript
// Access Token (JWT)
- 15-minute expiry
- Stored in localStorage
- Contains user ID, email, role

// Refresh Token (JWT)
- 7-day expiry
- HTTP-only cookie
- Secure, SameSite=strict
- Contains only user ID
```

## 📱 Frontend Integration

### Using AuthContext
```jsx
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, login, logout, hasRole } = useAuth();
  
  // Check if user is admin
  if (hasRole('admin')) {
    // Show admin features
  }
  
  return <div>Welcome {user?.name}</div>;
}
```

### Protected Routes
```jsx
// Require authentication
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>

// Require specific role
<ProtectedRoute requiredRole="admin">
  <AdminPanel />
</ProtectedRoute>
```

## 🔧 Environment Configuration

### Required Environment Variables
```bash
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-refresh-secret-key

# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# Email (for verification/reset)
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Security
BCRYPT_ROUNDS=12
NODE_ENV=production
```

## 🚀 Deployment Checklist

### Security Hardening
- [ ] Strong JWT secrets (32+ characters)
- [ ] HTTPS enabled in production
- [ ] Secure cookie settings
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Helmet.js security headers
- [ ] Input validation on all endpoints

### Database Security
- [ ] Database connection encrypted
- [ ] User permissions restricted
- [ ] Regular backups configured
- [ ] Audit logging enabled

### Monitoring & Logging
- [ ] Failed login attempts logged
- [ ] Suspicious activity alerts
- [ ] Token refresh monitoring
- [ ] Error tracking configured

## 🔍 Testing Authentication

### Manual Testing
```bash
# Register new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Test123!@#"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!@#"}'

# Access protected route
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Default Admin Account
```
Email: admin@glowhub.com
Password: admin123
Role: admin
```

## 🛠️ Troubleshooting

### Common Issues

1. **Token Expired Errors**
   - Check token refresh logic
   - Verify JWT secrets match
   - Ensure cookies are being sent

2. **CORS Issues**
   - Update FRONTEND_URL in .env
   - Check credentials: 'include' in requests
   - Verify CORS configuration

3. **Email Verification Not Working**
   - Check SMTP configuration
   - Verify email credentials
   - Check spam folder

4. **Rate Limiting Too Strict**
   - Adjust rate limit settings
   - Check IP detection logic
   - Clear rate limit cache if needed

## 📈 Performance Optimization

### Token Management
- Automatic cleanup of expired tokens
- Efficient token validation
- Minimal database queries

### Caching Strategy
- Cache user roles and permissions
- Redis for session storage (optional)
- Efficient audit log rotation

## 🔮 Future Enhancements

### Planned Features
- [ ] Two-factor authentication (2FA)
- [ ] Social login (Google, Facebook)
- [ ] Device management
- [ ] Session management dashboard
- [ ] Advanced audit logging
- [ ] IP whitelisting/blacklisting

### Security Improvements
- [ ] Biometric authentication
- [ ] Risk-based authentication
- [ ] Advanced threat detection
- [ ] Compliance reporting (GDPR, etc.)

---

**Security Note**: This implementation follows industry best practices for authentication and authorization. Regular security audits and updates are recommended for production use.