import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, Form, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import get_current_user_id, check_permission
from app.modules.documents.schemas import DocumentResponse
from app.modules.documents.service import DocumentService

router = APIRouter(prefix="/documents", tags=["Documents"])


@router.post("/upload", response_model=DocumentResponse, status_code=201)
async def upload_document(file: UploadFile = File(...), documentable_type: str = Form(None), documentable_id: str = Form(None), company_id: str = Form(None), user_id: str = Depends(get_current_user_id), db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("documents.create"))):
    service = DocumentService(db)
    metadata = {"documentable_type": documentable_type, "documentable_id": documentable_id, "company_id": company_id}
    doc = await service.upload_document(file, metadata, uuid.UUID(user_id))
    return DocumentResponse.model_validate(doc)


@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(document_id: str, db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("documents.read"))):
    service = DocumentService(db)
    doc = await service.get_document(uuid.UUID(document_id))
    return DocumentResponse.model_validate(doc)


@router.get("", response_model=list[DocumentResponse])
async def list_documents(documentable_type: str | None = Query(None), documentable_id: str | None = Query(None), page: int = Query(1, ge=1), size: int = Query(100, ge=1, le=200), db: AsyncSession = Depends(get_db), _: bool = Depends(lambda: check_permission("documents.read"))):
    service = DocumentService(db)
    items, _ = await service.list_documents(
        documentable_type=documentable_type,
        documentable_id=uuid.UUID(documentable_id) if documentable_id else None,
        skip=(page - 1) * size,
        limit=size,
    )
    return [DocumentResponse.model_validate(d) for d in items]
