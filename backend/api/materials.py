from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from ..models.material import Material, MaterialCreate, MaterialUpdate
from ..database import get_db
from ..auth import get_current_user

router = APIRouter()

@router.get("/materials", response_model=List[Material])
async def get_materials(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    try:
        query = db.query(Material)
        if search:
            query = query.filter(Material.name.ilike(f"%{search}%"))
        materials = query.offset(skip).limit(limit).all()
        return materials
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Database error occurred")

@router.get("/materials/{material_id}", response_model=Material)
async def get_material(
    material_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    material = db.query(Material).filter(Material.id == material_id).first()
    if not material:
        raise HTTPException(status_code=404, detail="Material not found")
    return material

@router.post("/materials", response_model=Material)
async def create_material(
    material: MaterialCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    try:
        db_material = Material(**material.dict())
        db.add(db_material)
        db.commit()
        db.refresh(db_material)
        return db_material
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to create material")

@router.put("/materials/{material_id}", response_model=Material)
async def update_material(
    material_id: int,
    material_update: MaterialUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    db_material = db.query(Material).filter(Material.id == material_id).first()
    if not db_material:
        raise HTTPException(status_code=404, detail="Material not found")
    
    try:
        for key, value in material_update.dict(exclude_unset=True).items():
            setattr(db_material, key, value)
        db.commit()
        db.refresh(db_material)
        return db_material
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update material")

@router.delete("/materials/{material_id}")
async def delete_material(
    material_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    db_material = db.query(Material).filter(Material.id == material_id).first()
    if not db_material:
        raise HTTPException(status_code=404, detail="Material not found")
    
    try:
        db.delete(db_material)
        db.commit()
        return {"message": "Material deleted successfully"}
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to delete material")

@router.get("/materials/availability", response_model=List[Material])
async def get_available_materials(
    min_quantity: int = Query(1, ge=0),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    try:
        materials = db.query(Material)\
            .filter(Material.quantity >= min_quantity)\
            .order_by(Material.quantity.desc())\
            .all()
        return materials
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Failed to fetch material availability")