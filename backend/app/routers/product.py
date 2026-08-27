from fastapi import APIRouter, HTTPException, status, Depends, Path, Query, File, UploadFile
from app.core.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.product import PaginatedProductResponse, AddProduct, ProductResponse
from app.services.product import get_product_services, get_my_product_services, delete_product_service, add_product_service, cloudinary_upload
from app.services.auth import get_current_user
import uuid


router = APIRouter(prefix='/product', tags=['product'])

@router.get(path='/items', status_code= status.HTTP_200_OK ,response_model=PaginatedProductResponse)
async def get_products(db: AsyncSession = Depends(get_db), page: int = Query(description="Page Number", gt=0)):
    try:
        data = await get_product_services(page, db)
        return data
    except Exception as e:
        raise e from e


@router.post(path='/items', status_code=status.HTTP_201_CREATED, response_model=ProductResponse)
async def add_product(product: AddProduct = Depends(AddProduct.form_data), image: UploadFile = File(), db: AsyncSession = Depends(get_db), user = Depends(get_current_user)):
    result = await cloudinary_upload(image)
    if not result:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error while creating image url")

    try:
        data = await add_product_service(db, product.title, user.id, result["image_url"], result["image_public_id"], product.price, product.description)
        return data
    except Exception as e:
        raise e from e


@router.get(path='/items/me', status_code=status.HTTP_200_OK, response_model=PaginatedProductResponse)
async def get_my_prorducts(db: AsyncSession = Depends(get_db), user = Depends(get_current_user), page: int = Query(description="Page Number", gt=0)):
    try:
        data = await get_my_product_services(page, db, user.id)
        return data
    except Exception as e:
        raise e from e


@router.delete(path='/items/{product_id}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(db: AsyncSession = Depends(get_db), user = Depends(get_current_user), product_id: uuid.UUID = Path(description="product id")):
    try:
        await delete_product_service(db, user.id, product_id)
        return {"message": "deleted successfully"}
    except Exception as e:
        raise e from e