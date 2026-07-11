# Blood Donation Web App (React + Spring Boot + MySQL)

This workspace contains:

- `frontend/` — React (Vite) app
- `backend/` — Spring Boot REST API (JWT auth)
- `infra/` — optional Docker Compose for MySQL (if you have Docker)

## Run (quick start)

### 1) Start backend (dev profile = in-memory DB)

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

Backend runs on `http://localhost:8080`.

### 2) Start frontend

```powershell
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

The dev server proxies `/api` to `http://localhost:8080`, so the app calls same-origin `/api` (no CORS setup needed for local dev). To point at another backend, set `VITE_API_BASE_URL` (see `frontend/.env.example`).

## Use MySQL (recommended)

The backend supports a MySQL profile.

1) Create DB + user (example):

```sql
CREATE DATABASE blood_donation;
CREATE USER 'app'@'localhost' IDENTIFIED BY 'app';
GRANT ALL PRIVILEGES ON blood_donation.* TO 'app'@'localhost';
FLUSH PRIVILEGES;
```

2) Run backend with MySQL profile:

```powershell
cd backend
.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=mysql
```

If you use different credentials, update `backend/src/main/resources/application-mysql.properties`.

## Main API endpoints

- **Auth**
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/auth/me`
- **Donor**
  - `PUT /api/donors/me` (create/update donor profile)
  - `GET /api/donors/me`
  - `GET /api/donors?bloodGroup=O_POS&location=...` (receiver-only; returns available donors)
- **Requests**
  - `POST /api/requests` (receiver creates request)
  - `GET /api/requests/outgoing` (receiver)
  - `GET /api/requests/incoming` (donor)
  - `PATCH /api/requests/{id}/accept` (donor)
  - `PATCH /api/requests/{id}/reject` (donor)
  - `PATCH /api/requests/{id}/complete` (donor; sets donor availability=NO + last_donation_date=today)

