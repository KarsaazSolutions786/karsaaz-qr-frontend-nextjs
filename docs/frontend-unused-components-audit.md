# Frontend Unused Components Audit (R8.1)

Generated: 2026-06-22

Heuristic: `.tsx` files under `components/` with zero static/dynamic import references elsewhere.
Review before deleting — some may be used via barrel re-exports or planned features.

Total scanned: 668 component files
Likely unused: 165 (110 removed as of 2026-06-22)

## Deletion log

| Batch  | Date       | Count | Notes                                                        |
| ------ | ---------- | ----- | ------------------------------------------------------------ |
| R9.1   | 2026-06-22 | 7     | Analytics widgets + BuyToolbar                               |
| R10.1  | 2026-06-22 | 25    | common, designer, legacy qrcodes                             |
| R10.2a | 2026-06-22 | 16    | account tabs, auth, billing, admin, layout, support          |
| R10.2b | 2026-06-22 | 19    | subscriptions, payment, domains, gateways, plans, lead-forms |

**Total removed:** 110 files. Re-run grep audit before next batch.
| R11.1 | 2026-06-22 | 43 | biolinks, public renderers, legacy qr/\*, seo, templates, wizard |

## Delete candidates (zero references found)

- `components/analytics/BaseReport.tsx`
- `components/analytics/DeviceBrowserCharts.tsx`
- `components/analytics/LocationMap.tsx`
- `components/analytics/RealtimeStatsWidget.tsx`
- `components/analytics/ReferrerTracker.tsx`
- `components/analytics/ScansPerDeviceBrand.tsx`
- `components/common/BusinessHoursModal.tsx`
- `components/common/BuyToolbar.tsx`
- `components/common/ConfigTranslator.tsx`
- `components/common/ContactForm.tsx`
- `components/common/DirectionAwareWrapper.tsx`
- `components/common/FieldTranslator.tsx`
- `components/common/FormDynamicRenderer.tsx`
- `components/common/ImageSelector.tsx`
- `components/common/InformationPopupModal.tsx`
- `components/common/LazyImage.tsx`
- `components/common/LeadFormSelector.tsx`
- `components/common/OfflineNotification.tsx`
- `components/common/ProtectedRoute.tsx`
- `components/common/SEO.tsx`
- `components/common/SessionTimeout.tsx`
- `components/common/ThemeToggle.tsx`
- `components/common/UsageProgress.tsx`
- `components/common/WelcomeModal.tsx`
- `components/designer/AIDesignGenerator.tsx`
- `components/designer/AdvancedDesigner.tsx`
- `components/designer/DesignerPreviewModal.tsx`
- `components/features/account/ActivityLogTab.tsx`
- `components/features/account/ApiTokensTab.tsx`
- `components/features/account/HostedAccountUpgrade.tsx`
- `components/features/account/NotificationsTab.tsx`
- `components/features/account/PieceXDemo.tsx`
- `components/features/account/ProfileTab.tsx`
- `components/features/account/SessionsTab.tsx`
- `components/features/admin/PageEditor.tsx`
- `components/features/auth/AuthGateModal.tsx`
- `components/features/auth/PasswordlessLoginButton.tsx`
- `components/features/billing/AccountBalance.tsx`
- `components/features/billing/BillingDetailsCollector.tsx`
- `components/features/billing/UpdatePaymentMethodDialog.tsx`
- `components/features/biolinks/BlockTemplateSelector.tsx`
- `components/features/biolinks/blocks/BlockFieldConfigModal.tsx`
- `components/features/biolinks/blocks/SortManager.tsx`
- `components/features/biolinks/blocks/dynamic/BaseDynamicBlock.tsx`
- `components/features/biolinks/blocks/dynamic/DynamicBlockManager.tsx`
- `components/features/domains/DomainAvailabilityModal.tsx`
- `components/features/domains/MyDomainsList.tsx`
- `components/features/lead-forms/questions/StarsQuestion.tsx`
- `components/features/payment-gateway/PaymentGatewayForm.tsx`
- `components/features/payment-gateway/PaymentGatewayList.tsx`
- `components/features/payment-processors/PayPalConfigForm.tsx`
- `components/features/payment-processors/forms/AlipayChina.tsx`
- `components/features/payment/AccountCreditCheckout.tsx`
- `components/features/payment/BillingAddressForm.tsx`
- `components/features/payment/PayPalButton.tsx`
- `components/features/payment/TaxSummary.tsx`
- `components/features/plans/PlanFeaturesEditor.tsx`
- `components/features/qrcodes/BulkUploadCSV.tsx`
- `components/features/qrcodes/NewQRFormAdapter.tsx`
- `components/features/qrcodes/QRCodeDownloader.tsx`
- `components/features/qrcodes/QRCodeForm.tsx`
- `components/features/qrcodes/QRCodeList.tsx`
- `components/features/qrcodes/QRCodeListSettingsModal.tsx`
- `components/features/qrcodes/types/biolinks/QuickStart.tsx`
- `components/features/qrcodes/types/biolinks/examples.tsx`
- `components/features/qrcodes/types/business-profile/BusinessProfileForm.tsx`
- `components/features/subscriptions/PaymentMethodsList.tsx`
- `components/features/subscriptions/PromoCodeForm.tsx`
- `components/features/subscriptions/StripeCheckoutForm.tsx`
- `components/features/subscriptions/StripeCustomerPortal.tsx`
- `components/features/subscriptions/StripeInvoices.tsx`
- `components/features/subscriptions/StripeSubscriptionManagement.tsx`
- `components/features/subscriptions/SubscriptionDetails.tsx`
- `components/features/support/TicketNotification.tsx`
- `components/layout/DashboardNotice.tsx`
- `components/layout/DemoLicenseExplainer.tsx`
- `components/layout/ScriptSupportLink.tsx`
- `components/public/QRPreviewContainer.tsx`
- `components/public/QRTypeRenderer.tsx`
- `components/public/lead-form/questions/ChoicesQuestion.tsx`
- `components/public/lead-form/questions/StarsQuestion.tsx`
- `components/qr/BackgroundFields.tsx`
- `components/qr/BulkActionsModal.tsx`
- `components/qr/ColorCustomizationDisabledMessage.tsx`
- `components/qr/CustomSizeInput.tsx`
- `components/qr/DPISettings.tsx`
- `components/qr/DownloadModal.tsx`
- `components/qr/FilterPresets.tsx`
- `components/qr/FolderBreadcrumb.tsx`
- `components/qr/FolderTree.tsx`
- `components/qr/GoogleAuthEnhanced.tsx`
- `components/qr/GoogleAuthModal.tsx`
- `components/qr/LogoFields.tsx`
- `components/qr/OutlineFields.tsx`
- `components/qr/PreviewModal.tsx`
- `components/qr/PrintButton.tsx`
- `components/qr/QRLinkSettingsModal.tsx`
- `components/qr/QualitySlider.tsx`
- `components/qr/Reports/QRReportDashboard.tsx`
- `components/qr/ScreenshotModal.tsx`
- `components/qr/ShareModal.tsx`
- `components/qr/ShareableLinkModal.tsx`
- `components/qr/SizePresets.tsx`
- `components/qr/StatsDateRangeModal.tsx`
- `components/qr/StickerFields.tsx`
- `components/seo/JsonLd.tsx`
- `components/subscription/FeatureGate.tsx`
- `components/templates/DeleteTemplateDialog.tsx`
- `components/templates/TemplatePreviewModal.tsx`
- `components/templates/UseTemplateButton.tsx`
- `components/ui/FillTypeFields.tsx`
- `components/ui/GradientPicker.tsx`
- `components/ui/accordion.tsx`
- `components/ui/alert.tsx`
- `components/ui/animated-badge.tsx`
- `components/ui/audio-recorder.tsx`
- `components/ui/avatar.tsx`
- `components/ui/breadcrumbs.tsx`
- `components/ui/canvas-text-renderer.tsx`
- `components/ui/captcha-input.tsx`
- `components/ui/code-editor.tsx`
- `components/ui/code-input.tsx`
- `components/ui/collapsible.tsx`
- `components/ui/color-palette.tsx`
- `components/ui/command.tsx`
- `components/ui/copy-button.tsx`
- `components/ui/custom-code-renderer.tsx`
- `components/ui/data-table.tsx`
- `components/ui/date-range-input.tsx`
- `components/ui/direction-toggle.tsx`
- `components/ui/disclaimer.tsx`
- `components/ui/drawer.tsx`
- `components/ui/dropdown-menu.tsx`
- `components/ui/enhanced-searchable-select.tsx`
- `components/ui/extended-license.tsx`
- `components/ui/file-image.tsx`
- `components/ui/file-upload.tsx`
- `components/ui/font-picker.tsx`
- `components/ui/form-comment.tsx`
- `components/ui/form-section.tsx`
- `components/ui/free-trial-button.tsx`
- `components/ui/logo-picker.tsx`
- `components/ui/menu-input.tsx`
- `components/ui/mobile-input.tsx`
- `components/ui/number-range-input.tsx`
- `components/ui/optimized-image.tsx`
- `components/ui/page-heading.tsx`
- `components/ui/pricing-table.tsx`
- `components/ui/qr-type-name.tsx`
- `components/ui/quantity-picker.tsx`
- `components/ui/range-input.tsx`
- `components/ui/relation-select.tsx`
- `components/ui/review-sites-input.tsx`
- `components/ui/scroll-area.tsx`
- `components/ui/searchable-select.tsx`
- `components/ui/separator.tsx`
- `components/ui/sr-only.tsx`
- `components/ui/status-badge.tsx`
- `components/ui/sticker-text-input.tsx`
- `components/ui/toaster.tsx`
- `components/ui/tooltip.tsx`
- `components/ui/value-display-input.tsx`
- `components/ui/vcard-list-input.tsx`
- `components/wizard/WizardProgress.tsx`
- `components/wizard/WizardStep.tsx`

## Decision

- **Keep for now**: files referenced only in tests or Storybook (none scanned here)
- **Safe to delete**: verify manually, then remove in a follow-up PR

## Verified decisions (manual spot-check)

| File                                       | Decision             | Reason                                                       |
| ------------------------------------------ | -------------------- | ------------------------------------------------------------ |
| `components/common/ProtectedRoute.tsx`     | **Keep**             | Auth handled via middleware; component may be legacy wrapper |
| `components/common/BuyToolbar.tsx`         | **Delete candidate** | Zero imports outside its own file                            |
| `components/analytics/BaseReport.tsx`      | **Delete candidate** | Superseded by page-level analytics components                |
| `components/designer/AdvancedDesigner.tsx` | **Keep**             | Potential future designer path; verify before delete         |

**Recommendation:** Do not bulk-delete the 165-item list. Triage in batches of ~10 with grep + build after each batch.

## R8.1 status

- Audit complete: `docs/frontend-unused-components-audit.md`
- Deletion deferred to follow-up PR (risk of false positives)
