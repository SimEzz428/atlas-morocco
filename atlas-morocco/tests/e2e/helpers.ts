import { expect, type Page, type APIRequestContext } from '@playwright/test';

export function uniqueEmail(prefix = 'e2e') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;
}

export async function signUp(page: Page, email: string, password = 'secret123', name = 'Test Traveler') {
  await page.goto('/auth/signup');
  await page.getByLabel('Full Name').fill(name);
  await page.getByLabel('Email Address').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Create Account' }).click();
  await expect(page).toHaveURL(/\/plan$/);
  await expect(page.getByRole('button', { name: 'Account menu' })).toBeVisible();
}

export async function signIn(page: Page, email: string, password = 'secret123', callbackUrl?: string) {
  await page.goto(callbackUrl ? `/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}` : '/auth/signin');
  await page.getByLabel('Email address').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();
}

// Adds places from a city's Places tab by name.
export async function addPlaces(page: Page, citySlug: string, names: string[]) {
  await page.goto(`/cities/${citySlug}#places`);
  await expect(page.getByTestId('places-panel')).toBeVisible();
  for (const name of names) {
    const card = page.getByTestId('place-card').filter({ has: page.getByRole('heading', { name, exact: true }) });
    await card.getByTestId('add-to-plan').click();
    await expect(card.getByTestId('add-to-plan')).toHaveText(/In plan/);
  }
}

export async function savedPlans(request: APIRequestContext) {
  const res = await request.get('/api/plans');
  expect(res.ok()).toBeTruthy();
  return (await res.json()).plans as { id: string; title: string; items: { name: string; day: number }[] }[];
}

// Collects console errors, ignoring third-party noise we don't control.
export function trackConsoleErrors(page: Page) {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() !== 'error') return;
    const text = msg.text();
    // NextAuth logs CLIENT_FETCH_ERROR when a navigation aborts its in-flight session request.
    if (/tile\.openstreetmap\.org|Failed to load resource: net::ERR_|ERR_ABORTED|CLIENT_FETCH_ERROR/.test(text)) return;
    errors.push(text);
  });
  page.on('pageerror', (err) => errors.push(err.message));
  return errors;
}

export async function expectImagesLoaded(page: Page, selector = 'img') {
  await page.waitForLoadState('networkidle');
  const broken = await page.$$eval(selector, (imgs) =>
    (imgs as HTMLImageElement[])
      .filter((img) => img.loading !== 'lazy' || img.getBoundingClientRect().top < window.innerHeight)
      .filter((img) => img.complete && img.naturalWidth === 0)
      .map((img) => img.currentSrc || img.src)
  );
  expect(broken, `broken images: ${broken.join(', ')}`).toEqual([]);
}
