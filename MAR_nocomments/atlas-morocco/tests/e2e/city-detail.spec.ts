import { test, expect } from '@playwright/test';

test.describe('City detail - Marrakech', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cities/marrakech');
  });

  test('Overview: minimap + weather/FX present or fallback', async ({ page }) => {
    await page.getByTestId('tab-overview').click();
    await expect(page.getByTestId('minimap')).toBeVisible();
    await expect(page.getByTestId('weather-card')).toBeVisible();
    await expect(page.getByTestId('fx-card')).toBeVisible();
  });

  test('Places: has add-to-plan', async ({ page }) => {
    await page.getByTestId('tab-places').click();
    const addButtons = page.locator('[data-testid="add-to-plan"]');
    const count = await addButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Gallery: renders grid without crash', async ({ page }) => {
    await page.getByTestId('tab-gallery').click();
    await expect(page.getByTestId('gallery-grid')).toBeVisible();
  });
});


