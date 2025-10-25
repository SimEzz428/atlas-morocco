import { test, expect } from '@playwright/test';

test('Home loads without console errors and CTA navigates', async ({ page }) => {
  const messages: string[] = [];
  page.on('console', (msg) => {
    if (['error'].includes(msg.type())) messages.push(msg.text());
  });

  await page.goto('/');
  await expect(page).toHaveURL(/\/?$/);
  // Allow known 404 for hero-pattern.svg, fail on other errors
  const unexpected = messages.filter(m => !/hero-pattern\.svg.*404/i.test(m));
  expect(unexpected, unexpected.join('\n')).toHaveLength(0);

  // Click Explore Cities CTA
  const cta = page.getByRole('link', { name: /Explore Cities/i });
  await cta.click();
  await expect(page).toHaveURL(/\/cities/);
});


