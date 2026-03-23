# pinequest-s3-e2-team-9

Monorepo structure:

- `apps/web`: Next.js application
- `apps/api`: Express backend application
- `packages/ui`: shared UI package

## CI/CD

This repository now includes GitHub Actions workflows for CI and CD:

- `/.github/workflows/ci.yml`
  - Runs on pull requests and pushes to `main` and `develop`
  - Installs dependencies with `npm ci`
  - Runs lint, build, and any workspace tests that exist
- `/.github/workflows/deploy.yml`
  - Runs on pushes to `main` and on manual dispatch
  - Re-validates the project with lint and build
  - Triggers a deployment webhook when `DEPLOY_WEBHOOK_URL` is configured

### Required GitHub configuration

Add this repository secret in GitHub before using CD:

- `DEPLOY_WEBHOOK_URL`: deploy endpoint from Vercel, Render, Railway, your VPS, or another hosting provider

### Suggested branch flow

- `develop`: integration branch for ongoing work
- `main`: production branch that triggers deploys
