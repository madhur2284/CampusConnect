from fastapi import FastAPI, status
from contextlib import asynccontextmanager
from app.routers import auth, product
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings


cors_origins = [
    origin.strip()
    for origin in settings().CORS_ORIGINS.split(",")
    if origin.strip()
]

@asynccontextmanager
async def lifespan(app: FastAPI) :
    print("Server Start")
    yield
    print("Server Stop")


app = FastAPI(lifespan = lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(product.router)

@app.get(path='/home', status_code = status.HTTP_200_OK, response_model=dict[str, str])
async def home():
    return {"message": "Welcome Freshers"}