from typing import TypeVar, Generic, List
from pydantic import BaseModel, Field

T = TypeVar("T")


class PaginatedResponse(BaseModel, Generic[T]):
    total: int
    page: int
    size: int
    pages: int
    items: List[T]

    @classmethod
    def create(cls, items: List[T], total: int, page: int, size: int):
        pages = (total + size - 1) // size if size > 0 else 0
        return cls(total=total, page=page, size=size, pages=pages, items=items)


def paginate(query, page: int, size: int):
    """Apply offset/limit to a SQLAlchemy query and return (items, total)."""
    total = query.count()
    items = query.offset((page - 1) * size).limit(size).all()
    return items, total
