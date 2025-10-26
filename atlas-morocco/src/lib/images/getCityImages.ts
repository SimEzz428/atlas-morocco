export interface CityImage {
  url: string;
  alt: string;
  width: number;
  height: number;
}

import { readdir } from 'fs/promises';
import path from 'path';

// Unsplash API configuration
const UNSPLASH_API_KEY =
  process.env.UNSPLASH_ACCESS_KEY || process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || '';
const UNSPLASH_BASE_URL = 'https://api.unsplash.com';

// City-specific search queries for better image results
const CITY_SEARCH_QUERIES: Record<string, string[]> = {
  marrakech: [
    'Marrakech Morocco Jemaa el-Fnaa',
    'Marrakech Koutoubia Mosque',
    'Marrakech Bahia Palace',
    'Marrakech Majorelle Garden',
    'Marrakech souk market',
    'Marrakech medina',
    'Marrakech Atlas Mountains',
    'Marrakech traditional architecture',
    'Marrakech riad courtyard',
    'Marrakech desert gateway'
  ],
  rabat: [
    'Rabat Morocco Hassan Tower',
    'Rabat Morocco Kasbah Oudayas',
    'Rabat Morocco Royal Palace',
    'Rabat Morocco Chellah ruins',
    'Rabat Morocco medina',
    'Rabat Morocco Atlantic coast',
    'Rabat Morocco traditional architecture',
    'Rabat Morocco Andalusian gardens',
    'Rabat Morocco Mausoleum',
    'Rabat Morocco Bouregreg river'
  ],
  fes: [
    'Fes Morocco medina',
    'Fes Morocco Al Quaraouiyine University',
    'Fes Morocco Bou Inania Madrasa',
    'Fes Morocco Chouara tanneries',
    'Fes Morocco traditional crafts',
    'Fes Morocco blue gate',
    'Fes Morocco souk market',
    'Fes Morocco riad architecture',
    'Fes Morocco pottery',
    'Fes Morocco leather goods'
  ],
  casablanca: [
    'Casablanca Morocco Hassan II Mosque',
    'Casablanca Morocco Corniche',
    'Casablanca Morocco Art Deco',
    'Casablanca Morocco medina',
    'Casablanca Morocco Atlantic Ocean',
    'Casablanca Morocco modern architecture',
    'Casablanca Morocco Habous quarter',
    'Casablanca Morocco Mohammed V Square',
    'Casablanca Morocco Ain Diab',
    'Casablanca Morocco traditional market'
  ],
  tangier: [
    'Tangier Morocco medina',
    'Tangier Morocco Strait of Gibraltar',
    'Tangier Morocco Kasbah',
    'Tangier Morocco Atlantic Ocean',
    'Tangier Morocco Mediterranean Sea',
    'Tangier Morocco traditional architecture',
    'Tangier Morocco Grand Socco',
    'Tangier Morocco Petit Socco',
    'Tangier Morocco Hercules Caves',
    'Tangier Morocco Cap Spartel'
  ],
  chefchaouen: [
    'Chefchaouen Morocco blue city',
    'Chefchaouen Morocco blue walls',
    'Chefchaouen Morocco medina',
    'Chefchaouen Morocco Rif Mountains',
    'Chefchaouen Morocco traditional architecture',
    'Chefchaouen Morocco blue doors',
    'Chefchaouen Morocco street art',
    'Chefchaouen Morocco local life',
    'Chefchaouen Morocco mountain views',
    'Chefchaouen Morocco photography'
  ],
  essaouira: [
    'Essaouira Morocco medina',
    'Essaouira Morocco Atlantic coast',
    'Essaouira Morocco fishing port',
    'Essaouira Morocco Skala du Port',
    'Essaouira Morocco traditional architecture',
    'Essaouira Morocco blue boats',
    'Essaouira Morocco fortifications',
    'Essaouira Morocco windsurfing',
    'Essaouira Morocco seafood',
    'Essaouira Morocco sunset'
  ],
  agadir: [
    'Agadir Morocco beach',
    'Agadir Morocco Atlantic Ocean',
    'Agadir Morocco Kasbah ruins',
    'Agadir Morocco marina',
    'Agadir Morocco modern city',
    'Agadir Morocco souk market',
    'Agadir Morocco traditional architecture',
    'Agadir Morocco fishing port',
    'Agadir Morocco palm trees',
    'Agadir Morocco sunset'
  ],
  meknes: [
    'Meknes Morocco medina',
    'Meknes Morocco Bab Mansour',
    'Meknes Morocco Royal Palace',
    'Meknes Morocco traditional architecture',
    'Meknes Morocco souk market',
    'Meknes Morocco Volubilis ruins',
    'Meknes Morocco Moulay Ismail',
    'Meknes Morocco Agdal Basin',
    'Meknes Morocco Place el-Hedim',
    'Meknes Morocco historic gates'
  ],
  ouarzazate: [
    'Ouarzazate Morocco kasbah',
    'Ouarzazate Ait Ben Haddou',
    'Ouarzazate Atlas Studios',
    'Ouarzazate Taourirt Kasbah',
    'Ouarzazate desert fortress',
    'Ouarzazate film studios',
    'Ouarzazate Glaoui Palace',
    'Ouarzazate desert architecture',
    'Ouarzazate movie location',
    'Ouarzazate historic kasbah'
  ]
};

// Fallback images for each city (local curated images)
const FALLBACK_IMAGES: Record<string, CityImage[]> = {
  marrakech: [
    { url: '/cities/marrakech/gallery/image-1.svg', alt: 'Marrakech: Jemaa el-Fnaa Square', width: 400, height: 300 },
    { url: '/cities/marrakech/gallery/image-2.svg', alt: 'Marrakech: Koutoubia Mosque', width: 400, height: 300 },
    { url: '/cities/marrakech/gallery/image-3.svg', alt: 'Marrakech: Bahia Palace', width: 400, height: 300 },
    { url: '/cities/marrakech/gallery/image-4.svg', alt: 'Marrakech: Majorelle Garden', width: 400, height: 300 },
    { url: '/cities/marrakech/gallery/image-5.svg', alt: 'Marrakech: Traditional Souk', width: 400, height: 300 },
    { url: '/cities/marrakech/gallery/image-6.svg', alt: 'Marrakech: Medina Architecture', width: 400, height: 300 },
    { url: '/cities/marrakech/gallery/image-7.svg', alt: 'Marrakech: Atlas Mountains', width: 400, height: 300 },
    { url: '/cities/marrakech/gallery/image-8.svg', alt: 'Marrakech: Riad Courtyard', width: 400, height: 300 },
    { url: '/cities/marrakech/gallery/image-9.svg', alt: 'Marrakech: Traditional Crafts', width: 400, height: 300 },
    { url: '/cities/marrakech/gallery/image-10.svg', alt: 'Marrakech: Desert Gateway', width: 400, height: 300 },
    { url: '/cities/marrakech/gallery/image-11.svg', alt: 'Marrakech: Sunset Views', width: 400, height: 300 },
    { url: '/cities/marrakech/gallery/image-12.svg', alt: 'Marrakech: Local Culture', width: 400, height: 300 }
  ],
  rabat: [
    { url: '/cities/rabat/gallery/image-1.svg', alt: 'Rabat: Hassan Tower', width: 400, height: 300 },
    { url: '/cities/rabat/gallery/image-2.svg', alt: 'Rabat: Kasbah Oudayas', width: 400, height: 300 },
    { url: '/cities/rabat/gallery/image-3.svg', alt: 'Rabat: Royal Palace', width: 400, height: 300 },
    { url: '/cities/rabat/gallery/image-4.svg', alt: 'Rabat: Chellah Ruins', width: 400, height: 300 },
    { url: '/cities/rabat/gallery/image-5.svg', alt: 'Rabat: Medina Streets', width: 400, height: 300 },
    { url: '/cities/rabat/gallery/image-6.svg', alt: 'Rabat: Atlantic Coast', width: 400, height: 300 },
    { url: '/cities/rabat/gallery/image-7.svg', alt: 'Rabat: Traditional Architecture', width: 400, height: 300 },
    { url: '/cities/rabat/gallery/image-8.svg', alt: 'Rabat: Andalusian Gardens', width: 400, height: 300 },
    { url: '/cities/rabat/gallery/image-9.svg', alt: 'Rabat: Mausoleum', width: 400, height: 300 },
    { url: '/cities/rabat/gallery/image-10.svg', alt: 'Rabat: Bouregreg River', width: 400, height: 300 },
    { url: '/cities/rabat/gallery/image-11.svg', alt: 'Rabat: Modern City', width: 400, height: 300 },
    { url: '/cities/rabat/gallery/image-12.svg', alt: 'Rabat: Local Life', width: 400, height: 300 }
  ],
  fes: [
    { url: '/cities/fes/gallery/image-1.svg', alt: 'Fes: Medina Entrance', width: 400, height: 300 },
    { url: '/cities/fes/gallery/image-2.svg', alt: 'Fes: Al Quaraouiyine University', width: 400, height: 300 },
    { url: '/cities/fes/gallery/image-3.svg', alt: 'Fes: Bou Inania Madrasa', width: 400, height: 300 },
    { url: '/cities/fes/gallery/image-4.svg', alt: 'Fes: Chouara Tanneries', width: 400, height: 300 },
    { url: '/cities/fes/gallery/image-5.svg', alt: 'Fes: Traditional Crafts', width: 400, height: 300 },
    { url: '/cities/fes/gallery/image-6.svg', alt: 'Fes: Blue Gate', width: 400, height: 300 },
    { url: '/cities/fes/gallery/image-7.svg', alt: 'Fes: Souk Market', width: 400, height: 300 },
    { url: '/cities/fes/gallery/image-8.svg', alt: 'Fes: Riad Architecture', width: 400, height: 300 },
    { url: '/cities/fes/gallery/image-9.svg', alt: 'Fes: Pottery Workshop', width: 400, height: 300 },
    { url: '/cities/fes/gallery/image-10.svg', alt: 'Fes: Leather Goods', width: 400, height: 300 },
    { url: '/cities/fes/gallery/image-11.svg', alt: 'Fes: Traditional Life', width: 400, height: 300 },
    { url: '/cities/fes/gallery/image-12.svg', alt: 'Fes: Historic Streets', width: 400, height: 300 }
  ],
  casablanca: [
    { url: '/cities/casablanca/gallery/image-1.svg', alt: 'Casablanca: Hassan II Mosque', width: 400, height: 300 },
    { url: '/cities/casablanca/gallery/image-2.svg', alt: 'Casablanca: Corniche', width: 400, height: 300 },
    { url: '/cities/casablanca/gallery/image-3.svg', alt: 'Casablanca: Art Deco Buildings', width: 400, height: 300 },
    { url: '/cities/casablanca/gallery/image-4.svg', alt: 'Casablanca: Medina', width: 400, height: 300 },
    { url: '/cities/casablanca/gallery/image-5.svg', alt: 'Casablanca: Atlantic Ocean', width: 400, height: 300 },
    { url: '/cities/casablanca/gallery/image-6.svg', alt: 'Casablanca: Modern Architecture', width: 400, height: 300 },
    { url: '/cities/casablanca/gallery/image-7.svg', alt: 'Casablanca: Habous Quarter', width: 400, height: 300 },
    { url: '/cities/casablanca/gallery/image-8.svg', alt: 'Casablanca: Mohammed V Square', width: 400, height: 300 },
    { url: '/cities/casablanca/gallery/image-9.svg', alt: 'Casablanca: Ain Diab', width: 400, height: 300 },
    { url: '/cities/casablanca/gallery/image-10.svg', alt: 'Casablanca: Traditional Market', width: 400, height: 300 },
    { url: '/cities/casablanca/gallery/image-11.svg', alt: 'Casablanca: City Skyline', width: 400, height: 300 },
    { url: '/cities/casablanca/gallery/image-12.svg', alt: 'Casablanca: Local Culture', width: 400, height: 300 }
  ],
  tangier: [
    { url: '/cities/tangier/gallery/image-1.svg', alt: 'Tangier: Medina Streets', width: 400, height: 300 },
    { url: '/cities/tangier/gallery/image-2.svg', alt: 'Tangier: Strait of Gibraltar', width: 400, height: 300 },
    { url: '/cities/tangier/gallery/image-3.svg', alt: 'Tangier: Kasbah', width: 400, height: 300 },
    { url: '/cities/tangier/gallery/image-4.svg', alt: 'Tangier: Atlantic Ocean', width: 400, height: 300 },
    { url: '/cities/tangier/gallery/image-5.svg', alt: 'Tangier: Mediterranean Sea', width: 400, height: 300 },
    { url: '/cities/tangier/gallery/image-6.svg', alt: 'Tangier: Traditional Architecture', width: 400, height: 300 },
    { url: '/cities/tangier/gallery/image-7.svg', alt: 'Tangier: Grand Socco', width: 400, height: 300 },
    { url: '/cities/tangier/gallery/image-8.svg', alt: 'Tangier: Petit Socco', width: 400, height: 300 },
    { url: '/cities/tangier/gallery/image-9.svg', alt: 'Tangier: Hercules Caves', width: 400, height: 300 },
    { url: '/cities/tangier/gallery/image-10.svg', alt: 'Tangier: Cap Spartel', width: 400, height: 300 },
    { url: '/cities/tangier/gallery/image-11.svg', alt: 'Tangier: Sunset Views', width: 400, height: 300 },
    { url: '/cities/tangier/gallery/image-12.svg', alt: 'Tangier: Local Life', width: 400, height: 300 }
  ],
  chefchaouen: [
    { url: '/cities/chefchaouen/gallery/image-1.svg', alt: 'Chefchaouen: Blue City', width: 400, height: 300 },
    { url: '/cities/chefchaouen/gallery/image-2.svg', alt: 'Chefchaouen: Blue Walls', width: 400, height: 300 },
    { url: '/cities/chefchaouen/gallery/image-3.svg', alt: 'Chefchaouen: Medina', width: 400, height: 300 },
    { url: '/cities/chefchaouen/gallery/image-4.svg', alt: 'Chefchaouen: Rif Mountains', width: 400, height: 300 },
    { url: '/cities/chefchaouen/gallery/image-5.svg', alt: 'Chefchaouen: Traditional Architecture', width: 400, height: 300 },
    { url: '/cities/chefchaouen/gallery/image-6.svg', alt: 'Chefchaouen: Blue Doors', width: 400, height: 300 },
    { url: '/cities/chefchaouen/gallery/image-7.svg', alt: 'Chefchaouen: Street Art', width: 400, height: 300 },
    { url: '/cities/chefchaouen/gallery/image-8.svg', alt: 'Chefchaouen: Local Life', width: 400, height: 300 },
    { url: '/cities/chefchaouen/gallery/image-9.svg', alt: 'Chefchaouen: Mountain Views', width: 400, height: 300 },
    { url: '/cities/chefchaouen/gallery/image-10.svg', alt: 'Chefchaouen: Photography Spot', width: 400, height: 300 },
    { url: '/cities/chefchaouen/gallery/image-11.svg', alt: 'Chefchaouen: Traditional Crafts', width: 400, height: 300 },
    { url: '/cities/chefchaouen/gallery/image-12.svg', alt: 'Chefchaouen: Peaceful Streets', width: 400, height: 300 }
  ],
  essaouira: [
    { url: '/cities/essaouira/gallery/image-1.svg', alt: 'Essaouira: Medina', width: 400, height: 300 },
    { url: '/cities/essaouira/gallery/image-2.svg', alt: 'Essaouira: Atlantic Coast', width: 400, height: 300 },
    { url: '/cities/essaouira/gallery/image-3.svg', alt: 'Essaouira: Fishing Port', width: 400, height: 300 },
    { url: '/cities/essaouira/gallery/image-4.svg', alt: 'Essaouira: Skala du Port', width: 400, height: 300 },
    { url: '/cities/essaouira/gallery/image-5.svg', alt: 'Essaouira: Traditional Architecture', width: 400, height: 300 },
    { url: '/cities/essaouira/gallery/image-6.svg', alt: 'Essaouira: Blue Boats', width: 400, height: 300 },
    { url: '/cities/essaouira/gallery/image-7.svg', alt: 'Essaouira: Fortifications', width: 400, height: 300 },
    { url: '/cities/essaouira/gallery/image-8.svg', alt: 'Essaouira: Windsurfing', width: 400, height: 300 },
    { url: '/cities/essaouira/gallery/image-9.svg', alt: 'Essaouira: Seafood', width: 400, height: 300 },
    { url: '/cities/essaouira/gallery/image-10.svg', alt: 'Essaouira: Sunset', width: 400, height: 300 },
    { url: '/cities/essaouira/gallery/image-11.svg', alt: 'Essaouira: Local Culture', width: 400, height: 300 },
    { url: '/cities/essaouira/gallery/image-12.svg', alt: 'Essaouira: Traditional Crafts', width: 400, height: 300 }
  ],
  agadir: [
    { url: '/cities/agadir/gallery/image-1.svg', alt: 'Agadir: Beach', width: 400, height: 300 },
    { url: '/cities/agadir/gallery/image-2.svg', alt: 'Agadir: Atlantic Ocean', width: 400, height: 300 },
    { url: '/cities/agadir/gallery/image-3.svg', alt: 'Agadir: Kasbah Ruins', width: 400, height: 300 },
    { url: '/cities/agadir/gallery/image-4.svg', alt: 'Agadir: Marina', width: 400, height: 300 },
    { url: '/cities/agadir/gallery/image-5.svg', alt: 'Agadir: Modern City', width: 400, height: 300 },
    { url: '/cities/agadir/gallery/image-6.svg', alt: 'Agadir: Souk Market', width: 400, height: 300 },
    { url: '/cities/agadir/gallery/image-7.svg', alt: 'Agadir: Traditional Architecture', width: 400, height: 300 },
    { url: '/cities/agadir/gallery/image-8.svg', alt: 'Agadir: Fishing Port', width: 400, height: 300 },
    { url: '/cities/agadir/gallery/image-9.svg', alt: 'Agadir: Palm Trees', width: 400, height: 300 },
    { url: '/cities/agadir/gallery/image-10.svg', alt: 'Agadir: Sunset', width: 400, height: 300 },
    { url: '/cities/agadir/gallery/image-11.svg', alt: 'Agadir: Local Life', width: 400, height: 300 },
    { url: '/cities/agadir/gallery/image-12.svg', alt: 'Agadir: Traditional Crafts', width: 400, height: 300 }
  ],
  meknes: [
    { url: '/cities/meknes/gallery/image-1.svg', alt: 'Meknes: Medina', width: 400, height: 300 },
    { url: '/cities/meknes/gallery/image-2.svg', alt: 'Meknes: Bab Mansour', width: 400, height: 300 },
    { url: '/cities/meknes/gallery/image-3.svg', alt: 'Meknes: Royal Palace', width: 400, height: 300 },
    { url: '/cities/meknes/gallery/image-4.svg', alt: 'Meknes: Traditional Architecture', width: 400, height: 300 },
    { url: '/cities/meknes/gallery/image-5.svg', alt: 'Meknes: Souk Market', width: 400, height: 300 },
    { url: '/cities/meknes/gallery/image-6.svg', alt: 'Meknes: Volubilis Ruins', width: 400, height: 300 },
    { url: '/cities/meknes/gallery/image-7.svg', alt: 'Meknes: Moulay Ismail', width: 400, height: 300 },
    { url: '/cities/meknes/gallery/image-8.svg', alt: 'Meknes: Agdal Basin', width: 400, height: 300 },
    { url: '/cities/meknes/gallery/image-9.svg', alt: 'Meknes: Place el-Hedim', width: 400, height: 300 },
    { url: '/cities/meknes/gallery/image-10.svg', alt: 'Meknes: Historic Gates', width: 400, height: 300 },
    { url: '/cities/meknes/gallery/image-11.svg', alt: 'Meknes: Local Life', width: 400, height: 300 },
    { url: '/cities/meknes/gallery/image-12.svg', alt: 'Meknes: Traditional Crafts', width: 400, height: 300 }
  ],
  ouarzazate: [
    { url: '/cities/ouarzazate/gallery/image-1.svg', alt: 'Ouarzazate: Kasbah', width: 400, height: 300 },
    { url: '/cities/ouarzazate/gallery/image-2.svg', alt: 'Ouarzazate: Ait Ben Haddou', width: 400, height: 300 },
    { url: '/cities/ouarzazate/gallery/image-3.svg', alt: 'Ouarzazate: Atlas Studios', width: 400, height: 300 },
    { url: '/cities/ouarzazate/gallery/image-4.svg', alt: 'Ouarzazate: Taourirt Kasbah', width: 400, height: 300 },
    { url: '/cities/ouarzazate/gallery/image-5.svg', alt: 'Ouarzazate: Desert Fortress', width: 400, height: 300 },
    { url: '/cities/ouarzazate/gallery/image-6.svg', alt: 'Ouarzazate: Film Studios', width: 400, height: 300 },
    { url: '/cities/ouarzazate/gallery/image-7.svg', alt: 'Ouarzazate: Glaoui Palace', width: 400, height: 300 },
    { url: '/cities/ouarzazate/gallery/image-8.svg', alt: 'Ouarzazate: Desert Architecture', width: 400, height: 300 },
    { url: '/cities/ouarzazate/gallery/image-9.svg', alt: 'Ouarzazate: Movie Location', width: 400, height: 300 },
    { url: '/cities/ouarzazate/gallery/image-10.svg', alt: 'Ouarzazate: Historic Kasbah', width: 400, height: 300 },
    { url: '/cities/ouarzazate/gallery/image-11.svg', alt: 'Ouarzazate: Local Life', width: 400, height: 300 },
    { url: '/cities/ouarzazate/gallery/image-12.svg', alt: 'Ouarzazate: Traditional Crafts', width: 400, height: 300 }
  ]
};

// In-memory cache for image metadata
const imageCache = new Map<string, { images: CityImage[]; timestamp: number }>();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Fetch images from Unsplash API
async function fetchUnsplashImages(query: string, limit: number = 12): Promise<CityImage[]> {
  try {
    const response = await fetch(
      `${UNSPLASH_BASE_URL}/search/photos?client_id=${UNSPLASH_API_KEY}&query=${encodeURIComponent(query)}&per_page=${limit}&content_filter=high&orientation=landscape`,
      {
        headers: {
          'Accept-Version': 'v1',
        },
      }
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    
    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }

    const images: CityImage[] = [];
    const usedIds = new Set<string>();

    for (const photo of data.results) {
      if (images.length >= limit) break;
      
      if (photo.id && !usedIds.has(photo.id) && photo.urls?.regular) {
        usedIds.add(photo.id);
        images.push({
          url: photo.urls.regular,
          alt: photo.alt_description || `${query} - Beautiful Morocco landscape`,
          width: 400,
          height: 300,
        });
      }
    }

    return images;
  } catch {
    return [];
  }
}

// Get city images with caching and fallback
export async function getCityImages(citySlug: string, limit: number = 12): Promise<CityImage[]> {

  // Check cache first
  const cached = imageCache.get(citySlug);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.images.slice(0, limit);
  }

  const queries = CITY_SEARCH_QUERIES[citySlug] || CITY_SEARCH_QUERIES.marrakech;
  if (!queries) {
    return [];
  }
  
  const images: CityImage[] = [];
  const usedIds = new Set<string>();

  // Try each query until we have enough images
  for (const query of queries) {
    if (images.length >= limit) break;
    
    const unsplashImages = await fetchUnsplashImages(query, limit - images.length);
    
    for (const image of unsplashImages) {
      if (images.length >= limit) break;
      
      // Check for duplicates by URL
      const isDuplicate = images.some(existing => existing.url === image.url);
      if (!isDuplicate && !usedIds.has(image.url)) {
        usedIds.add(image.url);
        images.push(image);
      }
    }
  }

  // If we don't have enough images, use fallback
  if (images.length < limit) {
    const fallbackImages = FALLBACK_IMAGES[citySlug] || FALLBACK_IMAGES.marrakech;
    if (fallbackImages) {
      const needed = limit - images.length;
      
      for (let i = 0; i < needed && i < fallbackImages.length; i++) {
        const fallbackImage = fallbackImages[i];
        if (fallbackImage && !usedIds.has(fallbackImage.url)) {
          usedIds.add(fallbackImage.url);
          images.push(fallbackImage);
        }
      }
    }
  }

  // Cache the results
  imageCache.set(citySlug, {
    images: images.slice(0, limit),
    timestamp: Date.now(),
  });

  return images.slice(0, limit);
}

// Get hero image for city (first image)
export async function getCityHeroImage(citySlug: string): Promise<CityImage | null> {
  const images = await getCityImages(citySlug, 1);
  return images.length > 0 ? images[0] || null : null;
}

// Clear cache for a specific city (useful for testing)
export function clearCityCache(citySlug: string): void {
  imageCache.delete(citySlug);
}

// Clear all cache
export function clearAllCache(): void {
  imageCache.clear();
}