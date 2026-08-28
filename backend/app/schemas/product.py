from pydantic import BaseModel
from fastapi import Form
from typing import Optional
import uuid
from datetime import datetime


class ProductResponse(BaseModel):
    id: uuid.UUID
    seller_id: uuid.UUID
    seller_contact_number: str
    seller_name: str
    seller_college: str
    title: str
    image_url: str
    image_public_id: str
    price: int
    description: Optional[str]
    created_at: datetime


class PaginatedProductResponse(BaseModel):
    page_number: int
    total_pages: int
    has_previous: bool
    has_next: bool
    data: list[ProductResponse]


class AddProduct(BaseModel):
    title: str
    price: int
    description: Optional[str]

    @classmethod
    def form_data(
        cls,
        title = Form(),
        price = Form(),
        description = Form()
    ):
        return cls(title=title, price=price, description=description)
    
