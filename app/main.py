from fastapi import FastAPI, status
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI) :
    print("Server Start")
    yield
    print("Server Stop")


app = FastAPI(lifespan = lifespan)

@app.get(path='/home', status_code = status.HTTP_200_OK, response_model=dict[str, str])
async def home():
    return {"message": "Welcome Freshers"}