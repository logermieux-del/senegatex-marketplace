# Performance & Security Guide - Senegatex

## ⚡ Performance Optimization (Phase 7C)

### 1. Image Optimization

**Current:** Using Next.js `<Image>` component with Cloudinary

**Optimizations:**
```javascript
// ✅ Automatic via next/image
<Image
  src={url}
  alt="Listing"
  width={400}
  height={300}
  quality={80}
  placeholder="blur"
  blurDataURL="data:image/..."
  responsive
/>

// ✅ Cloudinary auto-transforms
// https://res.cloudinary.com/cloud/image/upload/w_400,q_auto,f_auto/listing.jpg
```

**Targets:**
- Thumbnail load: < 200ms
- Full image load: < 500ms
- LCP (Largest Contentful Paint): < 2.5s

### 2. Code Splitting & Lazy Loading

```typescript
// ✅ Dynamic imports for heavy components
import dynamic from 'next/dynamic';

const AdminDashboard = dynamic(() => import('./AdminDashboard'), {
  loading: () => <Loading />,
  ssr: false, // Skip SSR for admin
});

// ✅ Route-based code splitting (automatic via App Router)
// /app/(dashboard)/listings/page.tsx → separate chunk
// /app/(auth)/login/page.tsx → separate chunk
```

**Bundle Analysis:**
```bash
npm install --save-dev @next/bundle-analyzer

# See bundle sizes
npm run analyze
```

### 3. Database Indexing

**Current Indexes:**
```sql
-- User table
CREATE INDEX idx_users_email ON "User"(email);
CREATE INDEX idx_users_phone ON "User"(phone);
CREATE INDEX idx_users_active ON "User"(isActive);

-- Listing table
CREATE INDEX idx_listings_user ON "Listing"(userId);
CREATE INDEX idx_listings_status ON "Listing"(status);
CREATE INDEX idx_listings_city ON "Listing"(city);
CREATE INDEX idx_listings_category ON "Listing"(category);
CREATE INDEX idx_listings_created ON "Listing"(createdAt DESC);

-- Message table
CREATE INDEX idx_messages_from ON "Message"(fromUserId);
CREATE INDEX idx_messages_to ON "Message"(toUserId);
CREATE INDEX idx_messages_listing ON "Message"(listingId);
CREATE INDEX idx_messages_created ON "Message"(createdAt DESC);

-- Transaction table
CREATE INDEX idx_transactions_user ON "Transaction"(sellerId, buyerId);
CREATE INDEX idx_transactions_status ON "Transaction"(paymentStatus);
CREATE INDEX idx_transactions_created ON "Transaction"(createdAt DESC);
```

### 4. Caching Strategy

**Browser Cache (static assets):**
```
CSS/JS: 1 year (immutable with content hash)
Images: 1 year (via Cloudinary)
HTML: no-cache (always check)
```

**Server Cache (Redis):**
```typescript
// Cache expensive queries
const listings = await redis.get('listings:all');
if (!listings) {
  listings = await prisma.listing.findMany({ take: 100 });
  await redis.set('listings:all', listings, 'EX', 3600); // 1 hour
}

// Cache user data
const user = await redis.get(`user:${id}`);
if (!user) {
  user = await prisma.user.findUnique({ where: { id } });
  await redis.set(`user:${id}`, user, 'EX', 3600);
}
```

**API Response Caching:**
```typescript
// Immutable data
export const revalidate = 86400; // 24 hours

// Dynamic data
export const revalidate = 60; // 1 minute

// Real-time data
export const revalidate = 0; // Disabled
```

### 5. Database Query Optimization

```typescript
// ❌ Bad: N+1 queries
const listings = await prisma.listing.findMany();
for (const listing of listings) {
  const seller = await prisma.user.findUnique({
    where: { id: listing.userId }
  });
  // N queries for N listings
}

// ✅ Good: Single query with joins
const listings = await prisma.listing.findMany({
  include: {
    user: { select: { id: true, name: true, avatar: true } }
  }
});
```

### 6. Monitoring Performance

```bash
# Lighthouse CI
npm run lighthouse

# Web Vitals
npm run analytics

# Performance Dashboard
https://senegatex.sn/admin → Performance tab (coming soon)
```

**Targets:**
| Metric | Target |
|--------|--------|
| LCP | < 2.5s |
| FID | < 100ms |
| CLS | < 0.1 |
| Performance Score | ≥ 85 |
| Accessibility | ≥ 90 |

---

## 🔒 Security Hardening (Phase 7D)

### 1. Input Validation (Defense in Depth)

**Client-side:**
```typescript
// Zod validation
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
```

**Server-side (Always validate):**
```typescript
// Never trust client input
const validated = schema.parse(body);

// Rate limiting by IP
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));
```

**Database:**
```typescript
// Prisma prevents SQL injection (parameterized queries)
// ✅ Safe
await prisma.user.findUnique({ where: { email: userInput } });

// ❌ Never do this
await db.$queryRaw`SELECT * FROM users WHERE email = ${userInput}`;
```

### 2. Authentication & Authorization

**Passwords:**
```typescript
// bcryptjs with cost 12
const hashed = await bcrypt.hash(password, 12);
const isValid = await bcrypt.compare(input, hashed);
```

**Sessions:**
```typescript
// NextAuth with Redis store (encrypted)
// Sessions auto-expire after 24 hours
// Refresh token rotation every 7 days
```

**API Keys:**
```typescript
// Never commit .env files
.env.local → .gitignore ✅
.env.production → VPS only ✅
Rotate every 90 days ⏰
```

### 3. API Security

**CORS:**
```typescript
// Only allow frontend origin
app.use(cors({
  origin: process.env.NEXTAUTH_URL,
  credentials: true
}));
```

**Rate Limiting:**
```
API endpoints: 30 req/sec per IP
Auth endpoints: 5 req/min per IP
Webhooks: No limit (verify signature)
```

**Webhook Signature Verification:**
```typescript
// ✅ Verify Stripe signature
const event = stripe.webhooks.constructEvent(
  body,
  signature,
  webhookSecret
);

// ✅ Verify Wave signature
const hash = crypto
  .createHmac('sha256', apiKey)
  .update(payload)
  .digest('base64');
```

### 4. Data Protection

**Encryption at Rest:**
```sql
-- Database passwords
-- Redis password
-- API keys in .env

-- PostgreSQL encryption (coming soon)
ALTER TABLE "User" ADD COLUMN email_encrypted bytea;
```

**TLS in Transit:**
```
HTTPS only (443) ✅
HTTP → HTTPS redirect (80) ✅
HSTS headers (1 year) ✅
```

**PII (Personally Identifiable Information):**
```typescript
// Don't log sensitive data
console.log({ password: '****', email: user.email }); // ✅

// Stripe never stores card numbers (PCI-DSS)
// Wave/Resend handle their own PII
```

### 5. OWASP Top 10 Checklist

| Vulnerability | Prevention |
|---|---|
| SQL Injection | Prisma (parameterized) |
| Authentication Bypass | NextAuth + rate limiting |
| Sensitive Data | HTTPS + encryption |
| XML External Entities | No XML parsing |
| Broken Access Control | Role-based auth (user/admin) |
| Security Misconfiguration | Docker security context |
| XSS | React auto-escaping + DOMPurify |
| Insecure Deserialization | No unsafe JSON.parse |
| Using Components with Known Vulns | npm audit + dependabot |
| Insufficient Logging | Structured logging to Sentry |

### 6. Security Headers

**Nginx:**
```
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: no-referrer-when-downgrade
Content-Security-Policy: default-src 'self' https:
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

### 7. Secrets Management

**DO:**
```bash
✅ Use .env.local (git-ignored)
✅ Use GitHub Secrets for CI/CD
✅ Rotate API keys every 90 days
✅ Use environment-specific credentials
✅ Log secret access (audit trail)
```

**DON'T:**
```bash
❌ Commit .env files
❌ Log full API responses
❌ Hardcode secrets in code
❌ Share credentials in messages
❌ Reuse keys across environments
```

### 8. Dependency Scanning

```bash
# Check for known vulnerabilities
npm audit

# Automated updates
npm install -g npm-check-updates
ncu --upgrade --interactive

# Lock versions to prevent supply-chain attacks
npm ci (not npm install)
```

### 9. Error Handling (Don't leak info)

```typescript
// ❌ Bad: Exposes system details
catch (error) {
  return res.status(500).json({ error: error.message });
}

// ✅ Good: Generic message
catch (error) {
  console.error('Database error:', error);
  return res.status(500).json({ error: 'Internal server error' });
}
```

### 10. Monitoring & Alerting

**Sentry (Error tracking):**
```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

**Webhook Failures:**
```
Monitor: /api/webhooks/* for 5xx errors
Alert: Slack if payment webhook fails
Log: All webhook payloads (sanitized)
```

---

## 🧪 Monitoring & Analytics (Phase 7E)

### Logging

```typescript
// Structured logging
logger.info('Payment processed', {
  transactionId: '123',
  amount: 500000,
  method: 'Stripe',
  status: 'COMPLETED'
});
```

### APM (Application Performance Monitoring)

```typescript
// Coming soon: New Relic integration
// Tracks:
// - API response times
// - Database query performance
// - Error rates
// - User journeys
```

### Uptime Monitoring

```
Ping senegatex.sn/api/health every 5 minutes
Alert if down for > 5 minutes
Runbook: Restart app container
```

---

## 📋 Security Audit Checklist

- [ ] All user input validated (client + server)
- [ ] HTTPS/SSL enabled with auto-renew
- [ ] Rate limiting on auth endpoints
- [ ] Webhook signatures verified
- [ ] Database passwords strong & unique
- [ ] API keys rotated (< 90 days old)
- [ ] No secrets in git history
- [ ] No console.log of sensitive data
- [ ] OWASP Top 10 mitigations in place
- [ ] Dependency vulnerabilities scanned
- [ ] Error messages don't leak info
- [ ] CORS whitelist configured
- [ ] Security headers set
- [ ] Database backups automated
- [ ] Admin access logged & audited

---

**Last Updated:** 2026-07-31
