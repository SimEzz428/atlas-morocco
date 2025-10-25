// src/data/cities.ts

export type City = {
  name: string;
  slug: string;
  lat: number;
  lon: number;
};

export const CITIES: City[] = [
  {
    name: "Marrakech",
    slug: "marrakech",
    lat: 31.6295,
    lon: -7.9811,
  },
  {
    name: "Casablanca",
    slug: "casablanca",
    lat: 33.5731,
    lon: -7.5898,
  },
  {
    name: "Fez",
    slug: "fes",
    lat: 34.0331,
    lon: -5.0003,
  },
  {
    name: "Tangier",
    slug: "tangier",
    lat: 35.7595,
    lon: -5.8340,
  },
  {
    name: "Agadir",
    slug: "agadir",
    lat: 30.4278,
    lon: -9.5981,
  },
  {
    name: "Essaouira",
    slug: "essaouira",
    lat: 31.51,
    lon: -9.77,
  },
];