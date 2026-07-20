from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class DocumentUpload(BaseModel):
    documentable_type: Optional[str] = None
    documentable_id: Optional[str] = None
    company_id: Optional[str] = None


class DocumentResponse(BaseModel):
    id: str
    file_name: str
    file_path: str
    mime_type: Optional[str] = None
    size_bytes: Optional[int] = None
    version: int
    documentable_type: Optional[str] = None
    documentable_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
