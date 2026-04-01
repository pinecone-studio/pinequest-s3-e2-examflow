from __future__ import annotations

import os
from pathlib import Path


def load_dotenv(env_path: Path) -> None:
    if not env_path.exists():
        return

    for raw_line in env_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip())


ROOT = Path(__file__).resolve().parent
load_dotenv(ROOT / ".env")

HOST = os.environ.get("HOST", "127.0.0.1").strip() or "127.0.0.1"
PORT = int(os.environ.get("PORT", "8789"))
SHARED_TOKEN = os.environ.get("PDF_EXTRACTION_SERVICE_TOKEN", "").strip()
AZURE_ENDPOINT = os.environ.get("AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT", "").strip()
AZURE_KEY = os.environ.get("AZURE_DOCUMENT_INTELLIGENCE_KEY", "").strip()
AZURE_MODEL = os.environ.get("AZURE_DOCUMENT_INTELLIGENCE_MODEL", "prebuilt-layout").strip() or "prebuilt-layout"
TESSERACT_LANGUAGES = os.environ.get("TESSERACT_LANGUAGES", "eng+rus").strip() or "eng+rus"
