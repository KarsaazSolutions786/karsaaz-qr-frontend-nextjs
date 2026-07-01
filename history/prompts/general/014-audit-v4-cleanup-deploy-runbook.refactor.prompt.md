---
ID: '014'
TITLE: 'Audit v4 cleanup deploy runbook'
STAGE: refactor
DATE_ISO: '2026-06-22'
SURFACE: 'agent'
MODEL: 'claude-4.6-opus-high-thinking'
FEATURE: 'none'
BRANCH: 'production_v2'
USER: 'user'
COMMAND: 'make a complete do throw with this clean up the code and then we will deploy'
LABELS: ['audit', 'deploy', 'cleanup', 'runbook']
FILES_YAML:
  - 'karsaaz Qr React js/docs/DEPLOY-RUNBOOK-AUDIT-V4.md'
  - 'karsaaz Qr React js/app/(dashboard)/qrcodes/new/CreateQRCodePageClient.tsx'
  - 'karsaaz Qr React js/lib/validations/auth.ts'
TESTS_YAML:
  - 'npm run build (passed)'
  - 'php -l on 4 backend files (passed)'
---

## Prompt

make a complete do throw with this clean up the code and then we will deploy

## Response

Cleaned temp patch scripts, simplified QR create client export, auth trim polish, verified build and PHP syntax, wrote DEPLOY-RUNBOOK-AUDIT-V4.md. Ready for commit and deploy.

## Outcome

Audit v4 complete except F-18 CAPTCHA. Deploy backend then frontend.
