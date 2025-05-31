from sqlalchemy import Column, Integer, String, Enum, Float, ForeignKey, DECIMAL
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(Enum('caroneiro', 'motorista', name='user_roles'), nullable=False)
    mercado_pago_link = Column(String, nullable=True)

    # Relacionamento com as rotas (um motorista pode ter várias rotas)
    routes = relationship("Route", back_populates="user")

class Route(Base):
    __tablename__ = 'routes'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    origin_lat = Column(Float, nullable=False)
    origin_lng = Column(Float, nullable=False)
    destination_lat = Column(Float, nullable=False)
    destination_lng = Column(Float, nullable=False)
    price = Column(DECIMAL(10, 2), nullable=False)

    # Relacionamento com o motorista (usuário)
    user = relationship("User", back_populates="routes")
