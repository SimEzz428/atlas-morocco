import { test, expect, type Page } from '@playwright/test';

async function expectNoHorizontalScroll(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow, 'page is wider than the screen').toBeLessThanOrEqual(1);
}

for (const path of ['/', '/cities', '/cities/marrakech', '/cities/marrakech#places', '/plan', '/auth/signin', '/favorites']) {
  test(`no horizontal scrolling on ${path}`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState('networkidle');
    await expectNoHorizontalScroll(page);
  });
}

test('mobile menu opens, navigates and closes', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Open menu' }).click();
  const menu = page.getByRole('navigation', { name: 'Mobile' });
  await expect(menu.getByRole('link', { name: 'Favorites' })).toBeVisible();
  await menu.getByRole('link', { name: 'Cities' }).click();
  await expect(page).toHaveURL(/\/cities$/);
  await expect(menu).toBeHidden();
});
