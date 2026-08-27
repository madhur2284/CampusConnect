from sqlalchemy.ext.asyncio import AsyncSession
from app.models.db_models import Product
from sqlalchemy import func, select, update
from sqlalchemy.orm import selectinload
from fastapi import HTTPException, status
import uuid
import logging

logger = logging.getLogger(__name__)


async def get_product_crud(db: AsyncSession, page: int):
    result = await db.execute(select(func.count(Product.id)).where(Product.is_active==True))
    total_pages = (int)((result.scalar_one() + 14 - 1)/14)
    if(total_pages <= 0):
        return {
            "page_number": 0,
            "total_pages": 0,
            "has_previous": False,
            "has_next": False,
            "data": []
        }

    if(page > total_pages):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"total pages are only {total_pages}")

    offset = (page-1)*14

    result = await db.execute(
        select(Product)
        .options(selectinload(Product.seller))
        .where(Product.is_active == True)
        .offset(offset)
        .limit(14)
    )
    data = result.scalars().all()

    return {
        "page_number": page,
        "total_pages": total_pages,
        "has_previous": True if (page != 1) else False,
        "has_next": True if (page != total_pages) else False,
        "data": [{
            "id": row.id,
            "seller_id": row.seller_id,
            "seller_contact_number": row.seller.contact_number,
            "title": row.title,
            "image_url": row.image_url,
            "image_public_id": row.image_public_id,
            "price": row.price,
            "description": row.description,
            "created_at": row.created_at,
        } for row in data]
    }


async def get_my_product_crud(db: AsyncSession, page: int, id: uuid.UUID):
    result = await db.execute(select(func.count(Product.id)).where(Product.is_active==True, Product.seller_id==id))
    total_pages = (int)((result.scalar_one() + 14 - 1)/14)
    if(total_pages <= 0):
        return {
            "page_number": 0,
            "total_pages": 0,
            "has_previous": False,
            "has_next": False,
            "data": []
        }

    if(page > total_pages):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"total pages are only {total_pages}")

    offset = (page-1)*14

    result = await db.execute(
        select(Product)
        .options(selectinload(Product.seller))
        .where(Product.is_active == True, Product.seller_id == id)
        .offset(offset)
        .limit(14)
    )
    data = result.scalars().all()

    return {
        "page_number": page,
        "total_pages": total_pages,
        "has_previous": True if (page != 1) else False,
        "has_next": True if (page != total_pages) else False,
        "data": [{
            "id": row.id,
            "seller_id": row.seller_id,
            "seller_contact_number": row.seller.contact_number,
            "title": row.title,
            "image_url": row.image_url,
            "image_public_id": row.image_public_id,
            "price": row.price,
            "description": row.description,
            "created_at": row.created_at,
        } for row in data]
    }


async def delete_product_crud(db: AsyncSession, user_id: uuid.UUID, product_id: uuid.UUID):
    result = await db.execute(select(Product).where(Product.is_active==True, Product.seller_id==user_id, Product.id==product_id))
    product = result.scalar()

    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product didn't exist")

    product.is_active=False
    try:
        await db.commit()
        return {"image_public_id": product.image_public_id}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Server Error")


async def add_product_crud(db: AsyncSession, title: str, seller_id: uuid.UUID, image_url: str, image_public_id: str, price: int, description: str|None):
    product = Product(title=title, seller_id=seller_id, image_url=image_url, image_public_id=image_public_id, price=price, description=description)
    try:
        db.add(product)
        await db.commit()
        await db.refresh(product)
        await db.refresh(product, ["seller"])
        return {
            "id": product.id,
            "seller_id": product.seller_id,
            "seller_contact_number": product.seller.contact_number,
            "title": product.title,
            "image_url": product.image_url,
            "image_public_id": product.image_public_id,
            "price": product.price,
            "description": product.description,
            "created_at": product.created_at,
        }
    except Exception as e:
        await db.rollback()
        logger.exception("Failed to add product")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error while adding product") from e