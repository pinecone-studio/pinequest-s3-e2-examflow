# Python PDF Extraction Service

This service is an optional local extraction engine for PineQuest PDF import.

## Intended role

- classify PDF shape
- use `PyMuPDF` for text-first extraction
- enrich with `pdfplumber` for table/layout blocks
- optionally use Azure Document Intelligence for harder layouts
- return a normalized structured document that the app parser can consume

## Local setup

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python3 server.py
```

Default URL:

```bash
http://127.0.0.1:8789/extract
```

## Environment

- `PDF_EXTRACTION_SERVICE_TOKEN`: shared bearer token expected by the API
- `AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT`: optional Azure endpoint
- `AZURE_DOCUMENT_INTELLIGENCE_KEY`: optional Azure key
- `AZURE_DOCUMENT_INTELLIGENCE_MODEL`: defaults to `prebuilt-layout`
- `TESSERACT_LANGUAGES`: defaults to `eng+rus`

## Current limits

- OCR hook is scaffolded but not fully wired to page rasterization yet
- Azure is optional and only used when credentials + SDK are available
- the service starts even if optional libraries are missing, but extraction quality will be reduced
