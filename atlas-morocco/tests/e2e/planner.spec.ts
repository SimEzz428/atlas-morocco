import { test, expect } from '@playwright/test';
import { addPlaces, trackConsoleErrors } from './helpers';

test('build, reorder, optimize, share and clear a plan without an account', async ({ page }) => {
  const errors = trackConsoleErrors(page);

  // Deliberately added in a zig-zag order so optimizing has something to improve.
  await addPlaces(page, 'marrakech', ['Jardin Majorelle', 'Saadian Tombs', 'Medersa Ben Youssef', 'Menara Gardens']);

  // "In plan" state survives a reload because the plan lives in localStorage.
  await page.reload();
  const majorelle = page.getByTestId('place-card').filter({ hasText: 'Jardin Majorelle' });
  await expect(majorelle.getByTestId('add-to-plan')).toHaveText(/In plan/);

  // Toggling removes it again.
  await majorelle.getByTestId('add-to-plan').click();
  await expect(majorelle.getByTestId('add-to-plan')).toHaveText(/Add to Plan/);
  await majorelle.getByTestId('add-to-plan').click();

  await page.goto('/plan');
  const items = page.getByTestId('plan-item');
  await expect(items).toHaveCount(4);
  await expect(page.getByTestId('trip-stats')).toContainText('4');
  await expect(page.getByTestId('sync-status')).toContainText('Saved on this device');

  // Days: 4 places over 3 days -> 2/1/1; over 2 days -> 2/2.
  await expect(page.getByTestId('plan-day')).toHaveCount(3);
  await page.getByLabel('Duration (days)').fill('2');
  await expect(page.getByTestId('plan-day')).toHaveCount(2);
  await expect(page.getByTestId('plan-day').nth(0).getByTestId('plan-item')).toHaveCount(2);

  // Optimize reorders stops and then reports the route as optimized.
  const optimize = page.getByTestId('optimize-route');
  await expect(optimize).toBeEnabled();
  const before = await items.allTextContents();
  await optimize.click();
  await expect(optimize).toBeDisabled();
  await expect(optimize).toHaveText(/Route optimized/);
  expect(await items.allTextContents()).not.toEqual(before);

  // Dragging the first stop below the second swaps them.
  const firstName = (await items.first().locator('h4').textContent())!;
  await items.nth(1).scrollIntoViewIfNeeded();
  const handle = (await items.first().getByRole('button', { name: /Drag to reorder/ }).boundingBox())!;
  const target = (await items.nth(1).boundingBox())!;
  await page.mouse.move(handle.x + handle.width / 2, handle.y + handle.height / 2);
  await page.mouse.down();
  await page.mouse.move(handle.x + 5, handle.y + 20, { steps: 5 });
  await page.mouse.move(handle.x + 5, target.y + target.height / 2 + 10, { steps: 15 });
  await page.mouse.up();
  await expect(items.nth(1).locator('h4')).toHaveText(firstName);
  // dnd-kit swallows the click that immediately follows a drop; let the drop finish first.
  await page.waitForTimeout(300);

  // Remove a stop.
  await items.first().getByRole('button', { name: /^Remove / }).click();
  await expect(items).toHaveCount(3);

  // Share link opens a read-only itinerary.
  await page.getByTestId('share-trip').click();
  const shareUrl = await page.getByTestId('share-url').inputValue();
  expect(shareUrl).toMatch(/\/share\/trip\/[A-Za-z0-9_-]+$/);
  await page.keyboard.press('Escape');
  await page.goto(shareUrl);
  await expect(page.getByRole('heading', { level: 1, name: 'My Morocco Trip' })).toBeVisible();
  await expect(page.getByTestId('shared-day')).toHaveCount(2);

  // New plan empties the planner after confirmation.
  await page.goto('/plan');
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByTestId('plan-clear').click();
  await expect(page.getByText('Start Building Your Trip')).toBeVisible();

  expect(errors).toEqual([]);
});

test('adding a whole itinerary and saving while signed out prompts to sign in', async ({ page }) => {
  await page.goto('/cities/fes#itineraries');
  await page.getByTestId('itinerary').first().getByRole('button', { name: 'Add all' }).click();
  await page.goto('/plan');
  await expect(page.getByTestId('plan-item').first()).toBeVisible();
  await page.getByTestId('save-plan').click();
  await expect(page.getByText('Sign in to save your plan')).toBeVisible();
});
