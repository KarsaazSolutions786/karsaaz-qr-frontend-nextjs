---
name: QR UI Bugs — Sticky Offsets and Pagination
description: Fix QR design studio sticky header offsets after stepper removal; confirm list view pagination works
type: general
stage: general
date: 2026-04-21
surface: agent
model: claude-sonnet-4-6
feature: none
branch: 004-system-optimization
user: ashhad
labels: ['ui-fix', 'sticky', 'pagination', 'qr-designer']
---

## Prompt

Fix QR design screen layout: sticky header and preview panel offsets wrong after StepperWizard header was removed.
Also confirm list view pagination is working.

## Response

**QRDesignStudio.tsx sticky offset fixes:**

- `sticky top-24 z-20` → `sticky top-14 z-20` (design studio header: was 96px, now 56px = dashboard header height only)
- `sticky top-52` → `sticky top-28` (right preview panel: was 208px, now 112px = header + tab bar)

**List view pagination:** Verified already correct — VirtualizedList removed, `disabled={isFetching}` not present on Pagination, `keepPreviousData` active, `setPage` correctly updates URL param.

## Files Modified

- `components/features/qrcodes/wizard/QRDesignStudio.tsx` — two sticky offset changes
