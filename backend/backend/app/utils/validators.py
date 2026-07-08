import re


def validate_phone(phone: str) -> bool:
    pattern = re.compile(r"^\+?[1-9]\d{7,14}$")
    return bool(pattern.match(phone))


def validate_rating(rating: float) -> bool:
    return 1.0 <= rating <= 5.0


def sanitize_string(value: str, max_length: int = 500) -> str:
    """Strip leading/trailing whitespace and truncate."""
    return value.strip()[:max_length]
