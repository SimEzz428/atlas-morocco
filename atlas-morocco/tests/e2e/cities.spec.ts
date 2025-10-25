import { test, expect } from '@playwright/test';

test('Cities page lists cities and Marrakech page loads', async ({ page }) => {
  await page.goto('/cities');
  const cards = page.locator('[data-testid="city-card-link"]');
  const count = await cards.count();
  expect(count).toBeGreaterThan(2);

  const marrakech = cards.filter({ hasText: /Marrakech/i }).first();
  await marrakech.click();
  await expect(page).toHaveURL(/\/cities\/marrakech/);
  await expect(page).toHaveTitle(/Marrakech|Atlas/i);
});


