from datetime import datetime
from typing import Optional, List
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Table
from sqlalchemy.orm import relationship, Mapped
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

project_employee = Table(
    'project_employee',
    Base.metadata,
    Column('project_id', Integer, ForeignKey('projects.id')),
    Column('employee_id', Integer, ForeignKey('employees.id'))
)

project_material = Table(
    'project_material',
    Base.metadata,
    Column('project_id', Integer, ForeignKey('projects.id')),
    Column('material_id', Integer, ForeignKey('materials.id')),
    Column('quantity_required', Float)
)

class Project(Base):
    __tablename__ = 'projects'

    id: Mapped[int] = Column(Integer, primary_key=True, index=True)
    name: Mapped[str] = Column(String(100), nullable=False)
    description: Mapped[str] = Column(String(500))
    start_date: Mapped[datetime] = Column(DateTime, nullable=False)
    end_date: Mapped[Optional[datetime]] = Column(DateTime)
    budget: Mapped[float] = Column(Float, nullable=False)
    progress: Mapped[float] = Column(Float, default=0.0)
    status: Mapped[str] = Column(String(20), default='PENDING')
    client_name: Mapped[str] = Column(String(100))
    priority: Mapped[int] = Column(Integer, default=1)
    created_at: Mapped[datetime] = Column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    employees: Mapped[List["Employee"]] = relationship(
        "Employee",
        secondary=project_employee,
        backref="projects"
    )

    materials: Mapped[List["Material"]] = relationship(
        "Material",
        secondary=project_material,
        backref="projects"
    )

    def calculate_progress(self) -> float:
        if not self.end_date or not self.start_date:
            return self.progress
            
        total_duration = (self.end_date - self.start_date).days
        if total_duration <= 0:
            return 100.0 if self.status == 'COMPLETED' else self.progress
            
        days_passed = (datetime.utcnow() - self.start_date).days
        calculated_progress = min(100.0, (days_passed / total_duration) * 100)
        return calculated_progress if self.status != 'COMPLETED' else 100.0

    def update_status(self) -> None:
        if self.progress >= 100:
            self.status = 'COMPLETED'
        elif self.progress > 0:
            self.status = 'IN_PROGRESS'
        else:
            self.status = 'PENDING'

    def is_over_budget(self, current_spend: float) -> bool:
        return current_spend > self.budget