# GearUp API Documentation

Complete REST API reference for connecting a frontend to the GearUp backend.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js + TypeScript |
| Framework | Express 4.18 |
| ORM | Prisma 7 |
| Database | PostgreSQL |
| Auth | JWT (HTTP-only cookies + Bearer token) |
| Payments | Stripe 14 |
| File Uploads | Multer -> Cloudinary |

---

## Base URL

```
Production: <YOUR_DEPLOYED_URL>/api
Development: http://localhost:5000/api
```

---

## Standard Response Format

All endpoints return responses in this shape:

```json
{
  "success": true,
  "message": "Some message",
  "data": { ... },
  "meta": { "page": 1, "limit": 10, "total": 100 }
}
```

- `meta` is only present on paginated list endpoints.
- Error responses omit `data` and include `error` and optionally `stack` (dev only):

```json
{
  "success": false,
  "message": "Error description",
  "error": { ... },
  "stack": "..."  // only in development
}
```

---

## Authentication

### How it works

1. **Register/Login** returns `accessToken` (1 day expiry) + `refreshToken` (7 day expiry) in both:
   - HTTP-only cookies (`accessToken`, `refreshToken`)
   - Response body `data.accessToken`
2. **Protected endpoints** accept either:
   - `Authorization: Bearer <accessToken>` header
   - `accessToken` cookie (automatic in browser)
3. **Refresh token** endpoint uses the `refreshToken` cookie to issue a new `accessToken`.
4. **Logout** clears both cookies.

### Roles

| Role | Description |
|---|---|
| `CUSTOMER` | Can browse gear, create rentals, pay, leave reviews |
| `PROVIDER` | Can list gear, manage rentals for their gear, update profile |
| `ADMIN` | Full platform oversight, user management, settings |

### CORS

The backend uses `credentials: true`. Frontend requests must include:

```js
fetch(url, { credentials: 'include' })
// or with axios
axios.defaults.withCredentials = true;
```

---

## Enums

### Role

```
CUSTOMER | PROVIDER | ADMIN
```

### RentalStatus

```
PLACED -> CONFIRMED -> PAID -> PICKED_UP -> RETURNED
PLACED -> CANCELLED
```

---

## Data Models

### User

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| name | String | |
| email | String | Unique |
| password | String | Hashed with bcrypt, never returned in API |
| phone | String | |
| profilePhoto | String? | Cloudinary URL |
| role | Role | Default: `CUSTOMER` |
| isDeleted | Boolean | Soft delete flag |
| isSuspended | Boolean | Blocked by admin |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**Relations:** Provider (one-to-one), Rentals (one-to-many), Reviews (one-to-many)

### Provider

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| userId | String | Unique FK -> User |
| businessName | String | |
| description | String | |
| address | String | |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**Relations:** User (many-to-one), Gears (one-to-many)

### Category

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| name | String | Unique |
| description | String | |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**Relations:** Gears (one-to-many)

### Gear

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| name | String | |
| description | String | |
| images | String[] | Array of Cloudinary URLs |
| dailyRentalPrice | Float | Price per day |
| quantity | Int | Available units |
| status | String | Default: `"AVAILABLE"` |
| providerId | String | FK -> Provider |
| categoryId | String | FK -> Category |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**Relations:** Provider (many-to-one), Category (many-to-one), Rentals (one-to-many), Reviews (one-to-many)

### Rental

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| customerId | String | FK -> User |
| gearId | String | FK -> Gear |
| startDate | DateTime | |
| endDate | DateTime | |
| totalDays | Int | Computed |
| totalAmount | Float | Computed |
| status | RentalStatus | Default: `PLACED` |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**Relations:** Customer/User (many-to-one), Gear (many-to-one), Payment (one-to-one)

### Payment

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| rentalId | String | Unique FK -> Rental |
| transactionId | String | Stripe transaction ID |
| amount | Float | |
| paymentStatus | String | Default: `"PENDING"` |
| paymentMethod | String | |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**Relations:** Rental (one-to-one)

### Review

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| userId | String | FK -> User |
| gearId | String | FK -> Gear |
| rating | Int | 1-5 |
| comment | String | |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**Relations:** User (many-to-one), Gear (many-to-one)

### PlatformSettings

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| platformFeeRate | Float | Default: `10.0` (percentage) |
| createdAt | DateTime | |
| updatedAt | DateTime | |

---

## Entity Relationship Diagram

```
User --1:1--> Provider --1:N--> Gear --N:1--> Category
User --1:N--> Rental --1:1--> Payment
User --1:N--> Review
Gear --1:N--> Rental
Gear --1:N--> Review
```

---

## API Endpoints

### 1. Auth (`/api/auth`)

#### POST `/auth/register`

Register a new user.

**Body (JSON):**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "phone": "+1234567890",
  "role": "CUSTOMER"
}
```

For `PROVIDER` role, also include:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "secret123",
  "phone": "+1234567890",
  "role": "PROVIDER",
  "businessName": "Jane's Gear Shop",
  "description": "Best gear rentals",
  "address": "123 Main St"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { "id": "uuid", "name": "John Doe", "email": "john@example.com", "role": "CUSTOMER" },
    "accessToken": "jwt_token"
  }
}
```

**Cookies set:** `accessToken`, `refreshToken`

---

#### POST `/auth/login`

**Body (JSON):**
```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "user": { "id": "uuid", "name": "John Doe", "email": "john@example.com", "role": "CUSTOMER" },
    "accessToken": "jwt_token"
  }
}
```

---

#### POST `/auth/refresh-token`

Uses the `refreshToken` cookie to issue a new `accessToken`.

**Auth Required:** No (but must have valid `refreshToken` cookie)

**Response (200):**
```json
{
  "success": true,
  "message": "Access token renewed successfully",
  "data": { "accessToken": "new_jwt_token" }
}
```

---

#### POST `/auth/logout`

Clears both auth cookies.

**Response (200):**
```json
{
  "success": true,
  "message": "User logged out successfully",
  "data": null
}
```

---

### 2. Users (`/api/users`)

#### GET `/users/me`

Get the authenticated user's full profile.

**Auth Required:** Yes (Any role)

**Response (200):**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "profilePhoto": "https://cloudinary.com/...",
    "role": "CUSTOMER",
    "isSuspended": false,
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
}
```

---

#### PATCH `/users/me`

Update own profile. Supports `multipart/form-data` for profile photo upload.

**Auth Required:** Yes (Any role)

**Body (form-data):**

| Field | Type | Required |
|---|---|---|
| name | String | No |
| phone | String | No |
| profilePhoto | File | No (field name: `profilePhoto`) |

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { ...updated user }
}
```

---

#### DELETE `/users/me`

Soft-delete own account. Requires password confirmation.

**Auth Required:** Yes (Any role)

**Body (JSON):**
```json
{ "password": "secret123" }
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile deleted successfully",
  "data": null
}
```

---

#### GET `/users/:id`

Get any user's public profile (no sensitive fields).

**Auth Required:** No

**Response (200):**
```json
{
  "success": true,
  "message": "Public profile retrieved successfully",
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "profilePhoto": "https://cloudinary.com/...",
    "role": "CUSTOMER",
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
}
```

---

### 3. Providers (`/api/providers`)

#### POST `/providers`

Create a provider profile for the authenticated user (PROVIDER role).

**Auth Required:** Yes (`PROVIDER`)

**Body (JSON):**
```json
{
  "businessName": "Jane's Gear Shop",
  "description": "Best gear rentals in town",
  "address": "123 Main St, City, Country"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Provider profile created successfully",
  "data": { "id": "uuid", "userId": "uuid", "businessName": "...", "description": "...", "address": "..." }
}
```

---

#### GET `/providers`

List all approved provider profiles.

**Auth Required:** No

**Response (200):**
```json
{
  "success": true,
  "message": "Providers retrieved successfully",
  "data": [
    { "id": "uuid", "businessName": "...", "description": "...", "address": "...", "user": { "name": "...", "profilePhoto": "..." } }
  ]
}
```

---

#### GET `/providers/:id`

Get a single provider profile with user details.

**Auth Required:** No

**Response (200):**
```json
{
  "success": true,
  "message": "Provider retrieved successfully",
  "data": { "id": "uuid", "businessName": "...", "description": "...", "address": "...", "user": {...}, "gears": [...] }
}
```

---

#### PATCH `/providers/:id`

Update a provider profile. Users can only update their own; admins can update any.

**Auth Required:** Yes (`PROVIDER`, `ADMIN`)

**Body (JSON):**
```json
{
  "businessName": "Updated Name",
  "description": "Updated description",
  "address": "New address"
}
```

---

### 4. Categories (`/api/categories`)

#### POST `/categories`

Create a new gear category.

**Auth Required:** Yes (`ADMIN`)

**Body (JSON):**
```json
{
  "name": "Camping Tents",
  "description": "Tents for camping and outdoor use"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": { "id": "uuid", "name": "Camping Tents", "description": "..." }
}
```

---

#### GET `/categories`

List all categories.

**Auth Required:** No

**Response (200):**
```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": [
    { "id": "uuid", "name": "Camping Tents", "description": "...", "_count": { "gears": 5 } }
  ]
}
```

---

#### PATCH `/categories/:id`

**Auth Required:** Yes (`ADMIN`)

**Body (JSON):**
```json
{ "name": "Updated Name", "description": "Updated desc" }
```

---

#### DELETE `/categories/:id`

**Auth Required:** Yes (`ADMIN`)

---

### 5. Gears (`/api/gears`)

#### POST `/gears`

Add a new gear listing. Uses `multipart/form-data` for image uploads.

**Auth Required:** Yes (`PROVIDER`)

**Body (form-data):**

| Field | Type | Required |
|---|---|---|
| name | String | Yes |
| description | String | Yes |
| dailyRentalPrice | Number | Yes |
| quantity | Number | Yes |
| categoryId | String (UUID) | Yes |
| images | File[] | No (field name: `images`, max 5 files) |

**Response (201):**
```json
{
  "success": true,
  "message": "Gear listing created successfully",
  "data": {
    "id": "uuid",
    "name": "Hiking Boots",
    "description": "...",
    "images": ["https://cloudinary.com/..."],
    "dailyRentalPrice": 25.0,
    "quantity": 10,
    "status": "AVAILABLE",
    "categoryId": "uuid",
    "providerId": "uuid"
  }
}
```

---

#### GET `/gears`

Browse/search gear listings with filters and pagination.

**Auth Required:** No

**Query Parameters:**

| Param | Type | Description |
|---|---|---|
| searchTerm | String | Search by name/description |
| categoryId | String (UUID) | Filter by category |
| status | String | Filter by status (`AVAILABLE`, etc.) |
| minPrice | Number | Minimum daily price |
| maxPrice | Number | Maximum daily price |
| page | Number | Page number (default: 1) |
| limit | Number | Items per page (default: 10) |

**Example:** `GET /api/gears?searchTerm=tent&categoryId=uuid&page=1&limit=10`

**Response (200):**
```json
{
  "success": true,
  "message": "Gears retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "name": "Hiking Boots",
      "description": "...",
      "images": ["..."],
      "dailyRentalPrice": 25.0,
      "quantity": 10,
      "status": "AVAILABLE",
      "category": { "id": "uuid", "name": "Footwear" },
      "provider": { "id": "uuid", "businessName": "...", "user": { "name": "..." } }
    }
  ],
  "meta": { "page": 1, "limit": 10, "total": 50 }
}
```

---

#### GET `/gears/my-gears`

Get gear listings owned by the authenticated provider.

**Auth Required:** Yes (`PROVIDER`)

**Query Parameters:** `page`, `limit`

**Response (200):** Same as `GET /gears` but filtered to current provider's gear.

---

#### GET `/gears/:id`

Get full details of a single gear item.

**Auth Required:** No

**Response (200):**
```json
{
  "success": true,
  "message": "Gear details retrieved successfully",
  "data": {
    "id": "uuid",
    "name": "Hiking Boots",
    "description": "...",
    "images": ["..."],
    "dailyRentalPrice": 25.0,
    "quantity": 10,
    "status": "AVAILABLE",
    "category": { ... },
    "provider": { ..., "user": { ... } },
    "reviews": [ { "rating": 5, "comment": "...", "user": { "name": "..." } } ]
  }
}
```

---

#### PATCH `/gears/:id`

Update a gear listing. Providers can only update their own gear.

**Auth Required:** Yes (`PROVIDER`, `ADMIN`)

**Body (form-data):** Same fields as POST. All optional. New images replace old ones.

---

#### DELETE `/gears/:id`

Delete a gear listing. Providers can only delete their own gear.

**Auth Required:** Yes (`PROVIDER`, `ADMIN`)

---

### 6. Rentals (`/api/rentals`)

#### POST `/rentals`

Create a rental booking request.

**Auth Required:** Yes (`CUSTOMER`)

**Body (JSON):**
```json
{
  "gearId": "uuid",
  "startDate": "2026-08-01",
  "endDate": "2026-08-05"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Rental booking created successfully",
  "data": {
    "id": "uuid",
    "customerId": "uuid",
    "gearId": "uuid",
    "startDate": "2026-08-01T00:00:00.000Z",
    "endDate": "2026-08-05T00:00:00.000Z",
    "totalDays": 4,
    "totalAmount": 100.0,
    "status": "PLACED"
  }
}
```

---

#### GET `/rentals/my-rentals`

Get the authenticated customer's rental history.

**Auth Required:** Yes (`CUSTOMER`)

**Query Parameters:** `page`, `limit`

**Response (200):**
```json
{
  "success": true,
  "message": "Your rentals retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "gear": { "id": "uuid", "name": "Hiking Boots", "images": ["..."] },
      "startDate": "...",
      "endDate": "...",
      "totalDays": 4,
      "totalAmount": 100.0,
      "status": "PLACED"
    }
  ],
  "meta": { "page": 1, "limit": 10, "total": 5 }
}
```

---

#### GET `/rentals/provider`

Get incoming rental requests for gear owned by the authenticated provider.

**Auth Required:** Yes (`PROVIDER`)

**Query Parameters:** `page`, `limit`

**Response (200):** Same shape as customer rentals, with customer info instead.

---

#### GET `/rentals/:id`

Get single rental details. Customers can only see their own; providers can see rentals for their gear.

**Auth Required:** Yes (Any role)

---

#### PATCH `/rentals/:id/cancel`

Cancel a rental booking. Only the customer who created it can cancel.

**Auth Required:** Yes (`CUSTOMER`)

---

#### PATCH `/rentals/:id/status`

Update rental status (approve/reject/complete).

**Auth Required:** Yes (`PROVIDER`)

**Body (JSON):**
```json
{ "status": "CONFIRMED" }
```

**Valid status transitions:**
- `PLACED` -> `CONFIRMED` (approve) or `CANCELLED` (reject)
- `CONFIRMED` -> `PAID` (after payment)
- `PLACED` / `CONFIRMED` -> `PICKED_UP`
- `PICKED_UP` -> `RETURNED`

---

### 7. Payments (`/api/payments`)

#### POST `/payments/initiate`

Create a Stripe Checkout session for an approved rental.

**Auth Required:** Yes (`CUSTOMER`)

**Body (JSON):**
```json
{ "rentalId": "uuid" }
```

**Response (200):**
```json
{
  "success": true,
  "message": "Payment session created successfully",
  "data": { "sessionId": "cs_...", "url": "https://checkout.stripe.com/..." }
}
```

---

#### POST `/payments/create`

Create a Stripe Payment Intent directly.

**Auth Required:** Yes (`CUSTOMER`)

**Body (JSON):**
```json
{
  "rentalOrderId": "uuid",
  "amount": 100.0
}
```

---

#### POST `/payments/success`

Stripe webhook/callback for successful payment. Receives raw body for signature verification.

**Auth Required:** No (Stripe webhook)

---

#### POST `/payments/fail`

Stripe webhook/callback for failed payment.

**Auth Required:** No (Stripe webhook)

---

#### GET `/payments/my-payments`

Get the authenticated customer's payment history.

**Auth Required:** Yes (`CUSTOMER`)

**Response (200):**
```json
{
  "success": true,
  "message": "Payment history retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "transactionId": "pi_...",
      "amount": 100.0,
      "paymentStatus": "PAID",
      "paymentMethod": "card",
      "rental": { "id": "uuid", "gear": { "name": "..." } }
    }
  ]
}
```

---

#### GET `/payments/:rentalId`

Get payment details for a specific rental.

**Auth Required:** Yes (Any role)

---

### 8. Reviews (`/api/reviews`)

#### POST `/reviews`

Leave a review for a completed rental.

**Auth Required:** Yes (`CUSTOMER`)

**Body (JSON):**
```json
{
  "gearId": "uuid",
  "rating": 5,
  "comment": "Great gear, worked perfectly!"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Review added successfully",
  "data": { "id": "uuid", "rating": 5, "comment": "...", "userId": "uuid", "gearId": "uuid" }
}
```

---

#### GET `/reviews`

Get featured reviews (likely highest rated or recent).

**Auth Required:** No

---

#### GET `/reviews/gear/:gearId`

Get all reviews for a specific gear item.

**Auth Required:** No

**Response (200):**
```json
{
  "success": true,
  "message": "Reviews retrieved successfully",
  "data": [
    { "id": "uuid", "rating": 5, "comment": "...", "user": { "name": "John", "profilePhoto": "..." }, "createdAt": "..." }
  ]
}
```

---

#### DELETE `/reviews/:id`

Delete a review. Customers can only delete their own; admins can delete any.

**Auth Required:** Yes (`CUSTOMER`, `ADMIN`)

---

### 9. Admin (`/api/admin`)

All admin routes require `ADMIN` role.

#### GET `/admin/users`

List all users with pagination.

**Query Parameters:** `page`, `limit`

---

#### PATCH `/admin/users/:id/block`

Toggle block/unblock (suspend) a user.

**Response (200):**
```json
{
  "success": true,
  "message": "User blocked successfully",
  "data": { "id": "uuid", "isSuspended": true, ... }
}
```

---

#### GET `/admin/gears`

List all gear listings platform-wide with pagination.

**Query Parameters:** `page`, `limit`

---

#### GET `/admin/rentals`

List all rentals platform-wide with pagination.

**Query Parameters:** `page`, `limit`

---

#### GET `/admin/payments`

List all payments platform-wide.

---

### 10. Image Upload (`/api/upload`)

#### POST `/upload/single`

Upload a single image.

**Auth Required:** Yes (Any role)

**Body (form-data):**

| Field | Type | Required |
|---|---|---|
| image | File | Yes (field name: `image`) |

**Constraints:** Max 5MB, allowed types: jpeg, jpg, png, gif, webp

**Response (200):**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "url": "https://res.cloudinary.com/.../image.jpg",
    "width": 1920,
    "height": 1080,
    "format": "jpg"
  }
}
```

---

#### POST `/upload/multiple`

Upload multiple images (max 5).

**Auth Required:** Yes (Any role)

**Body (form-data):**

| Field | Type | Required |
|---|---|---|
| images | File[] | Yes (field name: `images`, max 5) |

**Response (200):**
```json
{
  "success": true,
  "message": "3 image(s) uploaded successfully",
  "data": {
    "images": [
      { "url": "...", "width": 1920, "height": 1080 },
      { "url": "...", "width": 800, "height": 600 }
    ]
  }
}
```

---

### 11. Settings (`/api/settings`)

#### GET `/settings`

Get platform settings (e.g., fee rate).

**Auth Required:** No

**Response (200):**
```json
{
  "success": true,
  "message": "Settings retrieved successfully",
  "data": { "id": "uuid", "platformFeeRate": 10.0 }
}
```

---

#### PATCH `/settings`

Update platform settings.

**Auth Required:** Yes (`ADMIN`)

**Body (JSON):**
```json
{ "platformFeeRate": 15.0 }
```

---

## Frontend Integration Checklist

1. **CORS:** Set `withCredentials: true` on all requests.
2. **Token Storage:** The `accessToken` is in an HTTP-only cookie (not accessible via JS). Use the token from the login/register response body for `Authorization: Bearer` header if needed (e.g., for non-browser clients).
3. **Refresh Flow:** Before the access token expires (1 day), call `POST /auth/refresh-token` to get a new one. The refresh token cookie lasts 7 days.
4. **File Uploads:** Use `multipart/form-data` for gear images, profile photos, and general uploads. Field names matter: `images` (gear), `profilePhoto` (profile), `image` (single upload).
5. **Pagination:** List endpoints return `meta: { page, limit, total }`. Use these to build pagination UI.
6. **Error Handling:** All errors return `{ success: false, message: "..." }`. Handle 401 (unauthorized), 403 (forbidden), 404 (not found), 409 (conflict/duplicate).
7. **Webhook Routes:** `/payments/success` and `/payments/fail` use raw body parsing for Stripe signature verification -- do not send JSON to these endpoints from the frontend.

## Frontend Endpoints in Use (gearup-clint)

Reference of the endpoints the Next.js client currently calls, with the
expected usage:

| Endpoint | Method | Where | Notes |
|---|---|---|---|
| `/auth/register` | POST | `RegisterForm` | Body: `name, email, phone, password, role`, plus `businessName, description, address` for `PROVIDER`. Sets `accessToken` + `refreshToken` cookies. |
| `/auth/login` | POST | `LoginForm` | Body: `email, password`. Sets both cookies. |
| `/auth/logout` | POST | `SignOutButton`, navbar dropdown | Clears both cookies. |
| `/auth/refresh-token` | POST | axios interceptor (on 401) | Uses `refreshToken` cookie; issues a new `accessToken`. |
| `/users/me` | GET | `authStore.fetchMe` | Hydrates the navbar's auth state on mount. Called with `skipAuthRefresh: true` so anonymous visitors aren't redirected to `/login`. |
| `/gears` | GET | home `FeaturedGearGrid`; browse page `GearGridSection` | Public. Home calls `?limit=4`; the `/gear` browse page calls with `searchTerm, categoryId, minPrice, maxPrice, page, limit: 12` built from URL query params. |
| `/gears/:id` | GET | gear detail page `GearDetailPage` | Public. Fetches the full gear (gallery, specs, provider, reviews) on `/gear/[id]`. |
| `/categories` | GET | `GearFilters` | Public. Populates the category dropdown on the `/gear` browse page. |
| `/rentals` | POST | `RentNowWidget` | Customer only. Body: `gearId, startDate, endDate` (`YYYY-MM-DD`). Redirects to `/login?redirect=...` if unauthenticated; on success shows a toast and navigates to `/dashboard/customer`. |
| `/rentals/my-rentals` | GET | `MyRentalsList` (customer dashboard) | Customer only. Lists the authenticated user's rentals with `meta`; CONFIRMED rentals get a "Pay now" button to `/checkout/:rentalId`. |
| `/rentals/:id` | GET | `CheckoutClient` | Customer only (ownership enforced). Fetches the rental to verify it is `CONFIRMED` before showing the checkout summary. |
| `/payments/initiate` | POST | `PayNowButton` | Customer only. Body: `{ rentalId }`. Returns `{ sessionId, url }`; the client does `window.location.assign(url)` to send the user to Stripe Checkout. |

