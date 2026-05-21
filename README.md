# LocalBiz Commerce

Modern full-stack local business management platform for grocery stores, bakeries, restaurants, pharmacies, clothing shops, supermarkets, and other neighborhood businesses.

It includes a customer storefront, cart, WhatsApp checkout, stock-aware ordering, admin dashboard, offers, banners, homepage content management, PostgreSQL schema, and deployment-ready structure.

## Stack

- Frontend: Next.js, Tailwind CSS, Framer Motion, Sonner toasts
- Backend: FastAPI, SQLAlchemy, JWT auth, password hashing
- Database: PostgreSQL
- Hosting: Vercel frontend, Render/Railway backend, Supabase/PostgreSQL database

## Project Structure

```txt
frontend/          Next.js customer website and /admin dashboard
backend/           FastAPI REST API
backend/app/api/   Auth, products, orders, offers, content, analytics routes
database/          PostgreSQL schema, migration, and seed SQL
admin-dashboard/   Notes for the admin route implementation
docker-compose.yml Local PostgreSQL service
```

## Features

- Customer homepage with hero, logo, promotional banners, featured products, categories, offers, about, contact, Google Maps, and floating WhatsApp button
- Product CRUD with image URL/upload support, category, price, discount price, featured flag, active flag, and stock count
- Cart, checkout form, stock validation, order creation, and `https://wa.me/` WhatsApp message generation
- Admin login with JWT token storage
- Order statuses: pending, confirmed, ready, delivered
- Admin dashboard for products, orders, offers, banners, homepage content, and sales statistics
- Search, category filters, stock indicators, loading states, empty states, responsive layout, and error toasts

## Local Setup

### 0. Prerequisites

Install these before running the app locally on Windows:

- Node.js with npm, preferably Node 20 or newer
- Python 3.11 or newer
- PostgreSQL, either through Docker Desktop or a normal PostgreSQL installer

Check your terminal with:

```powershell
node --version
npm --version
python --version
docker --version
```

If `docker` is not recognized, use one of these paths:

- Install Docker Desktop, restart PowerShell, then use the Docker command below.
- Install PostgreSQL directly, create a `localbiz` database, then skip the Docker command.

### 1. Start PostgreSQL

With Docker Desktop:

```bash
docker compose up -d postgres
```

Without Docker, create the database manually:

```powershell
createdb -U postgres localbiz
psql -U postgres -d localbiz -f database/migrations/001_initial_schema.sql
```

Then set `backend/.env` so `DATABASE_URL` matches your local PostgreSQL password and port.

### 2. Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python -m app.db.check_connection
python -m app.db.create_database
python -m app.db.seed
uvicorn app.main:app --reload
```

API docs run at [http://localhost:8000/docs](http://localhost:8000/docs).

Seed admin:

```txt
Email: owner@example.com
Password: password123
```

### 3. Frontend

```bash
cd frontend
npm install
copy .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Admin dashboard:

- [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- [http://localhost:3000/admin](http://localhost:3000/admin)

## Environment Variables

Backend:

```env
APP_NAME="LocalBiz Commerce API"
SECRET_KEY=change-this-secret-before-production
DATABASE_URL=postgresql+psycopg2://postgres:postgresSathwik2005@localhost:5433/localbiz
FRONTEND_URL=http://localhost:3000
BACKEND_CORS_ORIGINS=http://localhost:3000,http://localhost:3000
UPLOAD_DIR=static/uploads
```

Frontend:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WHATSAPP_NUMBER=919876543210
```

## API Overview

- `POST /api/auth/register` create admin/staff/customer users
- `POST /api/auth/login` issue JWT token
- `GET /api/products` public product catalogue
- `POST /api/products` admin product creation
- `PUT /api/products/{id}` admin product update
- `GET /api/categories` public categories
- `POST /api/orders` public order creation and WhatsApp URL generation
- `GET /api/orders` admin order search/filter
- `PATCH /api/orders/{id}/status` admin status update
- `GET /api/offers` public offers
- `POST /api/offers` admin offer creation
- `GET /api/content/profile` public homepage content
- `PUT /api/content/profile` admin homepage update
- `POST /api/content/uploads` admin image upload
- `GET /api/dashboard/stats` admin analytics

## Deployment

### Frontend on Vercel

1. Set project root to `frontend`.
2. Add `NEXT_PUBLIC_API_URL` with the deployed backend URL.
3. Add `NEXT_PUBLIC_WHATSAPP_NUMBER` for fallback WhatsApp messages.
4. Deploy with the default Next.js build command.

### Backend on Render or Railway

1. Set project root to `backend`.
2. Build command: `pip install -r requirements.txt`
3. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add `DATABASE_URL`, `SECRET_KEY`, `FRONTEND_URL`, and `BACKEND_CORS_ORIGINS`.
5. Use persistent/object storage for production uploads, or connect the upload route to S3/Supabase Storage.

### Database on Supabase/PostgreSQL

1. Create a PostgreSQL database.
2. Run `database/migrations/001_initial_schema.sql`.
3. Set the backend `DATABASE_URL`.
4. For production, rotate the seed password and set a strong `SECRET_KEY`.

## Notes

The storefront falls back to demo data when the API is not running, so the UI can be previewed immediately. Once the backend and database are started, it automatically uses live API data.

## Troubleshooting

### PostgreSQL password authentication failed

If startup shows `password authentication failed for user "postgres"`, the backend is reaching PostgreSQL but the password in `backend/.env` is wrong.

Open `backend/.env` and update this line:

```env
DATABASE_URL=postgresql+psycopg2://postgres:Sathwik2005@localhost:5433/localbiz
```

Then test it before starting the API:

```powershell
cd backend
.\.venv\Scripts\activate
python -m app.db.check_connection
```

If your database name is not `localbiz`, either create it or change the last part of `DATABASE_URL`.
