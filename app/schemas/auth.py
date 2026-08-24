from pydantic import BaseModel, EmailStr, Field
import uuid


class Register(BaseModel):
    username: EmailStr = Field(description="Email ID of user")
    hashed_password: str = Field(description="Hashed Password")


class UserResponse(BaseModel):
    id: uuid.UUID
    username: EmailStr


class Token(BaseModel):
    access_token: str
    refresh_token: str
    model_config = {"from_attributes": True}


class RefreshToken(BaseModel):
    refresh_token: str


class Password(BaseModel):
    new_password: str
    old_password: str