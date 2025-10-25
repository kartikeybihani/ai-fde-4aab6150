from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from contextlib import asynccontextmanager
from typing import List

from api import employees, projects, materials
from models.employee import Base as EmployeeBase
from models.project import Base as ProjectBase
from models.material import Base as MaterialBase

DATABASE_URL = "postgresql://user:password@localhost:5432/construction_db"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    EmployeeBase.metadata.create_all(bind=engine)
    ProjectBase.metadata.create_all(bind=engine)
    MaterialBase.metadata.create_all(bind=engine)
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(employees.router, prefix="/api/employees", tags=["employees"])
app.include_router(projects.router, prefix="/api/projects", tags=["projects"])
app.include_router(materials.router, prefix="/api/materials", tags=["materials"])

@app.get("/")
async def root():
    return {"message": "Construction Management API"}

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return {"detail": exc.detail}, exc.status_code

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    return {"detail": "Internal server error"}, 500

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)