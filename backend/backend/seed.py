"""
Seed script — populates the database with demo data for development.
Run: python seed.py
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.session import SessionLocal
from app.db.base import Base
from app.db.session import engine
from app.models.user import User, UserRole
from app.models.restaurant import Restaurant, CuisineType
from app.models.menu_item import MenuItem, FoodCategory
from app.core.security import hash_password

Base.metadata.create_all(bind=engine)

db = SessionLocal()


def seed():
    print("🌱  Seeding database...")

    # ── Users ──────────────────────────────────────────────────────────────
    admin = User(
        full_name="Admin User",
        email="admin@foodrush.com",
        hashed_password=hash_password("Admin@1234"),
        role=UserRole.ADMIN,
        phone="+911234567890",
    )
    customer = User(
        full_name="Rahul Sharma",
        email="rahul@example.com",
        hashed_password=hash_password("Customer@1234"),
        role=UserRole.USER,
        phone="+919876543210",
    )
    delivery_partner = User(
        full_name="Ravi Delivery",
        email="ravi@foodrush.com",
        hashed_password=hash_password("Delivery@1234"),
        role=UserRole.DELIVERY,
        phone="+911122334455",
    )
    db.add_all([admin, customer, delivery_partner])
    db.flush()

    # ── Restaurants ────────────────────────────────────────────────────────
    biryani_house = Restaurant(
        owner_id=admin.id,
        name="Biryani House",
        description="Authentic Hyderabadi biryani since 1995.",
        cuisine_type=CuisineType.INDIAN,
        address="12 MG Road",
        city="Mumbai",
        phone="+912233445566",
        min_order=199.0,
        delivery_fee=30.0,
        delivery_time_min=35,
        is_open=True,
    )
    pizza_corner = Restaurant(
        owner_id=admin.id,
        name="Pizza Corner",
        description="Wood-fired pizzas with fresh toppings.",
        cuisine_type=CuisineType.ITALIAN,
        address="5 Linking Road",
        city="Mumbai",
        phone="+912244556677",
        min_order=299.0,
        delivery_fee=49.0,
        delivery_time_min=25,
        is_open=True,
    )
    db.add_all([biryani_house, pizza_corner])
    db.flush()

    # ── Menu Items ─────────────────────────────────────────────────────────
    items = [
        MenuItem(
            restaurant_id=biryani_house.id,
            name="Chicken Biryani",
            description="Slow-cooked basmati rice with marinated chicken.",
            category=FoodCategory.MAIN_COURSE,
            price=349.0,
            is_veg=False,
            is_featured=True,
            spice_level=2,
            prep_time_min=30,
            calories=650,
        ),
        MenuItem(
            restaurant_id=biryani_house.id,
            name="Veg Biryani",
            description="Fragrant rice with fresh vegetables and saffron.",
            category=FoodCategory.MAIN_COURSE,
            price=249.0,
            is_veg=True,
            is_featured=True,
            spice_level=1,
            prep_time_min=25,
            calories=480,
        ),
        MenuItem(
            restaurant_id=biryani_house.id,
            name="Raita",
            description="Cool yogurt with cucumber and mint.",
            category=FoodCategory.SALAD,
            price=59.0,
            is_veg=True,
            spice_level=0,
            prep_time_min=5,
        ),
        MenuItem(
            restaurant_id=pizza_corner.id,
            name="Margherita Pizza",
            description="Classic tomato, mozzarella, and basil.",
            category=FoodCategory.MAIN_COURSE,
            price=399.0,
            discount_price=349.0,
            is_veg=True,
            is_featured=True,
            spice_level=0,
            prep_time_min=20,
            calories=720,
        ),
        MenuItem(
            restaurant_id=pizza_corner.id,
            name="Pepperoni Pizza",
            description="Spicy pepperoni with extra cheese.",
            category=FoodCategory.MAIN_COURSE,
            price=499.0,
            is_veg=False,
            is_featured=True,
            spice_level=1,
            prep_time_min=20,
            calories=860,
        ),
        MenuItem(
            restaurant_id=pizza_corner.id,
            name="Garlic Breadsticks",
            description="Oven-toasted breadsticks with garlic butter.",
            category=FoodCategory.STARTER,
            price=149.0,
            is_veg=True,
            spice_level=0,
            prep_time_min=10,
        ),
    ]
    db.add_all(items)
    db.commit()

    print("✅  Seed complete!")
    print("\nDemo credentials:")
    print("  Admin:    admin@foodrush.com     /  Admin@1234")
    print("  Customer: rahul@example.com      /  Customer@1234")
    print("  Delivery: ravi@foodrush.com      /  Delivery@1234")


if __name__ == "__main__":
    try:
        seed()
    except Exception as e:
        db.rollback()
        print(f"❌  Seed failed: {e}")
        raise
    finally:
        db.close()
