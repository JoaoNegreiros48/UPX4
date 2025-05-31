from pydantic import BaseModel, EmailStr
from typing import Literal

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Literal["caroneiro", "motorista"]
    mercado_pago_link: str = ""

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class RouteCreate(BaseModel):
    origin_lat: float
    origin_lng: float
    destination_lat: float
    destination_lng: float
    price: float
