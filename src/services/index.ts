/**
 * Services Barrel Export
 * Single import point for all API services.
 *
 * Usage:
 *   import { authService, qrCodeService, billingService } from '@/services';
 */

export { default as authService } from './auth.service';
export { default as accountService } from './account.service';
export { default as userService } from './user.service';

export { default as qrCodeService } from './qr.service';
export { default as folderService } from './folder.service';
export { default as templateService } from './template.service';

export { default as billingService } from './billing.service';
export { default as stripeService } from './stripe.service';
export { default as checkoutService } from './checkout.service';
export { default as transactionService } from './transaction.service';
export { default as commissionService } from './commission.service';

export { default as cloudStorageService } from './cloud-storage.service';

export { default as systemService } from './system.service';
export { default as domainService } from './domain.service';
export { default as roleService } from './role.service';
export { default as permissionService } from './permission.service';
export { default as pluginService } from './plugin.service';
export { default as paymentGatewayService } from './payment-gateway.service';
export { default as currencyService } from './currency.service';

export { default as contentService } from './content.service';
export { default as leadFormService } from './lead-form.service';
export { default as contactService } from './contact.service';
export { default as abuseReportService } from './abuse-report.service';

export { default as analyticsService } from './analytics.service';
export { default as utilityService } from './utility.service';

// CRM-integrated services (use external CRM at crmapp.karsaazebs.com)
export { default as supportService } from './support.service';
export { default as referralService } from './referral.service';

// Type exports
export type { LoginPayload, RegisterPayload, ResetPasswordPayload, Session } from './auth.service';
export type { User } from './user.service';
export type { QRCode, QRDesign, CreateQRCodePayload } from './qr.service';
export type { SubscriptionPlan, UserSubscription } from './billing.service';
export type { Transaction } from './transaction.service';
export type { Commission, Withdrawal } from './commission.service';
export type { CloudConnection, BackupJob, CloudProvider } from './cloud-storage.service';
export type { AbuseReport } from './abuse-report.service';
