import { test, expect } from '@playwright/test';
import { CITIES } from '../../src/data/cities';
import { CITY_PHOTOS } from '../../src/data/cityImages';
import { encodeTrip } from '../../src/features/planner/utils/share';
import { expectImagesLoaded, trackConsoleErrors } from './helpers';

test('home page shows featured cities with working images and links', async ({ page }) => {
  const errors = trackConsoleErrors(page);
  await page.goto('/');
  await expect(page.getByRole('heading', { name: "Discover Morocco's Hidden Gems" })).toBeVisible();
  const explore = page.getByRole('link', { name: /^Explore / });
  await expect(explore).toHaveCount(6);
  await expectImagesLoaded(page);

  await page.getByRole('link', { name: 'Explore Fès' }).click();
  await expect(page).toHaveURL(/\/cities\/fes$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Fès' })).toBeVisible();
  expect(errors).toEqual([]);
});

test('cities page lists, searches, filters and sorts every city', async ({ page }) => {
  await page.goto('/cities');
  const cards = page.getByTestId('city-card-link');
  await expect(cards).toHaveCount(CITIES.length);
  await expectImagesLoaded(page);

  await page.getByLabel('Search cities').fill('fes');
  await expect(cards).toHaveCount(1);
  await expect(cards.first()).toContainText('Fès');

  await page.getByLabel('Search cities').fill('zzz');
  await expect(page.getByText('No Cities Found')).toBeVisible();
  await page.getByRole('button', { name: 'Clear Filters' }).click();
  await expect(cards).toHaveCount(CITIES.length);

  await page.getByRole('button', { name: /^Mountains & Desert/ }).click();
  await expect(cards).toHaveCount(2);

  await page.getByRole('button', { name: /^All Cities/ }).click();
  await page.getByLabel('Sort by:').selectOption('name');
  await expect(cards.first()).toContainText('Agadir');
});

for (const city of CITIES) {
  test(`city page works for ${city.name}`, async ({ page }) => {
    const errors = trackConsoleErrors(page);
    await page.goto(`/cities/${city.slug}`);
    await expect(page.getByRole('heading', { level: 1, name: city.name })).toBeVisible();
    await expect(page).toHaveTitle(new RegExp(city.name));

    // Overview: map shows one marker per place.
    await expect(page.locator('.leaflet-interactive')).toHaveCount(city.places.length);

    await page.getByTestId('tab-places').click();
    await expect(page).toHaveURL(new RegExp(`/cities/${city.slug}#places$`));
    await expect(page.getByTestId('place-card')).toHaveCount(city.places.length);

    await page.getByTestId('tab-itineraries').click();
    await expect(page.getByTestId('itinerary')).toHaveCount(city.itineraries.length);

    await page.getByTestId('tab-gallery').click();
    const photos = CITY_PHOTOS[city.slug] ?? [];
    await expect(page.getByTestId('gallery-grid').getByRole('button')).toHaveCount(photos.length);
    await expectImagesLoaded(page, '[data-testid="gallery-grid"] img');

    expect(errors).toEqual([]);
  });
}

test('places can be filtered by category', async ({ page }) => {
  const city = CITIES.find((c) => c.slug === 'marrakech')!;
  const gardens = city.places.filter((p) => p.category === 'garden').length;
  await page.goto('/cities/marrakech#places');
  await page.getByRole('button', { name: new RegExp(`^Garden \\(${gardens}\\)$`) }).click();
  await expect(page.getByTestId('place-card')).toHaveCount(gardens);
  await page.getByRole('button', { name: /^All \(/ }).click();
  await expect(page.getByTestId('place-card')).toHaveCount(city.places.length);
});

test('gallery lightbox opens, pages through photos and closes', async ({ page }) => {
  await page.goto('/cities/chefchaouen#gallery');
  await page.getByTestId('gallery-grid').getByRole('button').first().click();
  const lightbox = page.getByTestId('lightbox');
  await expect(lightbox).toBeVisible();
  await expect(lightbox).toContainText('1/12');
  await page.keyboard.press('ArrowRight');
  await expect(lightbox).toContainText('2/12');
  await page.getByRole('button', { name: 'Previous photo' }).click();
  await expect(lightbox).toContainText('1/12');
  await page.keyboard.press('Escape');
  await expect(lightbox).toBeHidden();
});

test('live weather and exchange rates render on the overview', async ({ page }) => {
  await page.goto('/cities/rabat');
  await expect(page.getByTestId('weather')).toBeVisible({ timeout: 15_000 });
  await expect(page.getByTestId('fx')).toContainText('MAD', { timeout: 15_000 });
});

test('explore map shows every city and links to its guide', async ({ page }) => {
  await page.goto('/explore');
  const markers = page.locator('.leaflet-marker-icon');
  await expect(markers).toHaveCount(CITIES.length);
  await expectImagesLoaded(page, '.leaflet-marker-icon');
  await page.getByRole('button', { name: 'Tangier' }).click();
  await page.getByRole('link', { name: 'Open city guide' }).click();
  await expect(page).toHaveURL(/\/cities\/tangier$/);
});

test('unknown pages and cities return the 404 page', async ({ page }) => {
  for (const path of ['/cities/atlantis', '/no-such-page']) {
    const res = await page.goto(path);
    expect(res?.status()).toBe(404);
    await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
  }
});

test('shared trip links render, including non-Latin characters', async ({ page }) => {
  const data = encodeTrip({
    title: 'Imperial cities in 2 days',
    duration: 2,
    items: [
      { name: 'Chouara Tannery', category: 'culture', city: 'fes', day: 1 },
      { name: 'Bab Mansour', category: 'architecture', city: 'meknes', day: 2 },
    ],
    stats: { totalDistance: '52.1km', totalTime: '1h 44min' },
  });
  await page.goto(`/share/trip/${data}`);
  await expect(page.getByRole('heading', { level: 1, name: 'Imperial cities in 2 days' })).toBeVisible();
  await expect(page.getByTestId('shared-day')).toHaveCount(2);
  await expect(page.getByText('Fès').first()).toBeVisible();

  await page.goto('/share/trip/not-valid-data');
  await expect(page.getByRole('heading', { name: 'Invalid Trip Link' })).toBeVisible();
});

test('public API routes', async ({ request }) => {
  const cities = await (await request.get('/api/cities')).json();
  expect(cities.cities).toHaveLength(CITIES.length);

  const fes = await request.get('/api/cities/fes');
  expect(fes.ok()).toBeTruthy();
  expect((await fes.json()).places.length).toBeGreaterThan(5);
  expect((await request.get('/api/cities/atlantis')).status()).toBe(404);

  expect((await request.get('/api/weather')).status()).toBe(400);
  expect((await request.get('/api/plans')).status()).toBe(401);
  expect((await request.get('/api/favorites')).status()).toBe(401);
  expect((await request.get('/api/me')).status()).toBe(401);
});

test('sign-in protected pages redirect and come back after sign-in', async ({ page }) => {
  await page.goto('/saved-plans');
  await expect(page).toHaveURL(/\/auth\/signin\?callbackUrl=%2Fsaved-plans/);
  await page.goto('/favorites');
  await expect(page.getByRole('heading', { name: 'Sign in to see your favorites' })).toBeVisible();
});
