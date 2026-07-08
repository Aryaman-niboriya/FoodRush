from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


# Import all models here so Alembic auto-detects them
from app.models.user import User          # noqa: F401, E402
from app.models.restaurant import Restaurant  # noqa: F401, E402
from app.models.menu_item import MenuItem     # noqa: F401, E402
from app.models.order import Order, OrderItem # noqa: F401, E402
from app.models.delivery import Delivery      # noqa: F401, E402
from app.models.review import Review          # noqa: F401, E402
