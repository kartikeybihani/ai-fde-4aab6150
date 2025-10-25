from datetime import datetime
from typing import Optional
from sqlalchemy import Column, Integer, String, DateTime, Float, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    role = Column(String, nullable=False)
    department = Column(String, nullable=False)
    hire_date = Column(DateTime, default=datetime.utcnow, nullable=False)
    status = Column(String, default="active", nullable=False)
    hourly_rate = Column(Float, nullable=False)
    is_supervisor = Column(Boolean, default=False)
    supervisor_id = Column(Integer, ForeignKey("employees.id"), nullable=True)
    last_status_update = Column(DateTime, default=datetime.utcnow)
    performance_score = Column(Float, default=0.0)
    total_hours_worked = Column(Float, default=0.0)
    available_pto = Column(Float, default=0.0)
    phone_number = Column(String)
    emergency_contact = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    projects = relationship("Project", secondary="employee_projects", back_populates="employees")
    supervised_employees = relationship("Employee", 
                                     backref="supervisor",
                                     remote_side=[id],
                                     uselist=True)

    def update_status(self, new_status: str) -> None:
        self.status = new_status
        self.last_status_update = datetime.utcnow()

    def update_performance_score(self, score: float) -> None:
        if 0 <= score <= 100:
            self.performance_score = score
        else:
            raise ValueError("Performance score must be between 0 and 100")

    def add_hours_worked(self, hours: float) -> None:
        if hours > 0:
            self.total_hours_worked += hours
        else:
            raise ValueError("Hours worked must be positive")

    def adjust_pto(self, hours: float) -> None:
        new_balance = self.available_pto + hours
        if new_balance >= 0:
            self.available_pto = new_balance
        else:
            raise ValueError("PTO balance cannot be negative")

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "email": self.email,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "role": self.role,
            "department": self.department,
            "status": self.status,
            "hourly_rate": self.hourly_rate,
            "is_supervisor": self.is_supervisor,
            "supervisor_id": self.supervisor_id,
            "performance_score": self.performance_score,
            "total_hours_worked": self.total_hours_worked,
            "available_pto": self.available_pto,
            "last_status_update": self.last_status_update.isoformat() if self.last_status_update else None
        }