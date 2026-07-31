# API Documentation

Base URL (development): `http://localhost:3000/api`

## Authentication

All endpoints requiring auth need a valid NextAuth session (stored in cookies).

**Cookie name:** `next-auth.session-token` (secure, httpOnly)

## Endpoints

### Auth

#### POST `/auth/signin`
Sign in existing user.
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** Redirects to home, session cookie set

#### POST `/auth/signout`
Sign out current user.

**Response:** Redirects to home, session cleared

#### POST `/auth/callback/credentials`
Internal: NextAuth credential verification

---

### Listings

#### GET `/listings`
Fetch all listings with pagination.

**Query params:**
- `page` (default: 1)
- `limit` (default: 10)
- `status` (default: ACTIVE) — "ACTIVE", "SOLD", "DELETED"
- `city` (optional) — filter by city
- `category` (optional) — filter by category

**Response:**
```json
{
  "data": [
    {
      "id": "cuid123",
      "title": "iPhone 13 Pro",
      "price": 80000000,
      "city": "Dakar",
      "thumbnail": "https://...",
      "createdAt": "2026-07-31T10:00:00Z"
    }
  ],
  "total": 42,
  "page": 1,
  "limit": 10
}
```

#### POST `/listings` ⚡ Auth Required
Create new listing.

**Request:**
```json
{
  "title": "iPhone 13 Pro",
  "description": "Excellent condition, all original accessories",
  "category": "electronics",
  "price": 80000000,
  "city": "Dakar",
  "region": "Dakar"
}
```

**Response:** Listing object with ID

#### GET `/listings/[id]`
Fetch single listing detail.

**Response:**
```json
{
  "id": "cuid123",
  "title": "iPhone 13 Pro",
  "description": "...",
  "price": 80000000,
  "city": "Dakar",
  "photos": ["https://..."],
  "user": {
    "id": "uid123",
    "name": "Amadou Diallo",
    "avatar": "https://..."
  },
  "createdAt": "2026-07-31T10:00:00Z",
  "viewCount": 42
}
```

#### PATCH `/listings/[id]` ⚡ Auth Required
Update listing (owner only).

**Request:**
```json
{
  "title": "iPhone 13 Pro - New Price",
  "status": "SOLD"
}
```

#### DELETE `/listings/[id]` ⚡ Auth Required
Delete listing (owner only).

**Response:** `{ "success": true }`

---

### Search

#### GET `/search`
Full-text search via Meilisearch.

**Query params:**
- `q` (required) — search query
- `page` (default: 1)
- `limit` (default: 20)
- `filters` (optional) — e.g., `"city:Dakar AND category:electronics"`

**Response:**
```json
{
  "results": [
    {
      "id": "cuid123",
      "title": "iPhone 13",
      "_score": 0.95
    }
  ],
  "total": 5,
  "processingTimeMs": 12
}
```

---

### Messages

#### GET `/messages` ⚡ Auth Required
List user's conversations.

**Response:**
```json
{
  "conversations": [
    {
      "id": "msg123",
      "with": {
        "id": "uid456",
        "name": "Fatima Ba",
        "avatar": "https://..."
      },
      "lastMessage": "Is this still available?",
      "unreadCount": 2,
      "updatedAt": "2026-07-31T15:00:00Z"
    }
  ]
}
```

#### GET `/messages/[userId]` ⚡ Auth Required
Fetch messages with specific user.

**Query params:**
- `listingId` (optional) — filter to specific listing

**Response:**
```json
{
  "messages": [
    {
      "id": "msg123",
      "from": { "id": "uid123", "name": "Amadou" },
      "body": "Is this phone available?",
      "isRead": true,
      "createdAt": "2026-07-31T14:00:00Z"
    }
  ]
}
```

#### POST `/messages` ⚡ Auth Required
Send message to user.

**Request:**
```json
{
  "toUserId": "uid456",
  "listingId": "list123",
  "body": "Hi, is this still available?"
}
```

**Response:** Message object

---

### Payments

#### POST `/payments/stripe` ⚡ Auth Required
Create Stripe payment intent.

**Request:**
```json
{
  "listingId": "list123",
  "amount": 80000000
}
```

**Response:**
```json
{
  "clientSecret": "pi_xxx_secret_yyy",
  "status": "requires_payment_method"
}
```

#### POST `/payments/wave` ⚡ Auth Required
Initiate Wave (mobile money) payment.

**Request:**
```json
{
  "listingId": "list123",
  "phone": "+221771234567"
}
```

**Response:**
```json
{
  "transactionId": "wave_123",
  "status": "pending",
  "statusCheckUrl": "https://api.wave.com/..."
}
```

#### POST `/payments/webhook/stripe`
Webhook: Stripe payment completion (no auth needed, signature verified)

#### POST `/payments/webhook/wave`
Webhook: Wave payment confirmation (no auth needed, signature verified)

---

### Reviews

#### GET `/reviews/[userId]` ⚡ Auth Required
Get reviews for user.

**Response:**
```json
{
  "reviews": [
    {
      "id": "rev123",
      "from": { "id": "uid123", "name": "Amadou" },
      "rating": 5,
      "comment": "Great seller!",
      "createdAt": "2026-07-31T10:00:00Z"
    }
  ],
  "averageRating": 4.8,
  "totalReviews": 12
}
```

#### POST `/reviews` ⚡ Auth Required
Leave review for user.

**Request:**
```json
{
  "toUserId": "uid456",
  "rating": 5,
  "comment": "Excellent buyer, very professional"
}
```

---

### Reports

#### POST `/reports` ⚡ Auth Required (optional)
Report a listing.

**Request:**
```json
{
  "listingId": "list123",
  "reason": "fraud",
  "description": "Item never arrived, seller unresponsive"
}
```

**Response:** Report object

---

### Admin

#### GET `/admin/reports` ⚡ Auth Required (Admin only)
List all reports.

**Query params:**
- `status` (default: "PENDING") — "PENDING", "RESOLVED", "DISMISSED"

#### PATCH `/admin/reports/[id]` ⚡ Auth Required (Admin only)
Resolve/dismiss report.

**Request:**
```json
{
  "status": "RESOLVED",
  "action": "suspend",
  "duration": 7
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (not authenticated) |
| 403 | Forbidden (no permission) |
| 404 | Not Found |
| 429 | Too Many Requests (rate limited) |
| 500 | Server Error |

## Error Response Format

```json
{
  "error": "Validation error",
  "details": {
    "title": "Must be at least 5 characters"
  }
}
```

---

## Rate Limiting

API routes are rate-limited to **100 requests per minute per IP** (configurable in middleware).

**Response headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 42
X-RateLimit-Reset: 1627500000
```

---

## Webhooks

### Stripe
**URL:** `POST /api/payments/webhook/stripe`
**Events:** `payment_intent.succeeded`, `payment_intent.failed`

### Wave
**URL:** `POST /api/payments/webhook/wave`
**Events:** `transaction.successful`, `transaction.failed`

---

## Development Tools

### Test API locally
```bash
# Using curl
curl -X GET http://localhost:3000/api/listings?limit=5

# Using Postman
# Import from: /docs/postman-collection.json (not yet created)
```

### View NextAuth session
```javascript
// In browser console
fetch('/api/auth/session').then(r => r.json()).then(console.log)
```

---

**Last Updated:** 2026-07-31  
**Next:** Implement in Phase 2-3
