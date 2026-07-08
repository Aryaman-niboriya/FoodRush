# 🍔 FoodRush — Backend API

Production-ready food delivery backend built with **FastAPI + PostgreSQL + SQLAlchemy**.

---

## Tech Stack

| Layer       | Technology                           |
|-------------|--------------------------------------|
| Framework   | FastAPI 0.115                        |
| Database    | PostgreSQL 15+                       |
| ORM         | SQLAlchemy 2.0                       |
| Auth        | JWT (python-jose) + bcrypt           |
| Migrations  | Alembic                              |
| Validation  | Pydantic v2                          |
| Server      | Uvicorn (ASGI)                       |

---

## Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI app, middleware, router registration
│   ├── core/
│   │   ├── config.py        # Pydantic settings (reads .env)
│   │   ├── security.py      # bcrypt password hashing
│   │   └── jwt.py           # Token creation, decode, role guards
│   ├── models/              # SQLAlchemy ORM models
│   │   ├── user.py
│   │   ├── restaurant.py
│   │   ├── menu_item.py
│   │   ├── order.py
│   │   ├── delivery.py
│   │   └── review.py
│   ├── schemas/             # Pydantic request/response schemas
│   ├── routes/              # FastAPI route handlers (thin layer)
│   ├── services/            # Business logic (thick layer)
│   ├── db/
│   │   ├── base.py          # DeclarativeBase + all model imports
│   │   └── session.py       # Engine, SessionLocal, get_db()
│   └── utils/
│       ├── pagination.py
│       ├── responses.py
│       └── validators.py
├── alembic/                 # DB migration scripts
├── seed.py                  # Demo data seeder
├── requirements.txt
└── .env.example
```

---

## Quick Start

### 1. Prerequisites

- Python 3.11+
- PostgreSQL 15+

### 2. Install dependencies

```bash
cd backend
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Configure environment

```bash
cp .env.example .env
# Edit .env — set DATABASE_URL and SECRET_KEY
```

### 4. Create the database

```bash
createdb foodrush
```

### 5. Run migrations

```bash
alembic upgrade head
```

### 6. Seed demo data (optional)

```bash
python seed.py
```

### 7. Start the server

```bash
uvicorn app.main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

---

## API Overview

| Module          | Base Path               | Auth Required |
|-----------------|-------------------------|---------------|
| Auth            | `/api/v1/auth`          | No            |
| Users           | `/api/v1/users`         | Yes           |
| Restaurants     | `/api/v1/restaurants`   | Some          |
| Menu Items      | `/api/v1/menu`          | Some          |
| Orders          | `/api/v1/orders`        | Yes           |
| Delivery        | `/api/v1/delivery`      | Yes           |
| Reviews         | `/api/v1/reviews`       | Some          |
| Search          | `/api/v1/search`        | No            |

---

## Roles

| Role       | Description                                          |
|------------|------------------------------------------------------|
| `user`     | Browse, order, review                                |
| `admin`    | Full access — manage restaurants, assign deliveries  |
| `delivery` | Update own delivery status and live location         |

---

## Order State Machine

```
PENDING → CONFIRMED → PREPARING → READY → ON_THE_WAY → DELIVERED
    └──────────────────── CANCELLED (any pre-delivery stage)
```

---

## Running Tests

```bash
pytest -v
```

---

## Generate a New Migration

```bash
alembic revision --autogenerate -m "your message"
alembic upgrade head
```

---

## Demo Credentials (after seeding)

| Role     | Email                    | Password       |
|----------|--------------------------|----------------|
| Admin    | admin@foodrush.com       | Admin@1234     |
| Customer | rahul@example.com        | Customer@1234  |
| Delivery | ravi@foodrush.com        | Delivery@1234  |
