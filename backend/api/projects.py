from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession

from ..models.project import Project, ProjectCreate, ProjectUpdate, ProjectProgress
from ..database import get_db
from ..auth.auth_bearer import JWTBearer
from ..services.project_service import (
    create_project_db,
    get_project_db,
    get_projects_db,
    update_project_db,
    delete_project_db,
    update_project_progress_db
)

router = APIRouter(
    prefix="/api/projects",
    tags=["projects"],
    dependencies=[Depends(JWTBearer())]
)

@router.post("/", response_model=Project)
async def create_project(
    project: ProjectCreate,
    db: AsyncSession = Depends(get_db)
) -> Project:
    return await create_project_db(db, project)

@router.get("/", response_model=List[Project])
async def get_projects(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1),
    status: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
) -> List[Project]:
    return await get_projects_db(db, skip, limit, status)

@router.get("/{project_id}", response_model=Project)
async def get_project(
    project_id: int,
    db: AsyncSession = Depends(get_db)
) -> Project:
    project = await get_project_db(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.put("/{project_id}", response_model=Project)
async def update_project(
    project_id: int,
    project_update: ProjectUpdate,
    db: AsyncSession = Depends(get_db)
) -> Project:
    project = await update_project_db(db, project_id, project_update)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.delete("/{project_id}")
async def delete_project(
    project_id: int,
    db: AsyncSession = Depends(get_db)
) -> dict:
    deleted = await delete_project_db(db, project_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"message": "Project deleted successfully"}

@router.put("/{project_id}/progress", response_model=ProjectProgress)
async def update_project_progress(
    project_id: int,
    progress: ProjectProgress,
    db: AsyncSession = Depends(get_db)
) -> ProjectProgress:
    updated_progress = await update_project_progress_db(db, project_id, progress)
    if not updated_progress:
        raise HTTPException(status_code=404, detail="Project not found")
    return updated_progress