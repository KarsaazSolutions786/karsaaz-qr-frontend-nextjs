---
ID: '010'
TITLE: 'Fix CSP errors from debug ingest'
STAGE: green
DATE_ISO: '2026-06-22'
SURFACE: 'agent'
MODEL: 'claude-4.6-opus-high-thinking'
FEATURE: 'none'
BRANCH: '004-system-optimization'
USER: 'user'
COMMAND: 'start resolving errors.txt console errors'
LABELS: ['csp', 'api-client', 'debug']
FILES_YAML:
  - 'karsaaz Qr React js/lib/api/client.ts'
TESTS_YAML:
  - 'manual: errors.txt root cause identified'
---

## Prompt

C:\Dev\karsaaz qr\errors.txt - start resolving these errors

## Response

Analyzed errors.txt (~24k lines): almost all CSP violations from leftover agent debug fetch to http://127.0.0.1:7388/ingest/... in lib/api/client.ts interceptors. Removed both debug blocks. APIs were succeeding (200 responses) but console flooded with Failed to fetch + React stack traces.

## Outcome

CSP noise eliminated from app code. If frame_ant.js extension errors persist, disable that Chrome extension during dev.
