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
    
    // Wait for studio to load by checking if the title is visible
    await expect(page.locator('h1').first()).toBeVisible();
    
    // Open "Add Section" dropdown
    await page.click('button:has-text("+ Add Section")');
    
    // Wait for the dropdown menu to mount and become visible
    await expect(page.getByRole('menuitem', { name: /Hero/ })).toBeVisible();
    
    // Add a Hero section using keyboard navigation (Base UI dropdowns are modal and can intercept mouse events)
    await page.keyboard.press('ArrowDown'); // Focus first item (Hero)
    await page.keyboard.press('Enter');     // Select it
    
    // Check if section was added to the list
    await expect(page.locator('ul[role="list"]')).toContainText('🎯 Hero');
    
    // Check if preview renders it
    await expect(page.locator('main#main-content h1').last()).toContainText('New Hero Section');
  });

  test('can edit section properties', async ({ page }) => {
    await page.goto('/studio/homepage');
    
    // Add a CTA section
    await page.click('button:has-text("+ Add Section")');
    // Wait for menu
    await expect(page.getByRole('menuitem', { name: /Call to Action/ })).toBeVisible();
    
    await page.keyboard.press('ArrowDown'); // Hero
    await page.keyboard.press('ArrowDown'); // Feature Grid
    await page.keyboard.press('ArrowDown'); // Testimonial
    await page.keyboard.press('ArrowDown'); // CTA
    await page.keyboard.press('Enter');
    
    // Select it (it should be selected by default when added, but let's click it to be sure)
    await page.locator('button:has-text("Call to Action")').last().click();
    
    // Edit heading
    const headingInput = page.locator('input[id="field-heading"]');
    await headingInput.fill('Updated CTA Heading');
    
    // Verify it updates in the preview
    await expect(page.locator('main#main-content h2').last()).toHaveText('Updated CTA Heading');
  });
});
