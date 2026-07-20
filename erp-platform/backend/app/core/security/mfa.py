from __future__ import annotations

import base64
import hashlib
import struct
import time
from typing import Tuple

from app.config import settings


def generate_totp_secret() -> str:
    random_bytes = hashlib.sha256(struct.pack(">Q", int(time.time() * 1000))).digest()
    return base64.b32encode(random_bytes[:20]).decode("utf-8")


def get_totp_uri(secret: str, email: str) -> str:
    issuer = settings.MFA_ISSUER_NAME
    encoded_issuer = issuer.replace(" ", "%20")
    encoded_email = email.replace(" ", "%20")
    return f"otpauth://totp/{encoded_issuer}:{encoded_email}?secret={secret}&issuer={encoded_issuer}&algorithm=SHA1&digits=6&period=30"


def verify_totp(secret: str, token: str, drift: int = 1) -> bool:
    if not secret or not token:
        return False
    if len(token) != 6 or not token.isdigit():
        return False
    try:
        decoded_secret = base64.b32decode(secret, casefold=True)
    except Exception:
        return False
    now = int(time.time())
    for offset in range(-drift, drift + 1):
        counter = now // 30 + offset
        expected = _generate_totp(decoded_secret, counter)
        if expected == token:
            return True
    return False


def _generate_totp(secret: bytes, counter: int) -> str:
    counter_bytes = struct.pack(">Q", counter)
    hmac_hash = hashlib.sha1(secret + counter_bytes).digest()
    offset = hmac_hash[-1] & 0x0F
    code = (
        (hmac_hash[offset] & 0x7F) << 24
        | (hmac_hash[offset + 1] & 0xFF) << 16
        | (hmac_hash[offset + 2] & 0xFF) << 8
        | (hmac_hash[offset + 3] & 0xFF)
    ) % 1000000
    return f"{code:06d}"
