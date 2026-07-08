from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.user import User
from app.schemas.user import UserUpdate


def get_user_by_id(db: Session, user_id: int) -> User:
    user = db.query(User).filter(User.id == user_id, User.is_active == True).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


def update_user(db: Session, user_id: int, payload: UserUpdate, current_user: User) -> User:
    if current_user.id != user_id and current_user.role.value != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to update this user")
    user = get_user_by_id(db, user_id)
    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user, field, value)
    db.commit()
    db.refresh(user)
    return user


def deactivate_user(db: Session, user_id: int) -> dict:
    user = get_user_by_id(db, user_id)
    user.is_active = False
    db.commit()
    return {"message": f"User {user_id} deactivated"}


def list_users(db: Session, page: int = 1, size: int = 20):
    offset = (page - 1) * size
    total = db.query(User).count()
    users = db.query(User).offset(offset).limit(size).all()
    return {"total": total, "page": page, "size": size, "items": users}
