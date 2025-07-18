# 🔒 SECURITY DOCUMENTATION

## Overview
This application implements multiple layers of security to protect sensitive competitor intelligence data.

## Security Measures

### 1. Authentication & Access Control
- **NextAuth.js** for secure authentication
- **Session-based** authentication with JWT tokens
- **8-hour session timeout** for security
- **Secure password hashing** with bcrypt (12 rounds)

### 2. Network Security
- **IP Whitelisting**: Configure allowed IPs in middleware
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **DDoS Protection**: Automatic request throttling
- **Security Headers**: XSS, CSRF, clickjacking protection

### 3. API Security
- **Authentication required** for all API endpoints
- **Request validation** and sanitization
- **Internal API keys** for scraping endpoints
- **Secure error handling** (no sensitive data leakage)

### 4. Data Protection
- **Database encryption** in transit and at rest
- **Environment variable protection**
- **Secure session storage**
- **Audit logging** for all data access

### 5. Monitoring & Logging
- **Security event logging** for all access attempts
- **Failed login tracking**
- **IP-based access monitoring**
- **Unauthorized access alerts**

## Production Security Checklist

### Before Deployment:
- [ ] Change default admin credentials
- [ ] Generate strong NEXTAUTH_SECRET (32+ characters)
- [ ] Configure IP whitelist for your organization
- [ ] Set up production database with encryption
- [ ] Configure environment variables securely
- [ ] Review and update allowed domains in CORS

### After Deployment:
- [ ] Test login functionality
- [ ] Verify IP restrictions work
- [ ] Check security headers are applied
- [ ] Test rate limiting
- [ ] Monitor security logs
- [ ] Set up monitoring alerts

## Environment Variables Security

### Required for Production:
```env
NEXTAUTH_SECRET="generate-a-32-character-random-string"
NEXTAUTH_URL="https://your-production-domain.com"
ADMIN_EMAIL="your-admin-email@company.com"
ADMIN_PASSWORD_HASH="bcrypt-hashed-password"
INTERNAL_API_KEY="your-internal-api-key"
DATABASE_URL="encrypted-production-database-url"
```

### To Generate Secure Password Hash:
```bash
node -e "console.log(require('bcryptjs').hashSync('your-password', 12))"
```

### To Generate Secure Secret:
```bash
openssl rand -base64 32
```

## IP Whitelisting Configuration

Edit `src/lib/security/middleware.ts`:

```typescript
const ALLOWED_IPS = [
  "203.0.113.1",      // Office IP
  "198.51.100.1",     // Home office IP
  "192.168.1.0/24",   // Internal network
]
```

## Rate Limiting Configuration

Current settings (adjust in middleware.ts):
- **Window**: 15 minutes
- **Max Requests**: 100 per IP
- **Storage**: In-memory (use Redis for production clustering)

## Security Headers

Automatically applied to all responses:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000`
- `Content-Security-Policy: [strict policy]`

## Monitoring Integration

The app logs security events. Integrate with:
- **Datadog** for monitoring
- **Sentry** for error tracking
- **CloudFlare** for additional DDoS protection

## Incident Response

1. **Suspicious Activity**: Check security logs
2. **Failed Logins**: Review IP and timing patterns
3. **Rate Limit Hits**: Investigate source and legitimacy
4. **Data Access**: All access is logged with user/IP/timestamp

## Regular Security Tasks

- **Weekly**: Review access logs
- **Monthly**: Update dependencies
- **Quarterly**: Security audit and penetration testing
- **Annually**: Full security assessment

## Contact

For security issues or questions, contact: [your-security-team@company.com]

---

**⚠️ IMPORTANT: This application contains sensitive competitor intelligence data. Unauthorized access is strictly prohibited and may result in legal action.**