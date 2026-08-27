from sqlalchemy.ext.asyncio import AsyncSession
from app.crud.product import get_product_crud, get_my_product_crud, delete_product_crud, add_product_crud
from app.core.cloudinary_config import cloudinary
import uuid
import cloudinary.uploader
from fastapi import UploadFile, HTTPException, status
import asyncio

async def get_product_services(page: int, db: AsyncSession):
    try:
        data = await get_product_crud(db, page)
        return data
    except Exception as e:
        raise e from e


async def get_my_product_services(page: int, db: AsyncSession, id: uuid.UUID):
    try:
        data = await get_my_product_crud(db, page, id)
        return data
    except Exception as e:
        raise e from e


async def delete_product_service(db: AsyncSession, user_id: uuid.UUID, product_id: uuid.UUID):
    try:
        data = await delete_product_crud(db, user_id, product_id)
        await cloudinary_delete(data["image_public_id"])
        return True
    except Exception as e:
        raise e from e

async def cloudinary_upload(image: UploadFile) -> dict:
    allowed_types = ["image/jpeg", "image/png", "image/webp", "image/jpg"]
    if image.content_type not in allowed_types:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Not supported file type")
    
    max_size = 2 * 1024 * 1024

    content = await image.read()

    if len(content) > max_size:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Max size of file should be 2MB only")
    
    try:
        result = await asyncio.to_thread(cloudinary.uploader.upload,
            content,
            folder="CampusConnect",
            transformation=[
                {"width": 400, "height": 400, "crop": "fill", "gravity": "face"},
                {"quality": "auto"},      # auto compress
                {"fetch_format": "auto"}  # serve webp to browsers that support it
            ]
        )


        return {
            "image_url": result["secure_url"],
            "image_public_id": result["public_id"]
        }
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Image Upload Failed: {str(e)}")
    

async def cloudinary_delete(avatar_public_id: str):
    try:
        await asyncio.to_thread(cloudinary.uploader.destroy, public_id=avatar_public_id)
    except:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="failed to delete old avatar")


async def add_product_service(db: AsyncSession, title: str, seller_id: uuid.UUID, image_url: str, image_public_id: str, price: int, description: str|None):
    try:
        result = await add_product_crud(db, title, seller_id, image_url, image_public_id, price, description)
        return result
    except Exception as e:
        raise e from e