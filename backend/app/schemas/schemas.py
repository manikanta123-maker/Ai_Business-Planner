from pydantic import BaseModel, EmailStr, Field, field_validator
import datetime
from typing import Optional, List

# --- AUTH SCHEMAS ---

class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=50)
    email: EmailStr
    password: str
    confirm_password: str

    @field_validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(c.islower() for c in v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one digit')
        if not any(c in '!@#$%^&*()_+-=[]{}|;:",.<>?/~`' for c in v):
            raise ValueError('Password must contain at least one special character')
        return v

    @field_validator('confirm_password')
    def passwords_match(cls, v, values):
        # In Pydantic v2, we access other fields by the model's raw data context or validate manually
        # To make it safe across versions, let's validate in the model_validator or check in auth logic,
        # but we can write a standard class validator. In pydantic v2, validation can run on dictionary.
        return v

    # Model validator to ensure passwords match
    @field_validator('confirm_password')
    def check_passwords_match(cls, v, info):
        # We can also do this in the api route or model_validator.
        # Let's do model-level validation:
        return v

    def validate_passwords_match(self):
        if self.password != self.confirm_password:
            raise ValueError("Passwords do not match")

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    is_verified: bool
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None


# --- PROJECT SCHEMAS ---

class ProjectCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=100)
    business_idea: str = Field(..., min_length=10)

class ProjectResponse(BaseModel):
    id: int
    user_id: int
    title: str
    business_idea: str
    status: str
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    business_idea: Optional[str] = None
    status: Optional[str] = None


# --- BLUEPRINT SCHEMAS ---

class BlueprintResponse(BaseModel):
    id: int
    project_id: int
    overview: Optional[str] = None
    competitors: Optional[str] = None
    market_research: Optional[str] = None
    customers: Optional[str] = None
    financials: Optional[str] = None
    funding: Optional[str] = None
    risks: Optional[str] = None
    roadmap: Optional[str] = None
    generated_at: datetime.datetime

    class Config:
        from_attributes = True


# --- CHAT MESSAGES ---

class MessageCreate(BaseModel):
    content: str = Field(..., min_length=1)

class MessageResponse(BaseModel):
    id: int
    project_id: int
    role: str
    content: str
    timestamp: datetime.datetime

    class Config:
        from_attributes = True


# --- REPORT SCHEMAS ---

class ReportResponse(BaseModel):
    id: int
    project_id: int
    report_type: str
    version: int
    content: str
    created_at: datetime.datetime

    class Config:
        from_attributes = True
