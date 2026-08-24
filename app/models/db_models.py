from uuid6 import uuid7
from pydantic import EmailStr
from sqlalchemy.orm import mapped_column, Mapped
from sqlalchemy import Integer, String, UUID, ForeignKey, Text, DateTime, func, Boolean
import uuid
from app.core.database import Base
from datetime import datetime

class User(Base):
    __tablename__="users"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), default=uuid7, primary_key=True)
    username: Mapped[EmailStr] = mapped_column(String, nullable=False, unique=True)
    hashed_password: Mapped[str] = mapped_column(String, nullable=False)
    token_version: Mapped[int] = mapped_column(Integer, default=1, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)


class Product(Base):
    __tablename__="products"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), default=uuid7, primary_key=True)
    seller_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey('users.id'))
    title: Mapped[str] = mapped_column(String, nullable=False)
    image_url: Mapped[str] = mapped_column(String, nullable=False)
    price: Mapped[int] = mapped_column(Integer, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True, default="")
    contact_number: Mapped[str] = mapped_column(String, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=func.now())