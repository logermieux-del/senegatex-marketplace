# CLAUDE.md — Senegatex Marketplace Architecture

## 🎯 Objectif
Marketplace pour acheter/vendre localement au Sénégal (style Leboncoin/Vinted).

**Key metrics:** 
- 1000+ listings par mois (MVP)
- 100+ utilisateurs actifs (Day 30)
- $0 until Day 30 (local Docker)
- 60-100€/mois Hostinger (Day 11+)

---

## 📊 Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **UI:** React 19 + TypeScript + Tailwind CSS
- **Components:** shadcn/ui (pre-built, accessible)
- **Testing:** Playwright (E2E) + Vitest (unit)

### Backend
- **Runtime:** Next.js API Routes (no external server)
- **Auth:** NextAuth.js v4 (sessions + refresh tokens)
- **Validation:** Zod (runtime type checking)
- **Database ORM:** Prisma v5 (type-safe, migrations)
- **Search:** Meilisearch (< 200ms, self-hosted)
- **Cache:** Redis (session store, rate limiting)

### Database (PostgreSQL)
```
Tables:
- User (id, email, phone, name, avatar, role, createdAt)
- Listing (id, userId, title, description, price, status, photos, createdAt)
- Message (id, fromUserId, toUserId, listingId, body, createdAt)
- Transaction (id, listingId, buyerId, sellerId, amount, status, paymentMethod)
- Review (id, fromUserId, toUserId, rating, comment, createdAt)
- Report (id, listingId, reason, status, reviewedBy, createdAt)
```

### External Services
| Service | Purpose | Cost | Env Var |
|---------|---------|------|---------|
| Cloudinary | Image CDN | €10-30/mo | `CLOUDINARY_URL` |
| Resend | Email | €10-30/mo | `RESEND_API_KEY` |
| Stripe | Cards | 2.9% + $0.30 | `STRIPE_SECRET_KEY` |
| Wave | Mobile Money | Free | `WAVE_API_KEY` |
| Orange Money | Mobile Money | Free | `ORANGE_MONEY_API_KEY` |

---

## 🏗 Architecture Decisions

### Why NextAuth (not custom JWT)?
- ✅ Session management built-in (Redis store)
- ✅ Secure refresh token rotation
- ✅ CSRF protection automatic
- ✅ OAuth ready (GitHub, Google, etc.)

### Why Meilisearch (not PostgreSQL LIKE)?
- ✅ Instant results (< 200ms)
- ✅ Typo tolerance ("dakar" finds "dakaar")
- ✅ Faceted search (price range, city)
- ✅ Scales to 1M listings without query delays

### Why Prisma (not raw SQL)?
- ✅ Type-safe queries (catch bugs at build time)
- ✅ Built-in migrations (git-tracked schema changes)
- ✅ Automatic schema generation from code
- ✅ Protection against SQL injection

### Why Cloudinary (not local storage)?
- ✅ No disk space limits
- ✅ Automatic image optimization
- ✅ CDN (fast globally)
- ✅ HEIC → WebP conversion
- ✅ On-the-fly resizing (thumb, full-size)

### Why Docker Compose (not Vercel)?
- ✅ Full control (rate limiting, cron jobs)
- ✅ Cheap hosting (€20-30/mo Hostinger)
- ✅ No vendor lock-in
- ✅ Self-hosted Meilisearch (no API costs)

---

## 📁 Directory Structure

```
/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Homepage
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/
│   │   │   ├── listings/page.tsx     # User's listings
│   │   │   ├── messages/page.tsx
│   │   │   ├── purchases/page.tsx
│   │   │   └── layout.tsx            # Requires auth
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts  # NextAuth
│   │   │   ├── listings/route.ts     # CRUD
│   │   │   ├── listings/[id]/route.ts
│   │   │   ├── search/route.ts       # Meilisearch proxy
│   │   │   ├── messages/route.ts
│   │   │   ├── payments/stripe/route.ts
│   │   │   ├── payments/wave/route.ts
│   │   │   ├── admin/reports/route.ts
│   │   │   └── health/route.ts       # Uptime monitoring
│   │   └── error.tsx, not-found.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Navigation.tsx
│   │   ├── listings/
│   │   │   ├── ListingCard.tsx
│   │   │   ├── ListingForm.tsx
│   │   │   ├── ListingDetail.tsx
│   │   │   └── PhotoUpload.tsx
│   │   ├── search/
│   │   │   ├── SearchBar.tsx
│   │   │   └── FilterPanel.tsx
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   └── SignupForm.tsx
│   │   └── common/
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Modal.tsx
│   │       └── Loading.tsx
│   ├── lib/
│   │   ├── db.ts                     # Prisma client
│   │   ├── auth.ts                   # NextAuth config
│   │   ├── validators.ts             # Zod schemas
│   │   ├── errors.ts                 # Custom error types
│   │   ├── api/
│   │   │   ├── listings.ts
│   │   │   ├── messages.ts
│   │   │   └── payments.ts
│   │   ├── external/
│   │   │   ├── stripe.ts
│   │   │   ├── wave.ts
│   │   │   ├── orange-money.ts
│   │   │   └── cloudinary.ts
│   │   ├── search/
│   │   │   └── meilisearch.ts
│   │   └── utils/
│   │       ├── format.ts             # Date, currency formatting
│   │       ├── validation.ts
│   │       └── constants.ts          # Cities, categories, etc.
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useListings.ts
│   │   └── useMessages.ts
│   └── prisma/
│       ├── schema.prisma             # Database schema
│       └── seed.ts                   # Initial data
├── scripts/
│   ├── seed.ts                       # npm run db:seed
│   ├── deploy.sh                     # Hostinger deployment
│   ├── backup.sh                     # Database backup
│   ├── security-check.js             # OWASP audit
│   └── healthcheck.sh                # Uptime monitoring
├── .github/
│   └── workflows/
│       ├── test.yml                  # Lint + test on PR
│       ├── deploy.yml                # Deploy on merge to main
│       └── security.yml              # Security scan
├── tests/
│   ├── unit/
│   │   ├── validators.test.ts
│   │   └── utils.test.ts
│   └── e2e/
│       ├── auth.spec.ts              # Login/signup
│       ├── listings.spec.ts          # Create/view/delete
│       ├── search.spec.ts
│       ├── messages.spec.ts
│       └── payments.spec.ts          # Stripe + Wave
├── docs/
│   ├── DECISIONS.md                  # Architecture choices
│   ├── API.md                        # API endpoint docs
│   ├── SETUP.md                      # Dev environment
│   ├── DEPLOYMENT.md                 # Hostinger VPS
│   ├── SECURITY.md                   # Audit checklist
│   └── MODERATION.md                 # Content rules
├── .env.local.example                # Template (check into git)
├── docker-compose.yml                # Local dev environment
├── Dockerfile                        # Production image
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
├── prisma.config.js
└── .gitignore
```

---

## 🔑 Environment Variables

**File: `.env.local`** (DO NOT COMMIT)

```bash
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/senegatex"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"

# Redis (session store)
REDIS_URL="redis://localhost:6379"

# Meilisearch
MEILISEARCH_URL="http://localhost:7700"
MEILISEARCH_MASTER_KEY="your-master-key"

# Cloudinary
CLOUDINARY_URL="cloudinary://key:secret@cloud"

# Stripe
STRIPE_SECRET_KEY="sk_test_xxx"
STRIPE_PUBLISHABLE_KEY="pk_test_xxx"

# Wave (Senegal mobile money)
WAVE_API_KEY="xxxx"
WAVE_API_URL="https://api.wave.com/graphql"

# Orange Money (Senegal)
ORANGE_MONEY_API_KEY="xxxx"
ORANGE_MONEY_API_URL="https://api.orange.sn/..."

# Email (Resend)
RESEND_API_KEY="re_xxxx"

# API Base URLs
NEXT_PUBLIC_API_URL="http://localhost:3000"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_xxx"

# Feature flags
NEXT_PUBLIC_ENABLE_WAVE=true
NEXT_PUBLIC_ENABLE_ORANGE_MONEY=true
```

**File: `.env.local.example`** (COMMIT THIS)
- Same structure as `.env.local`
- Replace real values with `xxx` or descriptive placeholders
- Use `npm run dev` to generate `.env.local` from template

---

## 🔐 Security Principles

### Input Validation
- ✅ **All user input validated with Zod** before DB writes
- ✅ **API routes check auth** via NextAuth middleware
- ✅ **SQL injection prevented** by Prisma (parameterized queries)
- ✅ **XSS prevented** by React (JSX escaping) + DOMPurify for user-generated content

### Authentication
- ✅ **NextAuth sessions** stored in Redis (encrypted)
- ✅ **Refresh tokens** auto-rotated every 7 days
- ✅ **Passwords** hashed with bcrypt (cost 12)
- ✅ **2FA** for sellers (optional, Phase 5+)

### API Security
- ✅ **Rate limiting:** 100 reqs/min per IP (API routes)
- ✅ **CORS:** Only `localhost:3000` in dev, `senegatex.sn` in prod
- ✅ **CSRF protection:** NextAuth built-in
- ✅ **Content Security Policy:** Strict headers in nginx
- ✅ **API versioning:** `/api/v1/*` (future-proof)

### Data Protection
- ✅ **PII encrypted at rest** (email, phone)
- ✅ **Stripe PCI compliance** (never store full card numbers)
- ✅ **Wave webhook validation** (signed requests)
- ✅ **Audit logging** (all admin actions recorded)

### Compliance
- ✅ **GDPR-ready:** User export/delete endpoints
- ✅ **Senegal DPA:** Comply with local data protection
- ✅ **AML/KYC:** Wave/Stripe handle ID verification
- ✅ **Accessibility:** WCAG 2.1 AA (all pages tested)

---

## 🧪 Testing Strategy

### Unit Tests (Vitest)
```bash
npm run test
```
- **Coverage target:** > 80%
- **Focus:** Validators (Zod), utilities, business logic
- **Command:** `vitest --run` (CI), `vitest --watch` (dev)

### E2E Tests (Playwright)
```bash
npm run test:e2e
```
- **Real browser:** Chromium, Firefox, WebKit
- **Real database:** Separate `test_senegatex` DB
- **Tests:**
  - Auth (signup, login, logout, forgot password)
  - Listings (create, view, edit, delete, with photos)
  - Search (filters, sorting, pagination)
  - Messages (send, receive, notifications)
  - Payments (Stripe card, Wave USSD)
  - Admin (reports, moderation, bans)
- **Command:** `playwright test --headed` (debug)

### Performance Tests (Lighthouse)
```bash
npm run lighthouse
```
- **Metrics:** LCP < 2.5s, CLS < 0.1, FID < 100ms
- **Targets:** Performance ≥ 85, Accessibility ≥ 90

---

## 📱 Localization

### Languages
- **French (FR):** Primary
- **Wolof (WO):** Secondary (Phase 3+)

### Region-Specific
- **Phone format:** +221 XXXX XXXX (Senegal)
- **Currency:** XOF (West African CFA franc)
- **Mobile Money:** Wave, Orange Money, Free Money
- **Cities:** Dakar, Thiès, Kaolack, Saint-Louis, etc.
- **Timezone:** UTC+0 (no DST)

### Implementation
```typescript
// src/lib/utils/i18n.ts
import { useRouter } from 'next/router';
const locale = useRouter().locale; // 'fr' | 'wo'
```

---

## ⚡ Performance Targets

| Metric | Target | Tool |
|--------|--------|------|
| Homepage LCP | < 2.5s | Lighthouse |
| Search results | < 200ms | Meilisearch |
| Listing detail page | < 1.5s | Lighthouse |
| Image load (thumb) | < 500ms | Cloudinary |
| DB query (indexed) | < 50ms | PostgreSQL |
| API response | < 100ms | Next.js |

### Optimization Checklist
- ✅ `next/image` for all images (auto-resize)
- ✅ Prisma query indexing (id, userId, createdAt, status)
- ✅ Redis caching for expensive queries
- ✅ Meilisearch for full-text search (not LIKE)
- ✅ CDN for static assets (Cloudinary)
- ✅ Gzip compression on nginx
- ✅ Database connection pooling (PgBouncer)

---

## 🚀 Workflow (How Claude Works on This Project)

### Before starting ANY task:
1. **Read CLAUDE.md** (this file)
2. **Check git status** (`git log --oneline -5`)
3. **Read relevant file** before editing (security + context)
4. **Run tests** after changes (`npm run test`)
5. **Commit with standard message** (see below)

### Branching
```bash
git checkout -b feature/user-auth        # New feature
git checkout -b fix/listings-search      # Bug fix
git checkout -b refactor/api-types       # Refactoring
git checkout -b docs/setup-guide         # Documentation
```

### Commit Messages (Conventional Commits)
```
feat(auth): implement NextAuth login
fix(listings): sort by createdAt descending
refactor(api): consolidate error handling
docs(setup): add Hostinger VPS instructions
test(payments): add Stripe webhook test
```

### Code Review Checklist
- ✅ Linter passes: `npm run lint`
- ✅ Tests pass: `npm run test && npm run test:e2e`
- ✅ TypeScript: `npm run type-check`
- ✅ No console.log in production code
- ✅ Zod validation on all user input
- ✅ Error handling (try/catch or .catch())
- ✅ Database: Prisma queries only (no raw SQL)
- ✅ Images: Use next/image (not <img>)
- ✅ Auth: Check NextAuth session in protected routes

### Database Changes
```bash
# Create schema change
# Edit src/prisma/schema.prisma

# Generate migration
npm run db:migrate

# Review migration in prisma/migrations/

# Commit BOTH schema.prisma + migration folder
git add src/prisma/ && git commit -m "feat(db): add Review table"
```

---

## 🐛 Common Issues & Solutions

### PostgreSQL not connecting
```bash
docker-compose logs db
# Check: DATABASE_URL, port 5432, container running
docker-compose down && docker-compose up -d
```

### Meilisearch out of sync
```bash
# Reindex from database
npm run db:seed
# Verify search works at localhost:7700/indexes/listings
```

### NextAuth session not persisting
```bash
# Check Redis: docker-compose logs redis
# Verify: REDIS_URL in .env.local
# Clear browser cookies and retry
```

### Build fails: Missing types
```bash
npm run type-check
# Fix TypeScript errors, then
npm run build
```

---

## 📞 Phase Checkpoints

**Day 1:** ✅ Git init, Next.js setup, CLAUDE.md, Docker Compose
**Day 2-3:** 📍 Prisma schema, NextAuth setup, API routes skeleton
**Day 4-5:** 🔨 CRUD listings, Meilisearch integration
**Day 6-7:** 📸 Cloudinary uploads, photo management
**Day 8-9:** 💳 Stripe integration, Wave integration
**Day 10-11:** 💬 Messages, notifications, moderation system
**Day 12-13:** 🚀 Hostinger VPS setup, GitHub Actions CI/CD
**Day 14+:** 📊 Monitoring, performance tuning, launch prep

---

## 🎯 Key Principles (Read This!)

1. **Type Safety First:** TypeScript everywhere. Catch bugs at build time.
2. **Security by Default:** Validate all input, use Prisma, check auth on protected routes.
3. **Tests Before Code:** Write E2E test first, then implement feature.
4. **Simple > Clever:** Readable code beats fancy patterns. 3 similar lines? OK. Abstract only when clear.
5. **Git Hygiene:** One feature per branch, descriptive commit messages, small PRs.
6. **Scalability Mindset:** Indexes on DB queries, Meilisearch for search, Cloudinary for images.
7. **Mobile-First UI:** Design for 375px width first, then scale up.

---

## 📚 External References

- **Next.js Docs:** https://nextjs.org/docs
- **Prisma Docs:** https://prisma.io/docs
- **NextAuth Docs:** https://next-auth.js.org
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Zod Validation:** https://zod.dev
- **Playwright Testing:** https://playwright.dev
- **OWASP Top 10:** https://owasp.org/www-project-top-ten/
- **Stripe API:** https://stripe.com/docs/api
- **Wave API Docs:** https://wave.com/en/developers

---

**Version:** 1.0 (Day 1)  
**Last Updated:** 2026-07-31  
**Maintainer:** Claude Code (team lead)
