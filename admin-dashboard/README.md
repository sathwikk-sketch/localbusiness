# Admin Dashboard

The admin dashboard is implemented inside the Next.js app at `frontend/app/admin`.

Routes:

- `/admin/login` - JWT login screen
- `/admin` - dashboard workspace with overview, products, orders, offers, and content tabs

It uses the FastAPI backend endpoints under `/api/auth`, `/api/products`, `/api/orders`, `/api/offers`, `/api/content`, and `/api/dashboard`.

