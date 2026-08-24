from jose import JWTError, jwt
from pwdlib import PasswordHash
import asyncio
from datetime import timezone, timedelta, datetime
from app.core.config import settings
from app.core.database import get_db
from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from app.crud.auth import email_exist, add_user, get_user_by_email, get_user, increment_token_version, change_password
from sqlalchemy.ext.asyncio import AsyncSession
OAuth = OAuth2PasswordBearer(tokenUrl='/auth/login')

context = PasswordHash.recommended()

async def hash_password(password: str) -> str|None:
    """ Hash Password """
    try:
        hashed_password = await asyncio.to_thread(context.hash, password)
        return hashed_password
    except Exception:
        return None


async def verify_password(hashed_password, simple_password) -> bool:
    """ Verify Password """
    try:
        flag = await asyncio.to_thread(context.verify, hashed_password, simple_password)
        return flag
    except Exception:
        return False


async def encode_jwt(payload: dict, type: str) -> str:
    """ Encode JWT Token. Data = {username, token_version, type} """
    try:
        if(type == "access"):
            payload["exp"] = datetime.now(timezone.utc) + timedelta(minutes=settings().ACCESS_TOKEN_EXPIRY)
        elif(type == "refresh"):
            payload["exp"] = datetime.now(timezone.utc) + timedelta(days=settings().REFRESH_TOKEN_EXPIRY)
        token = jwt.encode(
            payload,
            key=settings().SECRET_KEY,
            algorithm="HS256"
        )
        return token
    except JWTError as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error: {e}") from e


async def decode_jwt(token: str) -> dict:
    try:
        payload = jwt.decode(token=token, key=settings().SECRET_KEY, algorithms=['HS256'])
        return payload
    except JWTError as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error: {e}") from e


async def register_user_service(username: str, password: str, db: AsyncSession) -> bool:
    """ Register User """
    try:
        if await email_exist(username, db):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already exist")
        
        hashed_password = await hash_password(password)
        if not hashed_password:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error while hashing password")
        
        user = await add_user(username, hashed_password, db)
        return True
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error: {e}") from e


async def login_user_service(username: str, password: str, db: AsyncSession) -> dict:
    """ Login User """
    try:
        user = await get_user_by_email(username, db)
        if not user:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User does not exist")
        
        if not await verify_password(user.hashed_password, password):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Password")
        
        access_token = await encode_jwt({"username": user.username, "token_version": user.token_version, "type": "access"}, "access")
        refresh_token = await encode_jwt({"username": user.username, "token_version": user.token_version, "type": "refresh"}, "refresh")
        return {"access_token": access_token, "refresh_token": refresh_token}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error: {e}") from e


async def get_current_user(db: AsyncSession = Depends(get_db), token:str = Depends(OAuth)):
    payload = await decode_jwt(token)
    user = await get_user(payload["username"], payload["token_version"], db)
    if(not user):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized user")


async def refresh_token_service(token: str, db: AsyncSession):
    payload = await decode_jwt(token)

    if(payload["type"]!="refresh"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Token is not refresh Token")
    
    user = await get_user(payload["username"], payload["token_version"], db)

    if(not user):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized User")

    access_token = encode_jwt({"username": user.name, "token_version": user.token_version, "type": "access"}, "access")
    refresh_token = encode_jwt({"username": user.name, "token_version": user.token_version, "type": "refresh"}, "refresh")
    return {"access_token": access_token, "refresh_token": refresh_token}


async def logout_user_service(username: str, db: AsyncSession):
    try:
        await increment_token_version(username, db)
    except Exception as e:
        raise e from e


async def change_password_service(username: str, old_password: str, new_password: str, hashed_password: str, db: AsyncSession):
    if not await verify_password(hashed_password, old_password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Old Password Didn't match")

    new_hashed_password = await hash_password(new_password)
    if(not new_hashed_password):
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal Server Error")

    try:
        await change_password(username, new_password, db)
    except Exception as e:
        raise e from e  
    