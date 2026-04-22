---
name: QR Type Selector — Extended Icon Colors
description: Add colored backgrounds and white-filter to gray-icon extended QR types so load-more section matches the bento section visually
type: general
stage: general
date: 2026-04-21
surface: agent
model: claude-sonnet-4-6
feature: none
branch: 004-system-optimization
user: ashhad
labels: ['ui-fix', 'qr-type-selector', 'icons', 'figma-match']
---

## Prompt

User showed two screenshots: Image #18 (top bento section — colorful icons) and Image #19 (bottom/load-more section — gray outline icons). Said "this section will also look like the above."

## Response

Added `whiteIcon?: boolean` field to `ICON_BG` type. Added 17 new entries for extended types (biolinks, business-review, website-builder, lead-form, app-download, google-review, resume, file-upload, event, calendar, email-dynamic, sms-dynamic, wifi, location, zoom, googlemaps, tiktok) — each with a colored gradient background matching its category and `whiteIcon: true`. Updated `TypeIcon` to apply `brightness-0 invert` CSS filter when `whiteIcon` is set, converting gray outline SVGs to white icons on colored backgrounds.

## Files Modified

- `components/features/qrcodes/QRCodeTypeSelector.tsx` — ICON_BG extended with 17 new colored entries + TypeIcon filter support
