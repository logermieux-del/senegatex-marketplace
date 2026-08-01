# Yombal Marketplace

🚀 A Craigslist/Vinted-style marketplace for buying and selling locally in Senegal.

## Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- Git

### Setup (5 minutes)

```bash
# 1. Clone and install
git clone <repo-url>
cd yombal-marketplace
npm install

# 2. Setup environment
cp .env.local.example .env.local
# Edit .env.local with your values

# 3. Start local environment
docker-compose up -d

# 4. Initialize database
npx prisma migrate dev

# 5. Seed test data (optional)
npm run db:seed

# 6. Start dev server
npm run dev
```

App will be available at **http://localhost:3000**

### Accessing Services Locally

- **App:** http://localhost:3000
- **Meilisearch Admin:** http://localhost:7700
- **Database:** localhost:5432 (psql)
- **Redis:** localhost:6379

---

## Development

### Commands

```bash
# Development
npm run dev              # Start dev server
npm run type-check      # TypeScript type checking
npm run lint            # Run ESLint
npm run lint:fix        # Fix linting issues
npm run format          # Format code with Prettier

# Database
npm run db:migrate      # Create + run migrations
npm run db:push         # Push schema to DB (no migration)
npm run db:studio       # Open Prisma Studio
npm run db:seed         # Seed test data

# Testing
npm run test            # Run unit tests (Vitest)
npm run test:e2e        # Run end-to-end tests (Playwright)
npm run test:coverage   # Coverage report

# Building
npm run build           # Production build
npm run start           # Start production server

# Docker
npm run docker:up       # Start Docker services
npm run docker:down     # Stop Docker services
npm run docker:logs     # View container logs
```

### Project Structure

See **[CLAUDE.md](./CLAUDE.md)** for detailed architecture and conventions.

```
src/
├── app/              # Next.js App Router (pages, layouts, API)
├── components/       # React components
├── lib/              # Utilities, database, validators
├── hooks/            # Custom React hooks
└── prisma/           # Database schema & migrations
```

---

## Key Features

✅ **User Authentication** (NextAuth)
✅ **Create & Browse Listings** (Listings with photos)
✅ **Search & Filter** (Meilisearch, full-text)
✅ **Direct Messages** (Between users)
✅ **Payment Integration** (Stripe + Wave + Orange Money)
✅ **Reviews & Ratings**
✅ **Content Moderation** (Reports, admin dashboard)
✅ **Mobile-First Design** (Responsive, accessible)

---

## Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, NextAuth.js
- **Database:** PostgreSQL + Prisma ORM
- **Search:** Meilisearch
- **Cache:** Redis
- **Images:** Cloudinary
- **Payments:** Stripe, Wave, Orange Money
- **Email:** Resend
- **Testing:** Vitest, Playwright

See **[CLAUDE.md](./CLAUDE.md)** for full stack details.

---

## Documentation

- **[CLAUDE.md](./CLAUDE.md)** — Architecture, conventions, security
- **[docs/SETUP.md](./docs/SETUP.md)** — Development environment setup
- **[docs/API.md](./docs/API.md)** — API endpoint documentation
- **[docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)** — Hostinger VPS deployment
- **[docs/SECURITY.md](./docs/SECURITY.md)** — Security audit checklist

---

## Testing

### Unit Tests
```bash
npm run test                # Watch mode
npm run test:coverage       # Coverage report
```

### E2E Tests
```bash
npm run test:e2e           # Run Playwright tests
npm run test:e2e:ui        # Interactive test runner
```

---

## Deployment

### Development (Local)
```bash
docker-compose up -d
npm run dev
```

### Production (Hostinger VPS)
```bash
./scripts/deploy.sh
```

See **[docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)** for details.

---

## Contributing

1. Create a feature branch: `git checkout -b feature/xyz`
2. Make changes + write tests
3. Run linting & tests: `npm run lint && npm run test`
4. Commit with conventional messages: `git commit -m "feat(auth): ..."`
5. Push to origin + create PR

See **[CLAUDE.md](./CLAUDE.md)** for workflow details.

---

## Support

- **Issues:** GitHub Issues
- **Docs:** See `docs/` folder
- **Architecture:** Read **[CLAUDE.md](./CLAUDE.md)**

---

## License

MIT

---

**Built with ❤️ for Senegal**
