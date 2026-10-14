# RoadRescue — Roadside Assistance Platform

A full-stack roadside assistance website built as a college PBL project.

**Tagline:** Stranded on the Road? Help Is on the Way.

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React + TypeScript + Vite + Tailwind |
| Backend  | Java 21 + Spring Boot 3 + Maven     |
| Database | MySQL 8                             |
| Security | Spring Security + JWT + BCrypt      |

## Business Details

- **Name:** RoadRescue
- **Address:** ACEIT, Kukas, Jaipur, Rajasthan, India
- **Phone:** 9116438827
- **Admin Email:** admin@roadrescue.in
- **Initial Admin Password:** admin12345

## Project Structure

```
project/
├── src/                    # React frontend
├── backend/                # Java Spring Boot backend
│   ├── pom.xml
│   ├── .env.example
│   └── src/main/
│       ├── java/com/roadrescue/
│       │   ├── config/         # Security & CORS config
│       │   ├── controller/     # REST controllers
│       │   ├── dto/            # Data transfer objects
│       │   ├── entity/         # JPA entities
│       │   ├── exception/      # Global exception handling
│       │   ├── repository/     # JPA repositories
│       │   ├── security/       # JWT utility & filter
│       │   └── service/        # Business logic
│       └── resources/
│           ├── application.yml
│           └── schema.sql      # MySQL schema
└── .env                   # Frontend env (VITE_API_URL)
```

## Setup & Run

### Prerequisites

- Java 21 (JDK)
- Maven 3.8+
- MySQL 8+
- Node.js 18+

### 1. Database Setup

```bash
# Option A: Let Hibernate create tables automatically (ddl-auto=update in application.yml)
# Just ensure MySQL is running and the database will be created on first run.

# Option B: Create manually
mysql -u root -p < backend/src/main/resources/schema.sql
```

### 2. Backend Setup

```bash
cd backend

# Copy and edit environment variables
cp .env.example .env
# Edit .env — set DB_PASSWORD, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD

# Run with Maven (reads env from .env or system environment)
mvn spring-boot:run
```

The backend starts on `http://localhost:8080`.

The initial admin account is created automatically on first startup using the
email and password from environment variables. The password is stored as a
BCrypt hash and is never printed in logs. It is NOT reset on subsequent restarts.

### 3. Frontend Setup

```bash
# From project root
npm install
npm run dev
```

The frontend starts on `http://localhost:5173`.

Set `VITE_API_URL` in `.env` to point to your backend (default: `http://localhost:8080/api`).

### 4. Default Admin Login

- **URL:** `http://localhost:5173/admin/login`
- **Email:** admin@roadrescue.in
- **Password:** admin12345

**Change the admin password immediately after first login** via the "Change Password" button in the admin dashboard.

## API Documentation

See [backend/API.md](backend/API.md) for the complete endpoint reference.

## Security Features

- BCrypt password hashing
- JWT-based stateless authentication
- Role-based access control (CUSTOMER / ADMIN) enforced server-side
- Customers can only access their own requests
- Public request tracking does not expose personal information
- CORS configured for the frontend origin
- Input validation on all API endpoints
- Centralized exception handling

## Features

### Customer
- Register and login
- Submit roadside assistance requests (6 service categories)
- View personal request history
- Track request status by request ID
- Cancel pending/approved requests
- Logout

### Admin
- View dashboard statistics
- List all requests with search, filter, sort, and pagination
- Approve or reject pending requests
- Assign service providers
- Update request status through the full lifecycle
- View all registered customers
- Change admin password
- Secure logout

## Remaining Notes

- The frontend was built and verified to compile (`npm run build` passes).
- The Java backend was written to Spring Boot 3 / Java 21 specifications. Since
  the Bolt hosted environment does not have a Java compiler or MySQL, compile
  and run the backend locally using Maven as described above.
- The `ddl-auto=update` setting in `application.yml` lets Hibernate create
  tables automatically. For production, switch to Flyway/Liquibase migrations.

## Run locally (submission build — Java 21 + Spring Boot + MySQL)
1. Install Java 21, Maven, MySQL 8, Node 18+.
2. Backend: `cd backend`, export the values from `.env.example` (Spring does not read .env files), e.g.
   `export DB_PASSWORD=... JWT_SECRET=<32+ random chars> ADMIN_PASSWORD=admin12345`
   then `mvn spring-boot:run` (database and tables are created automatically).
   The admin `admin@roadrescue.in` is created once with a BCrypt hash; restarts never reset it.
   Change it from Admin Dashboard → Change Password.
3. Frontend: `cp .env.example .env`, `npm install`, `npm run dev` (http://localhost:5173).
4. Production: `mvn -DskipTests package` → `java -jar backend/target/roadrescue-backend-1.0.0.jar`; `npm run build` → deploy `dist/` (set VITE_API_URL and CORS_ORIGIN).

## Mechanic accounts
- Mechanics self-register at `/mechanic/register` with their service areas (comma separated, e.g. "Kukas, Amer") and services.
- `/mechanic/dashboard` lists open requests whose location mentions one of their areas and whose service they offer.
- A mechanic can accept a job (status → ASSIGNED), then mark it IN_PROGRESS / COMPLETED. Only the assigned mechanic can update it.
- API: `POST /api/auth/register-mechanic`, `GET /api/mechanic/available`, `GET /api/mechanic/jobs`,
  `PATCH /api/mechanic/requests/{id}/accept`, `PATCH /api/mechanic/requests/{id}/status`, `PUT /api/mechanic/profile` (MECHANIC role only).
