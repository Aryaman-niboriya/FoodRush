from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

from app.core.config import settings
from app.db.session import engine
from app.db.base import Base
from app.routes import (
    auth,
    users,
    restaurants,
    menu_items,
    orders,
    delivery,
    reviews,
    search,
)

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Production-ready Food Delivery API — Zomato Clone",
    docs_url="/docs",
    redoc_url="/redoc",
)

# --- Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=settings.ALLOWED_HOSTS,
)

# --- Routers ---
app.include_router(auth.router,         prefix="/api/v1/auth",         tags=["Auth"])
app.include_router(users.router,        prefix="/api/v1/users",        tags=["Users"])
app.include_router(restaurants.router,  prefix="/api/v1/restaurants",  tags=["Restaurants"])
app.include_router(menu_items.router,   prefix="/api/v1/menu",         tags=["Menu Items"])
app.include_router(orders.router,       prefix="/api/v1/orders",       tags=["Orders"])
app.include_router(delivery.router,     prefix="/api/v1/delivery",     tags=["Delivery"])
app.include_router(reviews.router,      prefix="/api/v1/reviews",      tags=["Reviews"])
app.include_router(search.router,       prefix="/api/v1/search",       tags=["Search"])


@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "message": f"{settings.PROJECT_NAME} is running 🚀"}


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy", "version": settings.VERSION}
