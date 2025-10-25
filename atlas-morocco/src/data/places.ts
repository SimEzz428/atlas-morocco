// src/data/places.ts
export type Poi = {
  id: string;
  city: "marrakech" | "fes" | "essaouira";
  name: string;
  lat: number;
  lon: number;
  category: "architecture" | "market" | "museum" | "food" | "nature" | "view";
  blurb?: string;
};

export const PLACES: Poi[] = [
  // MARRAKECH
  {
    id: "jemaa-el-fnaa",
    city: "marrakech",
    name: "Jemaa el-Fnaa",
    lat: 31.6258,
    lon: -7.9891,
    category: "market",
    blurb: "The beating heart of Marrakech — square, stalls, performers.",
  },
  {
    id: "jardin-majorelle",
    city: "marrakech",
    name: "Jardin Majorelle",
    lat: 31.5429,
    lon: -7.8414,
    category: "nature",
    blurb: "YSL’s cobalt-blue oasis with exotic plants and calm paths.",
  },
  {
    id: "bahia-palace",
    city: "marrakech",
    name: "Bahia Palace",
    lat: 31.6203,
    lon: -7.9812,
    category: "architecture",
    blurb: "19th-century palace with stunning courtyards and zellige.",
  },

  // FES
  {
    id: "fes-medina",
    city: "fes",
    name: "Fes el-Bali (Medina)",
    lat: 34.0668,
    lon: -4.9735,
    category: "market",
    blurb: "UNESCO-listed medieval medina, car-free maze of souks.",
  },
  {
    id: "chouara-tannery",
    city: "fes",
    name: "Chouara Tannery",
    lat: 34.0662,
    lon: -4.9739,
    category: "view",
    blurb: "Iconic dye pits. Best seen from leather shops’ terraces.",
  },
  {
    id: "bou-inania",
    city: "fes",
    name: "Bou Inania Madrasa",
    lat: 34.0628,
    lon: -4.9815,
    category: "architecture",
    blurb: "Masterpiece of Marinid architecture, rare madrasa you can enter.",
  },

  // ESSAOUIRA
  {
    id: "skala-de-la-ville",
    city: "essaouira",
    name: "Skala de la Ville",
    lat: 31.5133,
    lon: -9.7709,
    category: "view",
    blurb: "Sea bastion with Atlantic views and cannons along the ramparts.",
  },
  {
    id: "essaouira-port",
    city: "essaouira",
    name: "Old Port",
    lat: 31.5109,
    lon: -9.7702,
    category: "food",
    blurb: "Blue boats, fresh grills — casual seafood by the docks.",
  },
  {
    id: "medina-essaouira",
    city: "essaouira",
    name: "Essaouira Medina",
    lat: 31.5143,
    lon: -9.7696,
    category: "market",
    blurb: "White-and-blue lanes, artisan woodwork, laid-back vibe.",
  },
];

export function getCityPlaces(slug: Poi["city"]) {
  return PLACES.filter(p => p.city === slug);
}