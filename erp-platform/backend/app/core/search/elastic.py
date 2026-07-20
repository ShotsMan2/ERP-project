from __future__ import annotations

from typing import Any

from elasticsearch import AsyncElasticsearch
from elasticsearch.helpers import async_bulk

from app.config import settings


class ESClient:
    def __init__(self) -> None:
        self._client: AsyncElasticsearch | None = None

    async def initialize(self) -> None:
        if self._client is None:
            http_auth = None
            if settings.ES_USER and settings.ES_PASSWORD:
                http_auth = (settings.ES_USER, settings.ES_PASSWORD)
            self._client = AsyncElasticsearch(
                hosts=[settings.ES_HOST],
                http_auth=http_auth,
                verify_certs=settings.ES_VERIFY_CERTS,
                max_retries=settings.ES_MAX_RETRIES,
                request_timeout=settings.ES_TIMEOUT,
            )

    async def close(self) -> None:
        if self._client:
            await self._client.close()
            self._client = None

    @property
    def client(self) -> AsyncElasticsearch:
        if self._client is None:
            raise RuntimeError("ES client not initialized. Call initialize() first.")
        return self._client

    async def ping(self) -> bool:
        return await self.client.ping()

    async def create_index(self, index: str, mappings: dict[str, Any] | None = None, settings: dict[str, Any] | None = None) -> dict:
        prefixed_index = f"{settings.SEARCH_INDEX_PREFIX}{index}"
        body: dict[str, Any] = {}
        if mappings:
            body["mappings"] = mappings
        if settings:
            body["settings"] = {
                "number_of_shards": 1,
                "number_of_replicas": 1,
                **(settings or {}),
            }
        return await self.client.indices.create(index=prefixed_index, body=body, ignore=[400])

    async def delete_index(self, index: str) -> dict:
        prefixed_index = f"{settings.SEARCH_INDEX_PREFIX}{index}"
        return await self.client.indices.delete(index=prefixed_index, ignore=[404])

    async def index_document(self, index: str, doc_id: str, document: dict[str, Any]) -> dict:
        prefixed_index = f"{settings.SEARCH_INDEX_PREFIX}{index}"
        return await self.client.index(index=prefixed_index, id=doc_id, body=document, refresh="wait_for")

    async def bulk_index(self, index: str, documents: list[dict[str, Any]]) -> tuple[int, int | list]:
        prefixed_index = f"{settings.SEARCH_INDEX_PREFIX}{index}"

        def generate_actions():
            for doc in documents:
                yield {
                    "_index": prefixed_index,
                    "_id": doc.get("id"),
                    "_source": doc,
                }

        return await async_bulk(self.client, generate_actions())

    async def search(
        self,
        index: str,
        query: dict[str, Any],
        size: int = 10,
        offset: int = 0,
    ) -> dict:
        prefixed_index = f"{settings.SEARCH_INDEX_PREFIX}{index}"
        body = {
            "query": query,
            "size": size,
            "from": offset,
        }
        return await self.client.search(index=prefixed_index, body=body)

    async def update_document(self, index: str, doc_id: str, document: dict[str, Any]) -> dict:
        prefixed_index = f"{settings.SEARCH_INDEX_PREFIX}{index}"
        return await self.client.update(index=prefixed_index, id=doc_id, body={"doc": document})

    async def delete_document(self, index: str, doc_id: str) -> dict:
        prefixed_index = f"{settings.SEARCH_INDEX_PREFIX}{index}"
        return await self.client.delete(index=prefixed_index, id=doc_id, ignore=[404])


es_client = ESClient()


async def create_index(index: str, mappings: dict | None = None, settings: dict | None = None) -> dict:
    return await es_client.create_index(index, mappings, settings)


async def index_document(index: str, doc_id: str, document: dict) -> dict:
    return await es_client.index_document(index, doc_id, document)


async def search_documents(index: str, query: dict, size: int = 10, offset: int = 0) -> dict:
    return await es_client.search(index, query, size, offset)


async def delete_index(index: str) -> dict:
    return await es_client.delete_index(index)
