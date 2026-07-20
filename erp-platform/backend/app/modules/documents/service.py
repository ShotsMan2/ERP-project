import uuid
from typing import Optional

from fastapi import HTTPException, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.modules.documents.models import Document


class DocumentService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def upload_document(self, file: UploadFile, metadata: dict, user_id: uuid.UUID | None = None) -> Document:
        import os
        import shutil
        from datetime import datetime, timezone

        upload_dir = "uploads/documents"
        os.makedirs(upload_dir, exist_ok=True)
        file_ext = os.path.splitext(file.filename)[1] if file.filename else ""
        file_name = f"{uuid.uuid7()}{file_ext}"
        file_path = os.path.join(upload_dir, file_name)

        content = await file.read()
        with open(file_path, "wb") as f:
            f.write(content)

        doc = Document(
            company_id=uuid.UUID(metadata["company_id"]) if metadata.get("company_id") else None,
            documentable_type=metadata.get("documentable_type"),
            documentable_id=uuid.UUID(metadata["documentable_id"]) if metadata.get("documentable_id") else None,
            file_name=file.filename or file_name,
            file_path=file_path,
            mime_type=file.content_type,
            size_bytes=len(content),
            version=1,
            uploaded_by=user_id,
        )
        self.db.add(doc)
        await self.db.flush()
        return doc

    async def get_document(self, document_id: uuid.UUID) -> Document:
        from sqlalchemy import select
        result = await self.db.execute(select(Document).where(Document.id == document_id, Document.deleted_at.is_(None)))
        doc = result.scalar_one_or_none()
        if not doc:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
        return doc

    async def list_documents(self, documentable_type: str | None = None, documentable_id: uuid.UUID | None = None, skip: int = 0, limit: int = 100) -> tuple[list[Document], int]:
        from sqlalchemy import select, func
        query = select(Document).where(Document.deleted_at.is_(None))
        count_query = select(func.count(Document.id)).where(Document.deleted_at.is_(None))
        if documentable_type:
            query = query.where(Document.documentable_type == documentable_type)
            count_query = count_query.where(Document.documentable_type == documentable_type)
        if documentable_id:
            query = query.where(Document.documentable_id == documentable_id)
            count_query = count_query.where(Document.documentable_id == documentable_id)
        query = query.offset(skip).limit(limit).order_by(Document.created_at.desc())
        result = await self.db.execute(query)
        count_result = await self.db.execute(count_query)
        return result.scalars().all(), count_result.scalar() or 0
