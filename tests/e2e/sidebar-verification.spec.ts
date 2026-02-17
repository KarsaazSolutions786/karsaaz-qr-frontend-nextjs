/**
 * Sidebar Verification Test Suite
 * 
 * Tests all sidebar functionality including:
 * - Visual appearance (background, icons, layout)
 * - Expandable menu groups
 * - Hover states
 * - Active state navigation
 * - Icon rendering quality
 */

import { test, expect } from '@playwright/test';

test.describe('Sidebar Visual and Functional Tests', () => {

    test.beforeEach(async ({ page }) => {
        // Navigate to dashboard and wait for sidebar to load
        await page.goto('http://localhost:3000/dashboard');
        await page.waitForSelector('.sidebar-figma', { state: 'visible' });
    });

    test('sidebar has correct background and styling', async ({ page }) => {
        const sidebar = page.locator('.sidebar-figma');

        // Verify sidebar is visible
        await expect(sidebar).toBeVisible();

        // Check computed styles
        const backgroundColor = await sidebar.evaluate((el) =>
            window.getComputedStyle(el).backgroundColor
        );

        // #F5F5F5 converts to rgb(245, 245, 245)
        expect(backgroundColor).toBe('rgb(245, 245, 245)');

        // Verify no backdrop-filter is applied
        const backdropFilter = await sidebar.evaluate((el) =>
            window.getComputedStyle(el).backdropFilter
        );
        expect(backdropFilter).toBe('none');
    });

    test('navigation icons render as line-art', async ({ page }) => {
        // Get all navigation icon images
        const icons = page.locator('.sidebar-nav-icon');
        const iconCount = await icons.count();

        expect(iconCount).toBeGreaterThan(0);

        // Verify icons are visible and loaded
        for (let i = 0; i < iconCount; i++) {
            const icon = icons.nth(i);
            await expect(icon).toBeVisible();

            // Check src contains -line.svg or -white.svg
            const src = await icon.getAttribute('src');
            const isLineArt = src?.includes('-line.svg') || src?.includes('-white.svg');
            expect(isLineArt).toBeTruthy();
        }
    });

    test('active Home item has correct styling', async ({ page }) => {
        const homeItem = page.locator('.sidebar-nav-item--active').first();

        // Verify active class is applied
        await expect(homeItem).toBeVisible();

        // Check for white icon container
        const iconWrap = homeItem.locator('.sidebar-nav-icon-wrap--active');
        await expect(iconWrap).toBeVisible();

        const bgColor = await iconWrap.evaluate((el) =>
            window.getComputedStyle(el).backgroundColor
        );
        expect(bgColor).toBe('rgb(255, 255, 255)'); // white
    });

    test('expandable menu groups work correctly', async ({ page }) => {
        // Test Finance group
        const financeButton = page.locator('button:has-text("Finance")');
        await expect(financeButton).toBeVisible();

        // Initially, sub-items should not be visible
        const subItems = page.locator('.sidebar-sub-items');
        const initialCount = await subItems.count();

        // Click to expand
        await financeButton.click();

        // Wait for sub-items to appear
        await page.waitForTimeout(300); // Animation time

        // Verify sub-items are now visible
        const expandedSubItems = page.locator('.sidebar-sub-item');
        const visibleCount = await expandedSubItems.count();
        expect(visibleCount).toBeGreaterThan(0);

        // Verify chevron rotation
        const chevron = financeButton.locator('.sidebar-chevron');
        const hasOpenClass = await chevron.evaluate((el) =>
            el.classList.contains('sidebar-chevron--open')
        );
        expect(hasOpenClass).toBeTruthy();
    });

    test('hover states work on navigation items', async ({ page }) => {
        const existingQRLink = page.locator('a:has-text("Existing QR")');

        // Get initial background
        const initialBg = await existingQRLink.evaluate((el) =>
            window.getComputedStyle(el).backgroundColor
        );

        // Hover over the item
        await existingQRLink.hover();
        await page.waitForTimeout(100);

        // Background should change on hover
        const hoverBg = await existingQRLink.evaluate((el) =>
            window.getComputedStyle(el).backgroundColor
        );

        // Should have some purple tint on hover
        expect(hoverBg).not.toBe(initialBg);
    });

    test('logo components are properly rendered', async ({ page }) => {
        // Verify logo text is visible
        const logoText = page.locator('img[alt="Karsaaz"]');
        await expect(logoText).toBeVisible();

        // Verify QR badge is visible
        const qrBadge = page.locator('.sidebar-qr-badge');
        await expect(qrBadge).toBeVisible();

        // Verify collapse button is visible
        const collapseBtn = page.locator('.sidebar-collapse-btn');
        await expect(collapseBtn).toBeVisible();
    });

    test('app store badges are visible', async ({ page }) => {
        const badges = page.locator('.sidebar-badge');
        const badgeCount = await badges.count();

        // Should have 2 badges (Apple & Google Play)
        expect(badgeCount).toBe(2);

        for (let i = 0; i < badgeCount; i++) {
            await expect(badges.nth(i)).toBeVisible();
        }
    });

    test('logout button has correct styling', async ({ page }) => {
        const logoutBtn = page.locator('.sidebar-logout-btn');
        await expect(logoutBtn).toBeVisible();

        // Verify red logout icon is present
        const logoutIcon = logoutBtn.locator('img[src*="logout-red"]');
        await expect(logoutIcon.first()).toBeVisible();
    });

    test('capture sidebar screenshot for comparison', async ({ page }) => {
        const sidebar = page.locator('.sidebar-figma');

        // Take screenshot of sidebar
        await sidebar.screenshot({
            path: 'C:\\Users\\PC\\.gemini\\antigravity\\brain\\a1c1366b-6931-4a54-a636-e161d5ab46a9\\sidebar_current.png'
        });
    });

    test('sidebar maintains layout on scroll', async ({ page }) => {
        const nav = page.locator('.sidebar-nav');

        // If there are many items, test scrolling
        const navHeight = await nav.evaluate((el) => el.scrollHeight);
        const viewHeight = await nav.evaluate((el) => el.clientHeight);

        if (navHeight > viewHeight) {
            // Scroll to bottom
            await nav.evaluate((el) => el.scrollTop = el.scrollHeight);
            await page.waitForTimeout(200);

            // Verify sidebar is still visible and styled correctly
            const sidebar = page.locator('.sidebar-figma');
            await expect(sidebar).toBeVisible();
        }
    });
});
