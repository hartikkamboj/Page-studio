import { test, expect } from '@playwright/test';

test.describe('Studio Editor', () => {
  test.beforeEach(async ({ page }) => {
    // Login as Publisher to have full access
    await page.goto('/login');
    await page.click('text=Charlie');
    await page.waitForURL('/');
  });

  test('can load studio and add a section', async ({ page }) => {
    await page.goto('/studio/homepage');
    
    // Wait for studio to load
    await expect(page.locator('h1').first()).toContainText('Mock Page (homepage)');
    
    // Open "Add Section" dropdown
    await page.click('button:has-text("+ Add Section")');
    
    // Add a Hero section
    await page.click('text=🎯 Hero');
    
    // Check if section was added to the list
    await expect(page.locator('ul[role="list"]')).toContainText('🎯 Hero');
    
    // Check if preview renders it
    await expect(page.locator('main#main-content h1').last()).toContainText('New Hero Section');
  });

  test('can edit section properties', async ({ page }) => {
    await page.goto('/studio/homepage');
    
    // Add a CTA section
    await page.click('button:has-text("+ Add Section")');
    await page.click('text=🚀 Call to Action');
    
    // Select it (it should be selected by default when added, but let's click it to be sure)
    await page.click('button:has-text("Call to Action")');
    
    // Edit heading
    const headingInput = page.locator('input[id="field-heading"]');
    await headingInput.fill('Updated CTA Heading');
    
    // Verify it updates in the preview
    await expect(page.locator('main#main-content h2').last()).toHaveText('Updated CTA Heading');
  });
});
