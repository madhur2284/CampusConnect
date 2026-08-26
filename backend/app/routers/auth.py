from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.auth import Register, Token, Password, UserResponse
from app.core.database import get_db
from app.services.auth import register_user_service, login_user_service, refresh_token_service, get_current_user, logout_user_service, change_password_service
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter(prefix='/auth', tags=['auth'])

@router.post(path='/register', status_code=status.HTTP_201_CREATED, response_model=dict[str, str])
async def register_user(user: Register, db: AsyncSession = Depends(get_db)):
    """ Register User """
    flag = await register_user_service(user.username, user.password, user.contact_number, user.college, user.name, db)
    if(flag):
        return {"message": "User Registered Successfully"}
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error: User Registration Failed")


@router.post(path='/login', status_code=status.HTTP_200_OK, response_model=Token)
async def login_user(user: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    """ Login User """
    try:
        return await login_user_service(user.username, user.password, db)
    except HTTPException as e:
        raise e
    except Exception:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal Server Error")


@router.post(path='/refresh', status_code=status.HTTP_200_OK, response_model=Token)
async def refresh_token(token: str, db: AsyncSession = Depends(get_db)):
    """ Refresh Token """
    try:
        return await refresh_token_service(token, db)
    except Exception as e:
        raise e


@router.post(path='/logout', status_code=status.HTTP_200_OK)
async def logout_user(db: AsyncSession = Depends(get_db), user = Depends(get_current_user)):
    try:
        await logout_user_service(user.username, db)
        return {"message": "logout successfully"}
    except Exception as e:
        raise e from e


@router.post(path='/change_password', status_code=status.HTTP_200_OK)
async def change_password(passwords: Password, db: AsyncSession = Depends(get_db), user = Depends(get_current_user)):
    try:
        await change_password_service(user.username, passwords.old_password, passwords.new_password, user.hashed_password, db)
        return {"message": "Password Changed Suuccessfully"}
    except Exception as e:
        raise e from e


@router.get(path='/me', status_code=status.HTTP_200_OK, response_model=UserResponse)
async def get_me(db: AsyncSession = Depends(get_db), user = Depends(get_current_user)):
    return user
