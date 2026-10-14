# RoadRescue API Documentation

Base URL: `http://localhost:8080/api`

All protected endpoints require the `Authorization: Bearer <token>` header.

---

## Authentication

### POST /auth/register
Register a new customer account.

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "contactNumber": "9876543210"
}
```
**Response:** `200 OK`
```json
{
  "token": "eyJhbGci...",
  "user": { "id": 1, "email": "...", "name": "...", "role": "CUSTOMER", "contactNumber": "..." }
}
```

### POST /auth/login
Login with email and password.

**Body:**
```json
{ "email": "john@example.com", "password": "secret123" }
```
**Response:** Same as register.

### GET /auth/me
Get the current authenticated user. **Auth required.**

### POST /auth/change-password
Change the current user's password. **Auth required.**

**Body:**
```json
{ "currentPassword": "old", "newPassword": "newpass123" }
```

---

## Customer Requests

### POST /requests
Create a new assistance request. **Auth required (CUSTOMER).**

**Body:**
```json
{
  "customerName": "John Doe",
  "contactNumber": "9876543210",
  "vehicleType": "CAR",
  "vehicleModel": "Maruti Swift",
  "vehicleRegNumber": "RJ01 AB 1234",
  "serviceCategory": "VEHICLE_BREAKDOWN",
  "description": "Engine stopped suddenly",
  "location": "NH-48, near Kukas, Jaipur",
  "latitude": 26.9124,
  "longitude": 75.7873,
  "additionalNotes": "Car is on the side of the road"
}
```

### GET /requests/my
Get all requests for the current user. **Auth required.**

### GET /requests/{id}
Get a specific request by database ID. **Auth required** — only the owner can access.

### GET /requests/track/{requestId}
Public tracking by request ID (e.g., `RR-20261014-AB12`). Returns limited info — no phone number, no address beyond location.

### PATCH /requests/{id}/cancel
Cancel a pending or approved request. **Auth required** — only the owner.

---

## Admin Endpoints (ADMIN role required)

### GET /admin/stats
```json
{
  "total": 50, "pending": 10, "approved": 5, "rejected": 2,
  "active": 8, "completed": 20, "cancelled": 5
}
```

### GET /admin/requests?page=0&size=10&status=PENDING&serviceCategory=VEHICLE_BREAKDOWN&search=John&sortBy=createdAt&sortDir=desc
Paginated, filtered, sorted list of all requests.

**Query params:**
- `page` (default 0)
- `size` (default 10)
- `status` — one of PENDING, APPROVED, REJECTED, ASSIGNED, IN_PROGRESS, COMPLETED, CANCELLED
- `serviceCategory` — one of the 6 service categories
- `search` — searches request ID, customer name, or phone number
- `sortBy` (default `createdAt`)
- `sortDir` — `asc` or `desc` (default `desc`)

### PATCH /admin/requests/{id}/status
Update request status and optionally assign a provider.

**Body:**
```json
{ "status": "ASSIGNED", "assignedProvider": "Rajesh Mechanics" }
```

### GET /admin/customers
List all registered customers.

### POST /admin/change-password
Change admin password (same as /auth/change-password).

---

## Service Categories

| Value                | Label                          |
|----------------------|--------------------------------|
| VEHICLE_BREAKDOWN    | Vehicle Breakdown Assistance   |
| PUNCTURE_TYRE        | Puncture & Tyre Replacement    |
| BATTERY_JUMPSTART    | Battery Jump-Start             |
| EMERGENCY_TOWING     | Emergency Towing               |
| MECHANICAL_REPAIRS   | Mechanical Repairs             |
| OTHER                | Other Vehicle Emergency        |

## Request Statuses

`PENDING` → `APPROVED` / `REJECTED` → `ASSIGNED` → `IN_PROGRESS` → `COMPLETED`

`CANCELLED` can be set from `PENDING` or `APPROVED`.

---

## Error Responses

```json
{ "message": "Error description" }
```

| Status | Meaning            |
|--------|--------------------|
| 400    | Bad request / validation error |
| 401    | Not authenticated  |
| 403    | Not authorized (wrong role) |
| 404    | Resource not found |
| 500    | Server error       |
