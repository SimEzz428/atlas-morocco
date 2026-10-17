import { test, expect } from '@playwright/test';
import { addPlaces, savedPlans, signIn, signUp, uniqueEmail, trackConsoleErrors } from './helpers';

test('sign up, sign out, bad password, sign in again', async ({ page }) => {
  const email = uniqueEmail();
  await signUp(page, email);

  // Registering the same email again is rejected instead of pretending it worked.
  const res = await page.request.post('/api/auth/register', { data: { email, password: 'secret123', name: 'Dup' } });
  expect(res.status()).toBe(409);

  await page.getByRole('button', { name: 'Account menu' }).click();
  await page.getByRole('menuitem', { name: 'Sign Out' }).click();
  await expect(page.getByRole('link', { name: 'Sign In' })).toBeVisible();

  await signIn(page, email, 'wrong-password');
  await expect(page.getByRole('alert').filter({ hasText: /\S/ })).toContainText('Incorrect email or password');

  await signIn(page, email.toUpperCase(), 'secret123', '/profile');
  await expect(page).toHaveURL(/\/profile$/);
  await expect(page.getByText(email).first()).toBeVisible();
});

test('signup form shows server errors', async ({ page }) => {
  const email = uniqueEmail('dup');
  await page.request.post('/api/auth/register', { data: { email, password: 'secret123' } });
  await page.goto('/auth/signup');
  await page.getByLabel('Full Name').fill('Someone');
  await page.getByLabel('Email Address').fill(email);
  await page.getByLabel('Password').fill('secret123');
  await page.getByRole('button', { name: 'Create Account' }).click();
  await expect(page.getByRole('alert').filter({ hasText: /\S/ })).toContainText('already exists');
});

test('signed-in plans auto-save to one plan, reopen, update and delete', async ({ page }) => {
  const errors = trackConsoleErrors(page);
  await signUp(page, uniqueEmail());

  await addPlaces(page, 'essaouira', ['Skala de la Ville', 'Essaouira Beach']);
  await addPlaces(page, 'marrakech', ['Jemaa el-Fnaa']);
  await page.goto('/plan');
  await expect(page.getByTestId('sync-status')).toContainText('saved to your account', { timeout: 10_000 });

  // Several edits in a row must keep updating the same saved plan, not create new ones.
  await page.getByLabel('Trip Title').fill('Coast and Red City');
  await page.getByLabel('Duration (days)').fill('2');
  await expect.poll(async () => (await savedPlans(page.request)).map((p) => p.title), { timeout: 10_000 }).toEqual(['Coast and Red City']);
  const [saved] = await savedPlans(page.request);
  expect(saved!.items).toHaveLength(3);
  expect(Math.max(...saved!.items.map((i) => i.day))).toBe(2);

  await page.getByTestId('save-plan').click();
  await expect(page.getByText('Plan saved to your account')).toBeVisible();
  expect(await savedPlans(page.request)).toHaveLength(1);

  // A new plan becomes a second saved plan.
  page.once('dialog', (d) => d.accept());
  await page.getByTestId('plan-clear').click();
  await addPlaces(page, 'tangier', ['Cap Spartel']);
  await expect.poll(async () => (await savedPlans(page.request)).length, { timeout: 10_000 }).toBe(2);

  await page.goto('/saved-plans');
  const cards = page.getByTestId('saved-plan');
  await expect(cards).toHaveCount(2);
  await cards.filter({ hasText: 'Coast and Red City' }).getByTestId('open-plan').click();
  await expect(page).toHaveURL(/\/plan$/);
  await expect(page.getByLabel('Trip Title')).toHaveValue('Coast and Red City');
  await expect(page.getByTestId('plan-item')).toHaveCount(3);
  await expect(page.getByTestId('plan-day')).toHaveCount(2);

  await page.goto('/saved-plans');
  page.once('dialog', (d) => d.accept());
  await cards.filter({ hasText: 'Coast and Red City' }).getByRole('button', { name: /^Delete / }).click();
  await expect(cards).toHaveCount(1);
  expect(await savedPlans(page.request)).toHaveLength(1);

  await page.goto('/profile');
  await expect(page.getByTestId('profile-stats')).toContainText('Saved plans1');
  expect(errors).toEqual([]);
});

test('favorites can be added from a city page and removed from the list', async ({ page }) => {
  await signUp(page, uniqueEmail());
  await page.goto('/cities/chefchaouen');
  const heart = page.getByTestId('favorite-toggle');
  await expect(heart).toBeEnabled();
  // The heart flips optimistically; wait for the save itself before reloading.
  const saved = page.waitForResponse((r) => r.url().endsWith('/api/favorites') && r.request().method() === 'POST');
  await heart.click();
  await expect(heart).toHaveAttribute('aria-pressed', 'true');
  expect((await saved).ok()).toBeTruthy();

  await page.reload();
  await expect(page.getByTestId('favorite-toggle')).toHaveAttribute('aria-pressed', 'true');

  await page.goto('/favorites');
  await expect(page.getByTestId('favorite-card')).toHaveCount(1);
  await page.getByRole('button', { name: 'Remove Chefchaouen from favorites' }).click();
  await expect(page.getByText('No Favorite Cities Yet')).toBeVisible();
});

test("users cannot modify or delete each other's plans", async ({ browser }) => {
  const alice = await browser.newContext();
  const bob = await browser.newContext();
  const alicePage = await alice.newPage();
  const bobPage = await bob.newPage();
  await signUp(alicePage, uniqueEmail('alice'));
  await signUp(bobPage, uniqueEmail('bob'));

  const item = { id: 'fes:Bab Bou Jeloud', name: 'Bab Bou Jeloud', city: 'fes', day: 1, lat: 34.0617, lon: -4.984, category: 'architecture' };
  const created = await (await alicePage.request.post('/api/plans', { data: { title: 'Alice trip', items: [item] } })).json();
  const aliceId = created.tripPlan.id as string;

  // Bob "updating" Alice's id creates his own plan instead of overwriting hers.
  const hijack = await (await bobPage.request.post('/api/plans', { data: { id: aliceId, title: 'Hacked', items: [item] } })).json();
  expect(hijack.tripPlan.id).not.toBe(aliceId);
  expect((await bobPage.request.delete(`/api/plans?planId=${aliceId}`)).status()).toBe(404);

  const alicePlans = await savedPlans(alicePage.request);
  expect(alicePlans.map((p) => p.title)).toEqual(['Alice trip']);

  // Malformed input is rejected.
  expect((await alicePage.request.post('/api/plans', { data: { title: 'x', items: 'nope' } })).status()).toBe(400);
  expect((await alicePage.request.post('/api/favorites', { data: { citySlug: 'atlantis' } })).status()).toBe(400);

  await alice.close();
  await bob.close();
});
