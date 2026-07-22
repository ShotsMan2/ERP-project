from datetime import date, datetime
from sqlalchemy import Boolean, Date, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.base import BaseModel

class JobPosting(BaseModel):
    __tablename__ = "hr_job_postings"

    title: Mapped[str] = mapped_column(String(100), nullable=False)
    department: Mapped[str] = mapped_column(String(100), nullable=False)
    location: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    requirements: Mapped[dict | None] = mapped_column(JSONB, nullable=True) # JSON list of requirements
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    published_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    closed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

class Candidate(BaseModel):
    __tablename__ = "hr_candidates"

    first_name: Mapped[str] = mapped_column(String(50), nullable=False)
    last_name: Mapped[str] = mapped_column(String(50), nullable=False)
    email: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)
    phone: Mapped[str | None] = mapped_column(String(20), nullable=True)
    resume_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    parsed_skills: Mapped[dict | None] = mapped_column(JSONB, nullable=True) # Extracted by AI
    ai_summary: Mapped[str | None] = mapped_column(Text, nullable=True) # Extracted by AI

class Application(BaseModel):
    __tablename__ = "hr_applications"

    candidate_id: Mapped[str] = mapped_column(String(36), ForeignKey("hr_candidates.id"), nullable=False)
    job_posting_id: Mapped[str] = mapped_column(String(36), ForeignKey("hr_job_postings.id"), nullable=False)
    stage: Mapped[str] = mapped_column(String(50), default="Applied") # Applied, Screening, Interview, Offer, Hired, Rejected
    ai_score: Mapped[int | None] = mapped_column(Integer, nullable=True) # 0-100 match score
    applied_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    last_updated_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
