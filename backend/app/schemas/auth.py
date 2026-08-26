from pydantic import BaseModel, EmailStr, Field
import uuid


class Register(BaseModel):
    username: EmailStr = Field(description="Email ID of user")
    contact_number: str = Field(description="Phone number of user", min_length=10, max_length=15)
    name: str = Field(description="name of User")
    college: str = Field(description="college name")
    password: str = Field(description="Hashed Password")


class UserResponse(BaseModel):
    id: uuid.UUID
    username: EmailStr
    contact_number: str
    name: str
    college: str
    model_config = {"from_attributes": True}


class Token(BaseModel):
    access_token: str
    refresh_token: str
    model_config = {"from_attributes": True}


class RefreshToken(BaseModel):
    refresh_token: str


class Password(BaseModel):
    new_password: str
    old_password: str