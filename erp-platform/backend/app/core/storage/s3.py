from __future__ import annotations

import os
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

import boto3
from botocore.config import Config as BotoConfig
from botocore.exceptions import ClientError

from app.config import settings


class S3Client:
    def __init__(self) -> None:
        self._client: Any = None
        self._bucket: str = settings.S3_BUCKET

    def _get_client(self) -> Any:
        if self._client is None:
            self._client = boto3.client(
                "s3",
                endpoint_url=settings.S3_ENDPOINT,
                aws_access_key_id=settings.S3_ACCESS_KEY,
                aws_secret_access_key=settings.S3_SECRET_KEY,
                region_name=settings.S3_REGION,
                use_ssl=settings.S3_USE_SSL,
                config=BotoConfig(
                    retries={"max_attempts": 3, "mode": "standard"},
                    connect_timeout=10,
                    read_timeout=30,
                ),
            )
            self._ensure_bucket()
        return self._client

    def _ensure_bucket(self) -> None:
        try:
            self._client.head_bucket(Bucket=self._bucket)
        except ClientError:
            self._client.create_bucket(Bucket=self._bucket)

    def upload_fileobj(self, file_obj: Any, key: str, content_type: str | None = None, metadata: dict | None = None) -> str:
        client = self._get_client()
        extra_args: dict[str, Any] = {}
        if content_type:
            extra_args["ContentType"] = content_type
        if metadata:
            extra_args["Metadata"] = metadata
        client.upload_fileobj(file_obj, self._bucket, key, ExtraArgs=extra_args)
        return key

    def download_fileobj(self, key: str) -> Any:
        from io import BytesIO
        client = self._get_client()
        buf = BytesIO()
        client.download_fileobj(self._bucket, key, buf)
        buf.seek(0)
        return buf

    def delete_file(self, key: str) -> bool:
        client = self._get_client()
        try:
            client.delete_object(Bucket=self._bucket, Key=key)
            return True
        except ClientError:
            return False

    def get_file_url(self, key: str, expires_in: int = 3600) -> str:
        client = self._get_client()
        try:
            url = client.generate_presigned_url(
                "get_object",
                Params={"Bucket": self._bucket, "Key": key},
                ExpiresIn=expires_in,
            )
            return url
        except ClientError:
            return ""

    def list_files(self, prefix: str = "") -> list[dict]:
        client = self._get_client()
        try:
            response = client.list_objects_v2(Bucket=self._bucket, Prefix=prefix)
            return response.get("Contents", [])
        except ClientError:
            return []

    def file_exists(self, key: str) -> bool:
        client = self._get_client()
        try:
            client.head_object(Bucket=self._bucket, Key=key)
            return True
        except ClientError:
            return False


s3_client = S3Client()


async def upload_file(file_path: str | Path, key: str, content_type: str | None = None) -> str:
    with open(file_path, "rb") as f:
        return s3_client.upload_fileobj(f, key, content_type)


async def download_file(key: str, destination: str | Path) -> str:
    buf = s3_client.download_fileobj(key)
    dest_path = Path(destination)
    dest_path.parent.mkdir(parents=True, exist_ok=True)
    with open(dest_path, "wb") as f:
        f.write(buf.read())
    return str(dest_path)


async def delete_file(key: str) -> bool:
    return s3_client.delete_file(key)


async def get_file_url(key: str, expires_in: int = 3600) -> str:
    return s3_client.get_file_url(key, expires_in)


async def list_files(prefix: str = "") -> list[dict]:
    return s3_client.list_files(prefix)
