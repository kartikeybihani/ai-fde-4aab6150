from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from typing import Optional, List

from .base import Base


class Material(Base):
    __tablename__ = "materials"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(String(1000))
    sku = Column(String(50), unique=True, nullable=False)
    quantity = Column(Float, default=0)
    unit = Column(String(50), nullable=False)
    min_quantity = Column(Float, default=0)
    price_per_unit = Column(Float, nullable=False)
    supplier_id = Column(Integer, ForeignKey("suppliers.id"))
    location = Column(String(255))
    is_active = Column(Boolean, default=True)
    last_ordered = Column(DateTime(timezone=True))
    last_updated = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    supplier = relationship("Supplier", back_populates="materials")
    project_materials = relationship("ProjectMaterial", back_populates="material")

    def check_low_stock(self) -> bool:
        return self.quantity <= self.min_quantity

    def update_quantity(self, amount: float) -> None:
        self.quantity = max(0, self.quantity + amount)
        self.last_updated = func.now()

    def calculate_total_value(self) -> float:
        return self.quantity * self.price_per_unit

    @property
    def availability_status(self) -> str:
        if self.quantity <= 0:
            return "out_of_stock"
        elif self.check_low_stock():
            return "low_stock"
        return "available"


class ProjectMaterial(Base):
    __tablename__ = "project_materials"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    material_id = Column(Integer, ForeignKey("materials.id"), nullable=False)
    quantity_allocated = Column(Float, nullable=False)
    quantity_used = Column(Float, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    project = relationship("Project", back_populates="project_materials")
    material = relationship("Material", back_populates="project_materials")

    def update_usage(self, used_quantity: float) -> None:
        self.quantity_used = min(self.quantity_allocated, self.quantity_used + used_quantity)
        self.updated_at = func.now()

    @property
    def remaining_quantity(self) -> float:
        return self.quantity_allocated - self.quantity_used