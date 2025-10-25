import { test, expect, request } from '@playwright/test';

test('APIs return OK and expected shapes', async ({ baseURL }) => {
  const api = await request.newContext();

  const citiesRes = await api.get(`${baseURL}/api/cities`);
  expect(citiesRes.ok()).toBeTruthy();
  const cities = await citiesRes.json();
  expect(cities).toHaveProperty('cities');
  expect(Array.isArray(cities.cities)).toBeTruthy();

  const cityRes = await api.get(`${baseURL}/api/cities/marrakech`);
  expect(cityRes.ok()).toBeTruthy();
  const city = await cityRes.json();
  expect(city).toHaveProperty('city');
  expect(city).toHaveProperty('places');

  const fxRes = await api.get(`${baseURL}/api/signals/fx?base=USD&quote=MAD`);
  expect(fxRes.ok()).toBeTruthy();
  const fx = await fxRes.json();
  expect(fx).toHaveProperty('rate');

  const wxRes = await api.get(`${baseURL}/api/signals/weather?lat=31.6295&lon=-7.9811`);
  expect(wxRes.ok()).toBeTruthy();
  const wx = await wxRes.json();
  expect(wx).toHaveProperty('current_weather');

  const unRes = await api.get(`${baseURL}/api/unsplash?q=marrakech%20morocco&per_page=1`);
  expect(unRes.ok()).toBeTruthy();
  const un = await unRes.json();
  expect(un).toHaveProperty('images');
});


