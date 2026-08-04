# Development Setup Guide

## Prerequisites

- **Node.js:** v20+ ([download](https://nodejs.org))
- **Docker Desktop:** ([download](https://www.docker.com/products/docker-desktop))
- **Git:** ([download](https://git-scm.com))
- **PostgreSQL client (psql):** Optional, for direct DB access

## Step 1: Install Dependencies

```bash
cd senegatex-marketplace
npm install
```

**Expected output:**
```
added 1234 packages in 45s
```

## Step 2: Setup Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your configuration:

```bash
# Critical variables to generate/update:
NEXTAUTH_SECRET=<run: openssl rand -base64 32>
DATABASE_URL=postgresql://yembal:yembal_dev_pw@localhost:5432/yembal
REDIS_URL=redis://localhost:6379
MEILISEARCH_URL=http://localhost:7700
```

## Step 3: Start Local Infrastructure

Start all services (PostgreSQL, Redis, Meilisearch):

```bash
npm run docker:up
```

**Verify services are running:**
```bash
docker-compose ps
```

Expected output:
```
NAME                 STATUS
yombal-app        Up (health: starting)
yombal-db         Up (healthy)
yombal-redis      Up (healthy)
yombal-search     Up
```

**Wait for health checks** (30 seconds):
```bash
docker-compose logs db
# Look for: "database system is ready to accept connections"
```

## Step 4: Initialize Database

Create initial schema + migrations:

```bash
npx prisma migrate dev --name init
```

This will:
1. Create the PostgreSQL database
2. Run migrations
3. Generate Prisma client

## Step 5: Seed Test Data (Optional)

Populate database with test listings + users:

```bash
npm run db:seed
```

**Test accounts created:**
- Seller: `seller@example.com` / `password123`
- Buyer: `buyer@example.com` / `password123`

## Step 6: Start Development Server

```bash
npm run dev
```

**Output:**
```
- Local:        http://localhost:3000
- Environments: .env.local
✓ Ready in 2.5s
```

Visit **http://localhost:3000** 🎉

---

## Accessing Services

### Development App
- URL: http://localhost:3000
- Routes: See `src/app/` directory

### Meilisearch Admin
- URL: http://localhost:7700
- Master Key: `DebugKey1234567890` (from .env.local)
- Use: Create/test search indexes

### PostgreSQL Database
Command-line access:
```bash
docker-compose exec db psql -U postgres -d yombal
```

Common queries:
```sql
-- List all tables
\dt

-- View users
SELECT id, email, name, role FROM "User" LIMIT 5;

-- View listings
SELECT id, title, price, status, "createdAt" FROM "Listing" LIMIT 5;
```

### Redis Cache
```bash
docker-compose exec redis redis-cli
```

Commands:
```
ping              # Test connection
keys *            # List all keys
get <key>         # Get value
del <key>         # Delete key
```

---

## Running Tests

### Unit Tests
```bash
npm run test              # Watch mode
npm run test:coverage     # Coverage report
```

### E2E Tests
```bash
npm run test:e2e          # Headless
npm run test:e2e:ui       # Interactive UI
```

Tests are in `tests/` directory and use real database (`test_yombal`).

---

## Running Linter & Formatter

### Check Code Quality
```bash
npm run lint              # ESLint
npm run type-check        # TypeScript
```

### Auto-fix Issues
```bash
npm run lint:fix          # Fix ESLint issues
npm run format            # Format with Prettier
```

---

## Database Operations

### Create a Migration
```bash
# Edit src/prisma/schema.prisma (add new table/field)
npm run db:migrate
# Enter migration name: "add_photo_table"
```

Migration file is created in `prisma/migrations/` and tracked in git.

### View Database GUI
```bash
npm run db:studio
```

Opens **http://localhost:5555** with Prisma Studio for visual DB browsing.

### Rollback Last Migration
```bash
# Only in development!
npm run db:push            # Push current schema state
```

---

## Troubleshooting

### PostgreSQL connection refused
```bash
# Check if container is running
docker-compose logs db

# Restart database
docker-compose restart db

# Full restart
docker-compose down
docker-compose up -d
```

### Port already in use (e.g., 3000)
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

### node_modules corruption
```bash
rm -rf node_modules package-lock.json
npm install
```

### Prisma client out of sync
```bash
npx prisma generate
```

---

## Environment Variable Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `DATABASE_URL` | PostgreSQL connection | `postgresql://...` |
| `REDIS_URL` | Redis session store | `redis://localhost:6379` |
| `MEILISEARCH_URL` | Search engine | `http://localhost:7700` |
| `NEXTAUTH_URL` | Auth callback | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | Session encryption | Generated key |

See `.env.local.example` for complete list.

---

## Next Steps

1. ✅ Setup complete
2. 📖 Read **[CLAUDE.md](../CLAUDE.md)** for architecture
3. 🔨 Start Phase 1: NextAuth + API routes
4. 💾 See **[API.md](./API.md)** for endpoint documentation

---

**Questions?** Check `docs/` folder or review CLAUDE.md conventions.
