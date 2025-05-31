from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
import models, schemas, auth
from fastapi.middleware.cors import CORSMiddleware
from auth import get_current_user
from models import Route

Base.metadata.create_all(bind=engine)
app = FastAPI()

# Liberar CORS para testes com frontend futuramente
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/register")
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    if db.query(models.User).filter_by(email=user.email).first():
        raise HTTPException(status_code=400, detail="Email já cadastrado")
    hashed = auth.hash_password(user.password)
    new_user = models.User(
        name=user.name,
        email=user.email,
        password_hash=hashed,
        role=user.role,
        mercado_pago_link=user.mercado_pago_link
    )
    db.add(new_user)
    db.commit()
    return {"message": "Usuário criado com sucesso"}

@app.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter_by(email=user.email).first()
    if not db_user or not auth.verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Credenciais inválidas")
    
    token = auth.create_token({"sub": db_user.email})
    
    return {
        "token": token,
        "user": {
            "id": db_user.id,
            "name": db_user.name,
            "email": db_user.email,
            "role": db_user.role,
            "mercado_pago_link": db_user.mercado_pago_link
        }
    }


@app.post("/routes")
def add_route(
    route: schemas.RouteCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role != "motorista":
        raise HTTPException(status_code=403, detail="Apenas motoristas podem cadastrar rotas")
    
    new_route = Route(user_id=current_user.id, **route.dict())
    db.add(new_route)   
    db.commit()
    return {"message": "Rota adicionada"}

@app.get("/routes/search")
def search_routes(lat: float, lng: float, db: Session = Depends(get_db)):
    radius = 0.1
    results = db.query(models.Route).filter(
        models.Route.origin_lat.between(lat - radius, lat + radius),
        models.Route.origin_lng.between(lng - radius, lng + radius)
    ).all()

    return [{
        "motorista_id": r.user_id,
        "preco": str(r.price),
        "mercado_pago_link": r.user.mercado_pago_link,
        "rota": {
            "origem": (r.origin_lat, r.origin_lng),
            "destino": (r.destination_lat, r.destination_lng)
        }
    } for r in results]

