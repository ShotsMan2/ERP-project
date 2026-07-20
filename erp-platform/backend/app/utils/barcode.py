from __future__ import annotations

import io
from pathlib import Path
from typing import Any


def generate_barcode(data: str, format: str = "code128", options: dict[str, Any] | None = None) -> bytes:
    try:
        from barcode import get_barcode_class
        from barcode.writer import ImageWriter
    except ImportError:
        raise ImportError("python-barcode is required. Install with: pip install python-barcode")

    opts = {
        "module_width": 0.2,
        "module_height": 15.0,
        "font_size": 10,
        "text_distance": 5.0,
        "quiet_zone": 6.0,
        "write_text": True,
        **(options or {}),
    }

    try:
        barcode_class = get_barcode_class(format)
    except Exception:
        barcode_class = get_barcode_class("code128")

    writer = ImageWriter()
    rv = barcode_class(data, writer=writer)
    buf = io.BytesIO()
    rv.write(buf, opts)
    buf.seek(0)
    return buf.read()


def generate_barcode_file(data: str, filepath: str | Path, format: str = "code128", options: dict[str, Any] | None = None) -> str:
    content = generate_barcode(data, format, options)
    path = Path(filepath)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(content)
    return str(path)


def generate_qr_code(data: str, box_size: int = 10, border: int = 4) -> bytes:
    try:
        import qrcode
    except ImportError:
        raise ImportError("qrcode is required. Install with: pip install qrcode")

    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=box_size,
        border=border,
    )
    qr.add_data(data)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    return buf.read()
