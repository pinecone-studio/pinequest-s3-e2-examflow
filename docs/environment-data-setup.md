# Environment Data Setup

## Goal

Keep feature development predictable:

- the whole team uses the same production data source
- local sandbox mode is removed from the normal setup
- local web and local API point to the same production backend by default

## Default workflow

This is the only setup the team should use day to day:

- `npm run dev:api`
- `npm run dev`

If everyone uses the same branch, the same login account, and the commands above, everyone sees the same production data.

### Web

```bash
npm run dev
```

The web app uses `apps/web/.env.local` and talks to the production GraphQL endpoint unless you intentionally change it.

### API

```bash
npm run dev:api
```

This starts Wrangler in `--remote --env production` mode, so local API behavior matches production instead of a preview sandbox.

## Optional PDF extraction service

If you want PDF import to run through a separate local service instead of browser-side fallback, start:

```bash
npm run dev:pdf-service
```

Then point the API at it in `apps/api/.dev.vars`:

```bash
PDF_EXTRACTION_SERVICE_URL=http://127.0.0.1:8788/extract
PDF_EXTRACTION_SERVICE_TOKEN=choose-a-shared-secret
```

Start the service with the same shared secret in its own shell:

```bash
PORT=8788
PDF_EXTRACTION_SERVICE_TOKEN=choose-a-shared-secret
npm run dev:pdf-service
```

This service is intentionally MVP-only:

- selectable text PDF: supported
- OCR / scanned PDF: not handled by the service
- when the service is not configured, the web app still falls back to client-side extraction

## Optional Python multi-engine PDF service

If you want a stronger local extraction pipeline with `PyMuPDF + pdfplumber + Azure DI hooks`, use the Python service scaffold:

```bash
python3 -m venv apps/pdf-extraction-python-service/.venv
source apps/pdf-extraction-python-service/.venv/bin/activate
pip install -r apps/pdf-extraction-python-service/requirements.txt
cp apps/pdf-extraction-python-service/.env.example apps/pdf-extraction-python-service/.env
npm run dev:pdf-service:python
```

Then point the API at it in `apps/api/.dev.vars`:

```bash
PDF_EXTRACTION_SERVICE_URL=http://127.0.0.1:8789/extract
PDF_EXTRACTION_SERVICE_TOKEN=pinequest-local-pdf-service-token
```

Optional Azure settings live in `apps/pdf-extraction-python-service/.env`:

```bash
AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT=https://<your-resource>.cognitiveservices.azure.com/
AZURE_DOCUMENT_INTELLIGENCE_KEY=<your-key>
AZURE_DOCUMENT_INTELLIGENCE_MODEL=prebuilt-layout
```

Notes:

- without Azure credentials, the Python service still works with local engines if installed
- scanned PDF OCR for the Python service also needs the system `tesseract` binary installed
  - macOS example: `brew install tesseract`
- without Python dependencies installed, keep using the Node service or browser fallback
- the API contract stays the same, so switching services is just changing `PDF_EXTRACTION_SERVICE_URL`

## Production database maintenance

When the schema changes, apply migrations to the production database:

```bash
npm run db:migrate:dev --workspace @pinequest/api
```

If you need to re-apply the baseline seed for the production database:

```bash
npm run db:seed:dev --workspace @pinequest/api
```

## Preview behavior

The team now treats production as the single source of truth.

- local web should use the production GraphQL endpoint
- local API should run with `--env production`
- preview data should not be relied on for day-to-day work

## Production deployment

The same Wrangler config file also contains the production environment.

- local API uses `--env production`
- production deploys use `--env production`

This keeps the team on one data source and avoids local/preview drift.

## R2 image uploads

The API now expects private R2 buckets for image-answer uploads:

- `pinequest-uploads` for production
- `pinequest-uploads-preview` for preview-only environments

Before using image upload locally or in preview, create those buckets in Cloudflare R2. The API stores only the R2 object key in D1, and the web app fetches the image back through authenticated API routes.
