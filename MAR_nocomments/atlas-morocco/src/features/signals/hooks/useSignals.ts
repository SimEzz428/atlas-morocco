"use client";

import { useEffect, useState } from "react";

type FxData = {
  rate: number;
  date: string;
};

type WeatherData = {
  current_temperature: number;
  wind_speed: number;
};

export function useSignals(lat: number, lon: number) {
  const [fx, setFx] = useState<FxData | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function doFetch() {
      try {
        const fxReq = fetch(`/api/signals/fx?base=USD&quote=MAD`);
        const weatherReq = fetch(`/api/signals/weather?lat=${lat}&lon=${lon}`);

        const [fxRes, weatherRes] = await Promise.all([fxReq, weatherReq]);

        const fxJson = await fxRes.json();
        const weatherJson = await weatherRes.json();

        if (!fxRes.ok || !weatherRes.ok) {
          throw new Error("Failed to fetch");
        }

        setFx({ rate: fxJson.rate, date: fxJson.date });
        setWeather({
          current_temperature: weatherJson.current_weather.temperature,
          wind_speed: weatherJson.current_weather.windspeed,
        });
      } catch (_) {
        setError("Failed to fetch");
      } finally {
        setLoading(false);
      }
    }

    doFetch();
  }, [lat, lon]);

  return { fx, weather, loading, error };
}