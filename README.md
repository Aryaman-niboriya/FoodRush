<div align="center">

# 🍔 FoodRush

### *A Full-Stack Food Delivery Platform*

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://sqlite.org/)

**FoodRush** is a modern, production-ready food delivery web application with a powerful REST API backend and a sleek Next.js frontend.

[🚀 Live Demo](#) · [📖 API Docs](http://localhost:8000/docs) · [🐛 Report Bug](https://github.com/Aryaman-niboriya/FoodRush/issues)

</div>

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure login with role-based access control
- 🍽️ **Restaurant Management** — Browse menus, filter by cuisine and ratings
- 🛒 **Order Lifecycle** — Full order state machine from placement to delivery
- 🛵 **Delivery Tracking** — Real-time delivery status updates
- ⭐ **Reviews & Ratings** — Leave reviews for restaurants and orders
- 🔍 **Smart Search** — Search restaurants and menu items instantly
- 📱 **Responsive UI** — Mobile-first design with smooth animations
- 📊 **Admin Dashboard** — Complete platform management panel

---

## 🏗️ Tech Stack

### Frontend
| Tech | Version | Purpose |
|------|---------|---------|
| [Next.js](https://nextjs.org/) | 16.2 | React framework with App Router |
| [TypeScript](https://typescriptlang.org/) | 5.7 | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) | 4.2 | Utility-first styling |
| [Radix UI](https://radix-ui.com/) | Latest | Accessible UI primitives |
| [Recharts](https://recharts.org/) | 2.15 | Data visualization |
| [React Hook Form](https://react-hook-form.com/) | 7.54 | Form management |
| [Zod](https://zod.dev/) | 3.24 | Schema validation |
| [Lucide React](https://lucide.dev/) | 0.564 | Icons |

### Backend
| Tech | Version | Purpose |
|------|---------|---------|
| [FastAPI](https://fastapi.tiangolo.com/) | 0.115.5 | High-performance API framework |
| [SQLAlchemy](https://sqlalchemy.org/) | 2.0.36 | ORM |
| [Alembic](https://alembic.sqlalchemy.org/) | 1.14 | Database migrations |
| [Pydantic v2](https://docs.pydantic.dev/) | 2.x | Data validation & settings |
| [python-jose](https://python-jose.readthedocs.io/) | 3.3 | JWT token handling |
| [passlib + bcrypt](https://passlib.readthedocs.io/) | 1.7 | Password hashing |
| [Uvicorn](https://uvicorn.org/) | 0.32 | ASGI server |
| SQLite | — | Development database |

---

## 📁 Project Structure

```
FoodRush/
├── frontend/                    # Next.js Application
│   ├── app/
│   │   ├── (main)/              # Main app routes
│   │   ├── globals.css          # Global styles
│   │   └── layout.tsx           # Root layout
│   ├── components/              # Reusable UI components (Radix + shadcn)
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # Utilities & API clients
│   ├── styles/                  # Additional stylesheets
│   ├── public/                  # Static assets
│   ├── next.config.mjs
│   └── package.json
│
└── backend/
    └── backend/                 # FastAPI Application
        ├── app/
        │   ├── main.py          # App entry point, CORS, routers
        │   ├── core/
        │   │   ├── config.py    # Pydantic settings
        │   │   ├── security.py  # Password hashing
        │   │   └── jwt.py       # Token creation & guards
        │   ├── models/          # SQLAlchemy ORM models
        │   │   ├── user.py
        │   │   ├── restaurant.py
        │   │   ├── menu_item.py
        │   │   ├── order.py
        │   │   ├── delivery.py
        │   │   └── review.py
        │   ├── schemas/         # Pydantic request/response schemas
        │   ├── routes/          # FastAPI route handlers
        │   ├── services/        # Business logic layer
        │   ├── db/
        │   │   ├── base.py      # DeclarativeBase
        │   │   └── session.py   # DB session management
        │   └── utils/           # Helpers (pagination, responses, validators)
        ├── alembic/             # Migration scripts
        ├── tests/               # Pytest test suite
        ├── seed.py              # Demo data seeder
        ├── requirements.txt
        └── .env.example
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ & npm
- **Python** 3.11+

### 1. Clone the Repository

```bash
git clone https://github.com/Aryaman-niboriya/FoodRush.git
cd FoodRush
```

---

### 2. Backend Setup

```bash
# Navigate to backend
cd backend/backend

# Create & activate virtual environment
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
pip install "pydantic[email]"   # Email validation support

# Configure environment
cp .env.example .env
# (No changes needed for SQLite dev setup)

# Start the API server
uvicorn app.main:app --reload --port 8000
```

✅ **API running at:** http://localhost:8000  
📖 **Swagger docs at:** http://localhost:8000/docs

---

### 3. Frontend Setup

```bash
# Navigate to frontend (from project root)
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

✅ **App running at:** http://localhost:3000

---

## 📡 API Overview

| Module | Endpoint | Auth |
|--------|----------|------|
| 🔑 Auth | `POST /api/v1/auth/login` | ❌ Public |
| 🔑 Auth | `POST /api/v1/auth/register` | ❌ Public |
| 👤 Users | `/api/v1/users` | ✅ JWT |
| 🏪 Restaurants | `/api/v1/restaurants` | Partial |
| 🍕 Menu Items | `/api/v1/menu` | Partial |
| 📦 Orders | `/api/v1/orders` | ✅ JWT |
| 🛵 Delivery | `/api/v1/delivery` | ✅ JWT |
| ⭐ Reviews | `/api/v1/reviews` | Partial |
| 🔍 Search | `/api/v1/search` | ❌ Public |

---

## 👥 Roles & Permissions

| Role | Capabilities |
|------|-------------|
| `user` | Browse restaurants, place orders, leave reviews |
| `admin` | Full platform access — manage restaurants, assign deliveries, view all data |
| `delivery` | Update own delivery status and live location |

---

## 📦 Order State Machine

```
PENDING ──► CONFIRMED ──► PREPARING ──► READY ──► ON_THE_WAY ──► DELIVERED
   │              │              │          │
   └──────────────┴──────────────┴──── CANCELLED
          (cancellable at any pre-delivery stage)
```

---

## 🔐 Demo Credentials

After seeding (`python seed.py`):

| Role | Email | Password |
|------|-------|----------|
| 🔴 Admin | `admin@foodrush.com` | `Admin@1234` |
| 🟢 Customer | `rahul@example.com` | `Customer@1234` |
| 🔵 Delivery | `ravi@foodrush.com` | `Delivery@1234` |

---

## 🧪 Running Tests

```bash
# From backend/backend directory with venv activated
pytest -v
```

---

## 🗄️ Database Migrations

```bash
# Run existing migrations
alembic upgrade head

# Generate a new migration after model changes
alembic revision --autogenerate -m "your migration message"
alembic upgrade head
```

---

## 🌱 Seed Demo Data

```bash
# Populate the database with sample restaurants, users & orders
python seed.py
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

Made with ❤️ by [Aryaman Niboriya](https://github.com/Aryaman-niboriya)

⭐ **Star this repo if you found it helpful!** ⭐

</div>
