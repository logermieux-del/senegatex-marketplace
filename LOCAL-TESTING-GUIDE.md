# 🧪 Local Testing Guide — Yembal Marketplace

**Status:** ✅ Ready to test  
**Date:** 2026-08-04

---

## 🚀 Quick Start (5 minutes)

### On Your Machine

```bash
# 1. Clone
git clone https://github.com/logermieux-del/senegatex-marketplace
cd senegatex-marketplace
git checkout claude/yombal-bvijp8

# 2. Install
npm install --legacy-peer-deps

# 3. Configure
cp .env.local.example .env.local
# (no changes needed for local Docker testing)

# 4. Start
docker compose up -d
sleep 15

# 5. Initialize
docker compose exec app npx prisma migrate deploy
docker compose exec app npm run db:seed

# 6. Check
docker compose exec app npm run type-check

# 7. Open browser
# http://localhost:3000
```

Done! ✅

---

## 📋 What Gets Tested

### 1. **Code Quality**
```bash
docker compose exec app npm run type-check    # TypeScript
docker compose exec app npm run lint           # ESLint
```

### 2. **Unit Tests**
```bash
docker compose exec app npm run test -- --run
```

### 3. **E2E Tests**
```bash
docker compose exec app npm run test:e2e
```

### 4. **Database**
```bash
docker compose exec app npx prisma studio     # Database UI
```

---

## 🧪 Manual API Testing

### Get Notifications (Requires Session)
```bash
curl -H "Cookie: next-auth.session-token=YOUR_TOKEN" \
  http://localhost:3000/api/notifications
```

Expected response:
```json
{
  "data": [],
  "unreadCount": 0
}
```

### Send a Message
First, get a user ID from the database:
```bash
docker compose exec db psql -U test -d yembal_test -c "SELECT id, name FROM \"User\" LIMIT 5;"
```

Then send a message:
```bash
curl -X POST http://localhost:3000/api/messages \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN" \
  -d '{
    "toUserId": "USER_ID_2",
    "body": "Hello! Are you interested?"
  }'
```

### Report a Listing (Anonymous)
```bash
# Get a listing ID
docker compose exec db psql -U test -d yembal_test -c "SELECT id, title FROM \"Listing\" LIMIT 5;"

# Report it
curl -X POST http://localhost:3000/api/reports \
  -H "Content-Type: application/json" \
  -d '{
    "listingId": "LISTING_ID",
    "reason": "fraud",
    "description": "This listing looks like a scam with suspiciously low prices and fake photos."
  }'
```

### Admin: Review Reports
```bash
curl http://localhost:3000/api/admin/reports?status=PENDING \
  -H "Cookie: next-auth.session-token=ADMIN_TOKEN"
```

Review and take action:
```bash
curl -X PATCH http://localhost:3000/api/admin/reports/REPORT_ID \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=ADMIN_TOKEN" \
  -d '{
    "status": "RESOLVED",
    "adminNotes": "Verified fraud. User has history of scams.",
    "action": {
      "type": "suspend-user",
      "duration": 7
    }
  }'
```

---

## 🎮 Test User Flows

### Flow 1: Send Message + Get Notification

1. **User A sends message to User B**
   ```
   User A: "Hi, still interested?"
   ```

2. **User B gets notification**
   ```
   Type: NEW_MESSAGE
   Title: "Nouveau message"
   Message: "User A vous a envoyé un message"
   ```

3. **Verify notification badge**
   - Bell icon shows +1
   - Click to see notification details

### Flow 2: Report Listing + Admin Review

1. **User reports listing**
   - Reason: "fraud"
   - Description: "Suspicious pricing and fake photos"

2. **Admin sees report in dashboard**
   - GET /api/admin/reports?status=PENDING
   - Shows: listing title, reason, reporter info

3. **Admin reviews and takes action**
   - Status: RESOLVED
   - Action: SUSPEND USER (7 days)
   - Seller receives suspension email

4. **Verify user is suspended**
   - User's `isSuspended = true`
   - `suspendedUntil = now + 7 days`

### Flow 3: View Conversations

1. **User views conversations**
   - GET /api/messages?action=conversations
   - Shows list of people they've messaged

2. **Open conversation**
   - GET /api/messages?conversationWith=USER_ID
   - Shows thread of messages
   - Auto-marks as read

3. **Send reply**
   - POST /api/messages
   - Other user gets NEW_MESSAGE notification

---

## 🐛 Common Issues & Fixes

### Port 3000 Already in Use
```bash
# Find process
lsof -i :3000

# Kill it
kill -9 PID

# Or use different port
docker compose -f docker-compose.yml up -d -p 3001:3000
```

### Database Connection Refused
```bash
# Check if PostgreSQL is running
docker compose ps db

# Restart it
docker compose restart db

# Wait and retry migrations
sleep 5
docker compose exec app npx prisma migrate deploy
```

### Prisma Migrations Fail
```bash
# Reset database (WARNING: deletes data)
docker compose exec db dropdb -U test yembal_test
docker compose exec db createdb -U test yembal_test

# Re-run migrations
docker compose exec app npx prisma migrate deploy
docker compose exec app npm run db:seed
```

### Node Modules Issues
```bash
# Reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Docker Compose Won't Start
```bash
# Check Docker daemon
docker ps

# Check logs
docker compose logs

# Rebuild images
docker compose build --no-cache
```

---

## 📊 Commands Cheatsheet

### Development
```bash
docker compose logs -f app              # Watch logs
docker compose exec app npm run dev     # Dev server (already running)
docker compose exec app npm run build   # Production build
```

### Testing
```bash
docker compose exec app npm run type-check      # TypeScript
docker compose exec app npm run lint             # ESLint
docker compose exec app npm run test -- --run   # Unit tests
docker compose exec app npm run test:e2e        # E2E tests
```

### Database
```bash
docker compose exec app npx prisma studio      # GUI browser
docker compose exec db psql -U test -d yembal_test  # CLI shell
docker compose exec app npx prisma migrate dev # Create migration
docker compose exec app npm run db:seed        # Reseed data
```

### Services
```bash
docker compose ps                     # Status
docker compose logs SERVICE           # Service logs
docker compose restart SERVICE        # Restart service
docker compose down                   # Stop all
docker compose down -v                # Stop + delete volumes
```

---

## ✅ Testing Checklist

- [ ] Services start without errors
- [ ] Database migrations run
- [ ] Can access http://localhost:3000
- [ ] TypeScript compiles (0 errors)
- [ ] ESLint passes
- [ ] Unit tests pass
- [ ] E2E tests pass
- [ ] Can fetch notifications via API
- [ ] Can send message via API
- [ ] Can report listing via API
- [ ] Notifications badge shows in UI
- [ ] Message thread loads
- [ ] Admin dashboard shows reports

---

## 🔗 Related Documentation

- **SETUP-VERIFICATION.md** — Setup status & requirements
- **TESTING.md** — Detailed testing guide
- **scripts/test-local.sh** — Automated test script
- **.github/workflows/** — CI/CD pipelines

---

## 💡 Tips

1. **Keep logs open** in another terminal: `docker compose logs -f app`
2. **Use Prisma Studio** for visual database browsing: `docker compose exec app npx prisma studio`
3. **Check health** of services: `docker compose ps`
4. **Set breakpoints** in code and use VS Code debugger
5. **Use ngrok** for testing webhooks: `ngrok http 3000`

---

## 🚀 Next Steps

1. ✅ **Complete local testing** (you are here)
2. 📝 **Document findings** (any issues?)
3. 🔧 **Set up VPS** (Hostinger)
4. 🌐 **Configure DNS & SSL**
5. 🎯 **Deploy to staging**
6. 🎉 **Launch to production**

---

**Ready? Start with:**
```bash
docker compose up -d && sleep 15 && docker compose exec app npx prisma migrate deploy && docker compose exec app npm run db:seed
```

Then open http://localhost:3000 🚀
