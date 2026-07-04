import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

import fs from 'fs';

test.describe('Accessibility', () => {
  let allViolations: any[] = [];

  test.afterAll(() => {
    // Write a11y-report.json artefact as required
    fs.writeFileSync(
      'a11y-report.json',
      JSON.stringify({ violations: allViolations }, null, 2)
    );
  });

  test('login page should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/login');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    allViolations = allViolations.concat(accessibilityScanResults.violations);
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('dashboard should not have any automatically detectable accessibility issues', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.click('text=Charlie');
    await page.waitForURL('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    allViolations = allViolations.concat(accessibilityScanResults.violations);
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
