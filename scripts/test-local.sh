#!/bin/bash

# Local Testing Script for Yembal Marketplace
# Usage: ./scripts/test-local.sh [action]
# Actions: start, stop, logs, test-notifications, test-messages, test-reports, cleanup

set -e

ACTION=${1:-start}
PROJECT_NAME="yembal-marketplace"

echo "🚀 Yembal Marketplace Local Testing"
echo "=================================="
echo "Action: $ACTION"
echo ""

case $ACTION in
  start)
    echo "📦 Starting services..."
    docker compose up -d

    echo ""
    echo "⏳ Waiting for services to be healthy..."
    sleep 5

    # Check services
    docker compose ps

    echo ""
    echo "📊 Running database migrations..."
    docker compose exec -T app npx prisma migrate deploy || echo "Migrations may have already run"

    echo ""
    echo "🌱 Seeding database..."
    docker compose exec -T app npm run db:seed || echo "Database already seeded"

    echo ""
    echo "✅ Services started successfully!"
    echo ""
    echo "📍 Application URLs:"
    echo "   - App: http://localhost:3000"
    echo "   - Database: localhost:5432"
    echo "   - Redis: localhost:6379"
    echo "   - Meilisearch: http://localhost:7700"
    echo "   - Prisma Studio: http://localhost:5555 (run: docker compose exec app npx prisma studio)"
    ;;

  stop)
    echo "🛑 Stopping services..."
    docker compose down
    echo "✅ Services stopped"
    ;;

  logs)
    echo "📋 Streaming logs..."
    docker compose logs -f ${2:-app}
    ;;

  test-notifications)
    echo "📬 Testing Notifications API..."
    echo ""
    echo "GET /api/notifications"
    curl -s http://localhost:3000/api/notifications \
      -H "Cookie: next-auth.session-token=test" | jq . || echo "❌ Failed (may need auth token)"
    ;;

  test-messages)
    echo "💬 Testing Messages API..."
    echo ""
    echo "GET /api/messages"
    curl -s "http://localhost:3000/api/messages?limit=5" \
      -H "Cookie: next-auth.session-token=test" | jq . || echo "❌ Failed (may need auth token)"
    ;;

  test-reports)
    echo "🚨 Testing Reports API..."
    echo ""
    echo "GET /api/admin/reports"
    curl -s "http://localhost:3000/api/admin/reports?status=PENDING" \
      -H "Cookie: next-auth.session-token=test" | jq . || echo "❌ Failed (may need admin token)"
    ;;

  test-types)
    echo "🔍 Running TypeScript type check..."
    docker compose exec -T app npm run type-check
    ;;

  test-lint)
    echo "✨ Running ESLint..."
    docker compose exec -T app npm run lint
    ;;

  test-unit)
    echo "🧪 Running unit tests..."
    docker compose exec -T app npm run test -- --run
    ;;

  test-e2e)
    echo "🎭 Running E2E tests..."
    docker compose exec -T app npm run test:e2e
    ;;

  test-all)
    echo "🔨 Running all tests..."
    echo ""
    echo "1️⃣  Type checking..."
    docker compose exec -T app npm run type-check

    echo ""
    echo "2️⃣  Linting..."
    docker compose exec -T app npm run lint

    echo ""
    echo "3️⃣  Unit tests..."
    docker compose exec -T app npm run test -- --run

    echo ""
    echo "4️⃣  E2E tests..."
    docker compose exec -T app npm run test:e2e

    echo ""
    echo "✅ All tests completed!"
    ;;

  build)
    echo "🏗️  Building application..."
    docker compose exec -T app npm run build
    echo "✅ Build complete"
    ;;

  db-reset)
    echo "🔄 Resetting database..."
    docker compose exec -T db dropdb -U test yembal_test || true
    docker compose exec -T db createdb -U test yembal_test
    docker compose exec -T app npx prisma migrate deploy
    docker compose exec -T app npm run db:seed
    echo "✅ Database reset complete"
    ;;

  db-shell)
    echo "🗄️  Opening database shell..."
    docker compose exec db psql -U test -d yembal_test
    ;;

  db-studio)
    echo "🎨 Opening Prisma Studio..."
    docker compose exec app npx prisma studio
    ;;

  cleanup)
    echo "🧹 Cleaning up..."
    docker compose down -v
    echo "✅ Cleanup complete (all data deleted)"
    ;;

  *)
    echo "❌ Unknown action: $ACTION"
    echo ""
    echo "Available actions:"
    echo "  start              - Start all services"
    echo "  stop               - Stop all services"
    echo "  logs [service]     - View service logs (default: app)"
    echo "  test-notifications - Test notifications API"
    echo "  test-messages      - Test messages API"
    echo "  test-reports       - Test reports API"
    echo "  test-types         - Run TypeScript check"
    echo "  test-lint          - Run ESLint"
    echo "  test-unit          - Run unit tests"
    echo "  test-e2e           - Run E2E tests"
    echo "  test-all           - Run all tests"
    echo "  build              - Build application"
    echo "  db-reset           - Reset database"
    echo "  db-shell           - Open database shell"
    echo "  db-studio          - Open Prisma Studio"
    echo "  cleanup            - Remove all services and volumes"
    exit 1
    ;;
esac
