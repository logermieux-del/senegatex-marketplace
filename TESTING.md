# Local Testing Guide — Yembal Marketplace

## Prerequisites
- Docker & Docker Compose v2+
- Node.js 20+
- npm 10+

---

## 1. Start Services with Docker Compose

```bash
# Start all services (PostgreSQL, Redis, Meilisearch, Next.js dev server)
docker compose up -d

# Watch logs
docker compose logs -f app

# Verify services are healthy
docker compose ps
```

**Services running:**
- App: http://localhost:3000
- PostgreSQL: localhost:5432 (user: test, pass: test, db: yembal_test)
- Redis: localhost:6379
- Meilisearch: http://localhost:7700

---

## 2. Initialize Database

```bash
# Run migrations
docker compose exec app npx prisma migrate deploy

# Seed test data
docker compose exec app npm run db:seed

# Verify schema
docker compose exec app npx prisma studio
```

Open http://localhost:5555 to browse the database in Prisma Studio.

---

## 3. Test Notifications System

### Create a notification manually:

```bash
curl -X POST http://localhost:3000/api/notifications \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -d '{
    "title": "Test Notification",
    "message": "This is a test",
    "type": "NEW_MESSAGE"
  }'
```

### Get notifications:

```bash
curl http://localhost:3000/api/notifications \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"
```

### Expected response:
```json
{
  "data": [
    {
      "id": "abc123",
      "title": "Test Notification",
      "message": "This is a test",
      "type": "NEW_MESSAGE",
      "isRead": false,
      "createdAt": "2026-08-04T15:00:00Z"
    }
  ],
  "unreadCount": 1
}
```

---

## 4. Test Messages System

### Send a message:

```bash
# Get a user ID first from database
curl -X POST http://localhost:3000/api/messages \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -d '{
    "toUserId": "USER_ID_2",
    "body": "Hello! Are you still interested?"
  }'
```

### Get conversation:

```bash
curl "http://localhost:3000/api/messages?conversationWith=USER_ID_2" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"
```

### Get all conversations:

```bash
curl "http://localhost:3000/api/messages?action=conversations" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"
```

---

## 5. Test Moderation System

### Report a listing (anonymous):

```bash
curl -X POST http://localhost:3000/api/reports \
  -H "Content-Type: application/json" \
  -d '{
    "listingId": "LISTING_ID",
    "reason": "fraud",
    "description": "This is clearly a scam. The price is way too low and the photos are suspicious."
  }'
```

### Get admin reports (requires ADMIN role):

```bash
curl "http://localhost:3000/api/admin/reports?status=PENDING" \
  -H "Cookie: next-auth.session-token=ADMIN_TOKEN"
```

### Review a report:

```bash
curl -X PATCH http://localhost:3000/api/admin/reports/REPORT_ID \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=ADMIN_TOKEN" \
  -d '{
    "status": "RESOLVED",
    "adminNotes": "Verified the listing violates Terms of Service. User has history of fraudulent postings.",
    "action": {
      "type": "suspend-user",
      "duration": 7
    }
  }'
```

---

## 6. Test UI Components

### Add NotificationBadge to Header:

```tsx
// src/components/layout/Header.tsx
import { NotificationBadge } from '@/components/notifications/NotificationBadge';

export function Header() {
  return (
    <header>
      {/* ... other header content ... */}
      <nav className="flex items-center gap-4">
        <NotificationBadge />
      </nav>
    </header>
  );
}
```

### Create Messages Page:

```tsx
// src/app/(dashboard)/messages/page.tsx
'use client';

import { MessageThread } from '@/components/messages/MessageThread';
import { useSession } from 'next-auth/react';

export default function MessagesPage() {
  const { data: session } = useSession();

  return (
    <MessageThread
      conversationWithUserId="other-user-id"
      otherUserName="John Doe"
      currentUserId={session?.user?.id || ''}
    />
  );
}
```

### Add ReportForm to Listing Detail:

```tsx
// src/app/(marketplace)/listings/[id]/page.tsx
import { ReportForm } from '@/components/moderation/ReportForm';

export default function ListingDetailPage() {
  return (
    <div>
      {/* ... listing content ... */}
      <ReportForm
        listingId="listing-123"
        listingTitle="iPhone 14 Pro"
        onSuccess={() => alert('Report submitted')}
      />
    </div>
  );
}
```

### Create Admin Reports Dashboard:

```tsx
// src/app/admin/reports/page.tsx
import { ReportsDashboard } from '@/components/admin/ReportsDashboard';

export default function AdminReportsPage() {
  return <ReportsDashboard />;
}
```

---

## 7. Run End-to-End Tests

```bash
# Run Playwright tests
docker compose exec app npx playwright test

# Run specific test file
docker compose exec app npx playwright test tests/e2e/messages.spec.ts

# Run in headed mode (see browser)
docker compose exec app npx playwright test --headed

# Generate coverage report
docker compose exec app npm run test:coverage
```

---

## 8. Monitor Performance

### Check bundle size:
```bash
docker compose exec app npm run build
du -sh .next/
```

### Run Lighthouse locally:
```bash
# Start production build
docker compose exec app npm run build
docker compose exec app npm start

# Then in another terminal
npm run lighthouse
```

### View Meilisearch stats:
```bash
curl http://localhost:7700/stats | jq
```

---

## 9. Clean Up

```bash
# Stop services
docker compose down

# Remove volumes (WARNING: deletes data)
docker compose down -v

# View container logs
docker compose logs -f [service_name]

# Rebuild images
docker compose build --no-cache
```

---

## Common Issues

### Database connection refused
```bash
# Check if PostgreSQL is healthy
docker compose ps db

# Check logs
docker compose logs db

# Restart database
docker compose restart db
```

### Port already in use
```bash
# Find process using port 3000
lsof -i :3000

# Kill it
kill -9 PID
```

### Migrations failed
```bash
# Reset database
docker compose exec db dropdb -U test yembal_test
docker compose exec db createdb -U test yembal_test

# Re-run migrations
docker compose exec app npx prisma migrate deploy
```

### Node modules not installing
```bash
# Rebuild image
docker compose build --no-cache app

# Reinstall
docker compose exec app npm install --legacy-peer-deps
```

---

## Testing Checklist

- [ ] Services start without errors
- [ ] Database migrations run successfully
- [ ] Can fetch notifications (GET /api/notifications)
- [ ] Can send message (POST /api/messages)
- [ ] Can report listing (POST /api/reports)
- [ ] Admin can review reports (PATCH /api/admin/reports/[id])
- [ ] NotificationBadge component displays correctly
- [ ] MessageThread allows sending/receiving messages
- [ ] ReportForm validates input and submits
- [ ] Admin dashboard shows pending reports
- [ ] E2E tests pass (Playwright)
- [ ] No TypeScript errors (npm run type-check)
- [ ] ESLint passes (npm run lint)

---

**Next:** Push these changes and run tests locally on your machine!
