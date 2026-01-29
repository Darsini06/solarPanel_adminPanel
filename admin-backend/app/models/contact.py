from pydantic import BaseModel, Field, EmailStr
from datetime import datetime
from typing import Optional, List

class ContactCreate(BaseModel):
    first_name: str = Field(..., description="First name of the sender")
    last_name: str = Field(..., description="Last name of the sender")
    email: EmailStr = Field(..., description="Email address of the sender")
    message: str = Field(..., description="Message content")

class ContactUpdate(BaseModel):
    status: str = Field(..., description="Status of the contact request (e.g., new, read, replied)")

class ContactResponse(BaseModel):
    id: str
    first_name: str
    last_name: str
    email: str
    message: str
    status: str
    created_at: datetime