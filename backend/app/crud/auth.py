from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, exists, update
from app.models.db_models import User
from fastapi import HTTPException, status


async def email_exist(email: str, db: AsyncSession) -> bool|None:
    """ Check if email exist in database """
    try:
        result = await db.execute(select(exists().where(User.username==email)))
        return result.scalar()
    except Exception as e:
        return None


async def add_user(username: str, hashed_password: str, contact: str, college: str, name: str, db: AsyncSession) -> User:
    """ Add user to database """
    try:
        new_user = User(username=username, hashed_password=hashed_password, contact_number=contact, college=college, name=name)
        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)
        return new_user
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error: {e}") from e


async def get_user_by_email(username: str, db: AsyncSession) -> User|None:
    """ Get user by email """
    try:
        result = await db.execute(select(User).where(User.username==username, User.is_active==True))
        return result.scalar()
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error: {e}") from e


async def get_user(username: str, token_version: int, db: AsyncSession):
    result = await db.execute(select(User).where(User.username==username, User.is_active==True, User.token_version==token_version))
    user = result.scalar_one_or_none()
    return user


async def increment_token_version(username: str, db: AsyncSession):
    try:
        result = await db.execute(update(User).values(token_version = User.token_version+1).where(User.username==username, User.is_active==True))
        await db.commit()
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal Server Error")


async def change_password(username: str, new_password: str, db: AsyncSession):
    try:
        result = await db.execute(update(User).values(hashed_password=new_password, token_version=User.token_version+1).where(User.username == username, User.is_active == True))
        await db.commit()
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Error while changing Password")