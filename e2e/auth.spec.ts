import { test, expect } from '@playwright/test';

test.describe('Authentication and RBAC', () => {
  test('redirects unauthenticated users to login', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('allows Viewer to login and see dashboard', async ({ page }) => {
    await page.goto('/login');
    
    // Click on Alice (viewer)
    await page.click('text=Alice');
    
    // Should be redirected to dashboard
    await expect(page).toHaveURL('/');
    await expect(page.locator('h1')).toContainText('Pages');
    
    // Viewer should see "Open in Studio (Locked)"
    const studioButton = page.locator('button:has-text("Open in Studio")').first();
    await expect(studioButton).toBeDisabled();
    await expect(studioButton).toHaveText('Open in Studio (Locked)');
  });

  test('allows Editor to login and see active studio links', async ({ page }) => {
    await page.goto('/login');
    
    // Click on Bob (editor)
    await page.click('text=Bob');
    
    // Should be redirected to dashboard
    await expect(page).toHaveURL('/');
    
    // Editor should see active studio link
    const studioLink = page.locator('a:has-text("Open in Studio")').first();
    await expect(studioLink).toBeVisible();
  });

  test('enforces RBAC via middleware', async ({ request }) => {
    // Viewer cannot POST to /api/publish
    // Manually pass the session cookie to avoid Playwright cookie jar flakiness in CI
    const publishAttempt = await request.post('/api/publish', {
      headers: {
        'Cookie': 'session=alice'
      },
      data: { slug: 'test', draft: {} }
    });
    
    expect(publishAttempt.status()).toBe(403);
  });
});
