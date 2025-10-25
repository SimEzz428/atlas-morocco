/**
 * Image Service for City Galleries
 * Fetches high-quality, city-specific images with proper fallbacks
 */

export interface CityImage {
  url: string;
  alt: string;
  photographer?: string;
  width: number;
  height: number;
}

export interface UnsplashResponse {
  results: Array<{
    id: string;
    urls: {
      regular: string;
      small: string;
    };
    alt_description: string;
    user: {
      name: string;
    };
    width: number;
    height: number;
  }>;
}

// City-specific search terms for better image relevance
const CITY_SEARCH_TERMS: Record<string, string[]> = {
  marrakech: [
    'Jemaa el-Fnaa square Marrakech Morocco',
    'Majorelle Garden Marrakech Morocco',
    'Bahia Palace Marrakech Morocco',
    'Koutoubia Mosque Marrakech Morocco',
    'Marrakech souks Morocco',
    'Marrakech medina Morocco',
    'Saadian Tombs Marrakech Morocco',
    'El Badi Palace Marrakech Morocco',
    'Menara Gardens Marrakech Morocco',
    'Marrakech Museum Morocco',
    'Le Jardin Secret Marrakech Morocco',
    'Dar Si Said Museum Marrakech Morocco'
  ],
  rabat: [
    'Hassan Tower Rabat Morocco',
    'Rabat Royal Palace Morocco',
    'Rabat Kasbah Morocco',
    'Rabat medina Morocco',
    'Rabat coastline Morocco',
    'Rabat modern district Morocco',
    'Chellah Necropolis Rabat Morocco',
    'Rabat Archaeological Museum Morocco',
    'Rabat Parliament Building Morocco',
    'Rabat Andalusian Gardens Morocco',
    'Rabat Bou Regreg River Morocco',
    'Rabat Mohammed V Mausoleum Morocco'
  ],
  casablanca: [
    'Hassan II Mosque Casablanca Morocco',
    'Casablanca city center Morocco',
    'Casablanca Corniche Morocco',
    'Casablanca architecture Morocco',
    'Casablanca skyline Morocco',
    'Casablanca port Morocco',
    'Casablanca Twin Center Morocco',
    'Casablanca Cathedral Morocco',
    'Casablanca Habous Quarter Morocco',
    'Casablanca Mohammed V Square Morocco',
    'Casablanca Ain Diab Beach Morocco',
    'Casablanca Central Market Morocco'
  ],
  fes: [
    'Fes medina Morocco',
    'Al Quaraouiyine University Fes Morocco',
    'Fes tanneries Morocco',
    'Fes pottery Morocco',
    'Fes architecture Morocco',
    'Fes souks Morocco',
    'Bou Inania Madrasa Fes Morocco',
    'Royal Palace Fes Morocco',
    'Attarine Madrasa Fes Morocco',
    'Fes Jewish Quarter Morocco',
    'Fes pottery workshops Morocco',
    'Fes carpet souk Morocco'
  ],
  chefchaouen: [
    'Blue streets Chefchaouen Morocco',
    'Chefchaouen blue houses Morocco',
    'Chefchaouen mountains Morocco',
    'Chefchaouen medina Morocco',
    'Chefchaouen waterfalls Morocco',
    'Chefchaouen rooftops Morocco',
    'Spanish Mosque Chefchaouen Morocco',
    'Chefchaouen Kasbah Museum Morocco',
    'Ras El Maa Waterfall Chefchaouen Morocco',
    'Plaza Uta el-Hammam Chefchaouen Morocco',
    'Akchour Waterfalls Chefchaouen Morocco',
    'Talassemtane National Park Chefchaouen Morocco'
  ],
  essaouira: [
    'Essaouira beach Morocco',
    'Essaouira medina Morocco',
    'Essaouira port Morocco',
    'Essaouira ramparts Morocco',
    'Essaouira art galleries Morocco',
    'Essaouira fishing boats Morocco',
    'Essaouira Skala de la Ville Morocco',
    'Essaouira Skala du Port Morocco',
    'Essaouira Jewish Quarter Morocco',
    'Essaouira windsurfing Morocco',
    'Essaouira souks Morocco',
    'Essaouira sunset Morocco'
  ],
  tangier: [
    'Tangier medina Morocco',
    'Tangier coastline Morocco',
    'Tangier port Morocco',
    'Tangier Kasbah Morocco',
    'Tangier Strait view Morocco',
    'Tangier architecture Morocco',
    'Tangier American Legation Museum Morocco',
    'Tangier Grand Socco Morocco',
    'Tangier Petit Socco Morocco',
    'Tangier Cap Spartel Morocco',
    'Tangier Hercules Cave Morocco',
    'Tangier beach Morocco'
  ],
  agadir: [
    'Agadir beach Morocco',
    'Agadir marina Morocco',
    'Agadir souk Morocco',
    'Agadir mountains Morocco',
    'Agadir modern city Morocco',
    'Agadir sunset Morocco',
    'Agadir Kasbah Morocco',
    'Agadir Valley of Birds Morocco',
    'Agadir golf courses Morocco',
    'Agadir fishing port Morocco',
    'Agadir Amazigh Heritage Museum Morocco',
    'Agadir Paradise Valley Morocco'
  ],
  meknes: [
    'Meknes medina Morocco',
    'Meknes Royal Palace Morocco',
    'Meknes Bab Mansour Morocco',
    'Meknes architecture Morocco',
    'Meknes souks Morocco',
    'Meknes vineyards Morocco',
    'Meknes Mausoleum of Moulay Ismail Morocco',
    'Meknes Dar Jamai Museum Morocco',
    'Meknes Heri es-Souani Morocco',
    'Meknes Bou Inania Madrasa Morocco',
    'Meknes Agdal Basin Morocco',
    'Meknes Place el-Hedim Morocco'
  ],
  ouarzazate: [
    'Ouarzazate desert Morocco',
    'Ouarzazate Atlas Studios Morocco',
    'Ouarzazate kasbah Morocco',
    'Ouarzazate mountains Morocco',
    'Ouarzazate palm groves Morocco',
    'Ouarzazate sunset Morocco',
    'Ait Ben Haddou Ouarzazate Morocco',
    'Ouarzazate Taourirt Kasbah Morocco',
    'Ouarzazate Cinema Museum Morocco',
    'Ouarzazate Draa Valley Morocco',
    'Ouarzazate Skoura Oasis Morocco',
    'Ouarzazate Tifoultoute Kasbah Morocco'
  ]
};

// Fallback images for each city (local curated images)
const FALLBACK_IMAGES: Record<string, CityImage[]> = {
  marrakech: [
    { url: '/cities/marrakech/gallery/jemaa-el-fnaa.svg', alt: 'Jemaa el-Fnaa square in Marrakech', width: 400, height: 300 },
    { url: '/cities/marrakech/gallery/koutoubia-mosque.svg', alt: 'Koutoubia Mosque Marrakech', width: 400, height: 300 },
    { url: '/cities/marrakech/gallery/bahia-palace.svg', alt: 'Bahia Palace Marrakech', width: 400, height: 300 },
    { url: '/cities/marrakech/gallery/majorelle-garden.svg', alt: 'Majorelle Garden Marrakech', width: 400, height: 300 },
    { url: '/cities/marrakech/gallery/saadian-tombs.svg', alt: 'Saadian Tombs Marrakech', width: 400, height: 300 },
    { url: '/cities/marrakech/gallery/el-badi-palace.svg', alt: 'El Badi Palace Marrakech', width: 400, height: 300 },
    { url: '/cities/marrakech/gallery/menara-gardens.svg', alt: 'Menara Gardens Marrakech', width: 400, height: 300 },
    { url: '/cities/marrakech/gallery/marrakech-museum.svg', alt: 'Marrakech Museum', width: 400, height: 300 },
    { url: '/cities/marrakech/gallery/le-jardin-secret.svg', alt: 'Le Jardin Secret Marrakech', width: 400, height: 300 },
    { url: '/cities/marrakech/gallery/dar-si-said.svg', alt: 'Dar Si Said Museum Marrakech', width: 400, height: 300 },
    { url: '/cities/marrakech/gallery/marrakech-souks.svg', alt: 'Marrakech souks', width: 400, height: 300 },
    { url: '/cities/marrakech/gallery/marrakech-medina.svg', alt: 'Marrakech medina', width: 400, height: 300 }
  ],
  rabat: [
    { url: '/cities/rabat/gallery/hassan-tower.svg', alt: 'Hassan Tower Rabat', width: 400, height: 300 },
    { url: '/cities/rabat/gallery/royal-palace.svg', alt: 'Rabat Royal Palace', width: 400, height: 300 },
    { url: '/cities/rabat/gallery/kasbah.svg', alt: 'Rabat Kasbah', width: 400, height: 300 },
    { url: '/cities/rabat/gallery/medina.svg', alt: 'Rabat medina', width: 400, height: 300 },
    { url: '/cities/rabat/gallery/coastline.svg', alt: 'Rabat coastline', width: 400, height: 300 },
    { url: '/cities/rabat/gallery/modern-district.svg', alt: 'Rabat modern district', width: 400, height: 300 },
    { url: '/cities/rabat/gallery/chellah.svg', alt: 'Chellah Necropolis Rabat', width: 400, height: 300 },
    { url: '/cities/rabat/gallery/museum.svg', alt: 'Rabat Archaeological Museum', width: 400, height: 300 },
    { url: '/cities/rabat/gallery/parliament.svg', alt: 'Rabat Parliament Building', width: 400, height: 300 },
    { url: '/cities/rabat/gallery/gardens.svg', alt: 'Rabat Andalusian Gardens', width: 400, height: 300 },
    { url: '/cities/rabat/gallery/bou-regreg.svg', alt: 'Rabat Bou Regreg River', width: 400, height: 300 },
    { url: '/cities/rabat/gallery/mausoleum.svg', alt: 'Rabat Mohammed V Mausoleum', width: 400, height: 300 }
  ],
  casablanca: [
    { url: '/cities/casablanca/gallery/hassan-ii-mosque.svg', alt: 'Hassan II Mosque Casablanca', width: 400, height: 300 },
    { url: '/cities/casablanca/gallery/city-center.svg', alt: 'Casablanca city center', width: 400, height: 300 },
    { url: '/cities/casablanca/gallery/corniche.svg', alt: 'Casablanca Corniche', width: 400, height: 300 },
    { url: '/cities/casablanca/gallery/architecture.svg', alt: 'Casablanca architecture', width: 400, height: 300 },
    { url: '/cities/casablanca/gallery/skyline.svg', alt: 'Casablanca skyline', width: 400, height: 300 },
    { url: '/cities/casablanca/gallery/port.svg', alt: 'Casablanca port', width: 400, height: 300 },
    { url: '/cities/casablanca/gallery/twin-center.svg', alt: 'Casablanca Twin Center', width: 400, height: 300 },
    { url: '/cities/casablanca/gallery/cathedral.svg', alt: 'Casablanca Cathedral', width: 400, height: 300 },
    { url: '/cities/casablanca/gallery/habous.svg', alt: 'Casablanca Habous Quarter', width: 400, height: 300 },
    { url: '/cities/casablanca/gallery/square.svg', alt: 'Casablanca Mohammed V Square', width: 400, height: 300 },
    { url: '/cities/casablanca/gallery/beach.svg', alt: 'Casablanca Ain Diab Beach', width: 400, height: 300 },
    { url: '/cities/casablanca/gallery/market.svg', alt: 'Casablanca Central Market', width: 400, height: 300 }
  ],
  fes: [
    { url: '/cities/fes/gallery/medina.svg', alt: 'Fes medina', width: 400, height: 300 },
    { url: '/cities/fes/gallery/university.svg', alt: 'Al Quaraouiyine University Fes', width: 400, height: 300 },
    { url: '/cities/fes/gallery/tanneries.svg', alt: 'Fes tanneries', width: 400, height: 300 },
    { url: '/cities/fes/gallery/pottery.svg', alt: 'Fes pottery', width: 400, height: 300 },
    { url: '/cities/fes/gallery/architecture.svg', alt: 'Fes architecture', width: 400, height: 300 },
    { url: '/cities/fes/gallery/souks.svg', alt: 'Fes souks', width: 400, height: 300 },
    { url: '/cities/fes/gallery/madrasa.svg', alt: 'Bou Inania Madrasa Fes', width: 400, height: 300 },
    { url: '/cities/fes/gallery/palace.svg', alt: 'Royal Palace Fes', width: 400, height: 300 },
    { url: '/cities/fes/gallery/attarine.svg', alt: 'Attarine Madrasa Fes', width: 400, height: 300 },
    { url: '/cities/fes/gallery/jewish-quarter.svg', alt: 'Fes Jewish Quarter', width: 400, height: 300 },
    { url: '/cities/fes/gallery/workshops.svg', alt: 'Fes pottery workshops', width: 400, height: 300 },
    { url: '/cities/fes/gallery/carpet-souk.svg', alt: 'Fes carpet souk', width: 400, height: 300 }
  ],
  chefchaouen: [
    { url: '/cities/chefchaouen/gallery/blue-streets.svg', alt: 'Blue streets of Chefchaouen', width: 400, height: 300 },
    { url: '/cities/chefchaouen/gallery/blue-houses.svg', alt: 'Chefchaouen blue houses', width: 400, height: 300 },
    { url: '/cities/chefchaouen/gallery/mountains.svg', alt: 'Chefchaouen mountains', width: 400, height: 300 },
    { url: '/cities/chefchaouen/gallery/medina.svg', alt: 'Chefchaouen medina', width: 400, height: 300 },
    { url: '/cities/chefchaouen/gallery/waterfalls.svg', alt: 'Chefchaouen waterfalls', width: 400, height: 300 },
    { url: '/cities/chefchaouen/gallery/rooftops.svg', alt: 'Chefchaouen rooftops', width: 400, height: 300 },
    { url: '/cities/chefchaouen/gallery/spanish-mosque.svg', alt: 'Spanish Mosque Chefchaouen', width: 400, height: 300 },
    { url: '/cities/chefchaouen/gallery/kasbah.svg', alt: 'Chefchaouen Kasbah Museum', width: 400, height: 300 },
    { url: '/cities/chefchaouen/gallery/ras-el-maa.svg', alt: 'Ras El Maa Waterfall Chefchaouen', width: 400, height: 300 },
    { url: '/cities/chefchaouen/gallery/plaza.svg', alt: 'Plaza Uta el-Hammam Chefchaouen', width: 400, height: 300 },
    { url: '/cities/chefchaouen/gallery/akchour.svg', alt: 'Akchour Waterfalls Chefchaouen', width: 400, height: 300 },
    { url: '/cities/chefchaouen/gallery/park.svg', alt: 'Talassemtane National Park Chefchaouen', width: 400, height: 300 }
  ],
  essaouira: [
    { url: '/cities/essaouira/gallery/beach.svg', alt: 'Essaouira beach', width: 400, height: 300 },
    { url: '/cities/essaouira/gallery/medina.svg', alt: 'Essaouira medina', width: 400, height: 300 },
    { url: '/cities/essaouira/gallery/port.svg', alt: 'Essaouira port', width: 400, height: 300 },
    { url: '/cities/essaouira/gallery/ramparts.svg', alt: 'Essaouira ramparts', width: 400, height: 300 },
    { url: '/cities/essaouira/gallery/galleries.svg', alt: 'Essaouira art galleries', width: 400, height: 300 },
    { url: '/cities/essaouira/gallery/fishing-boats.svg', alt: 'Essaouira fishing boats', width: 400, height: 300 },
    { url: '/cities/essaouira/gallery/skala-ville.svg', alt: 'Essaouira Skala de la Ville', width: 400, height: 300 },
    { url: '/cities/essaouira/gallery/skala-port.svg', alt: 'Essaouira Skala du Port', width: 400, height: 300 },
    { url: '/cities/essaouira/gallery/jewish-quarter.svg', alt: 'Essaouira Jewish Quarter', width: 400, height: 300 },
    { url: '/cities/essaouira/gallery/windsurfing.svg', alt: 'Essaouira windsurfing', width: 400, height: 300 },
    { url: '/cities/essaouira/gallery/souks.svg', alt: 'Essaouira souks', width: 400, height: 300 },
    { url: '/cities/essaouira/gallery/sunset.svg', alt: 'Essaouira sunset', width: 400, height: 300 }
  ],
  tangier: [
    { url: '/cities/tangier/gallery/medina.svg', alt: 'Tangier medina', width: 400, height: 300 },
    { url: '/cities/tangier/gallery/coastline.svg', alt: 'Tangier coastline', width: 400, height: 300 },
    { url: '/cities/tangier/gallery/port.svg', alt: 'Tangier port', width: 400, height: 300 },
    { url: '/cities/tangier/gallery/kasbah.svg', alt: 'Tangier Kasbah', width: 400, height: 300 },
    { url: '/cities/tangier/gallery/strait.svg', alt: 'Tangier Strait view', width: 400, height: 300 },
    { url: '/cities/tangier/gallery/architecture.svg', alt: 'Tangier architecture', width: 400, height: 300 },
    { url: '/cities/tangier/gallery/museum.svg', alt: 'Tangier American Legation Museum', width: 400, height: 300 },
    { url: '/cities/tangier/gallery/grand-socco.svg', alt: 'Tangier Grand Socco', width: 400, height: 300 },
    { url: '/cities/tangier/gallery/petit-socco.svg', alt: 'Tangier Petit Socco', width: 400, height: 300 },
    { url: '/cities/tangier/gallery/cap-spartel.svg', alt: 'Tangier Cap Spartel', width: 400, height: 300 },
    { url: '/cities/tangier/gallery/hercules-cave.svg', alt: 'Tangier Hercules Cave', width: 400, height: 300 },
    { url: '/cities/tangier/gallery/beach.svg', alt: 'Tangier beach', width: 400, height: 300 }
  ],
  agadir: [
    { url: '/cities/agadir/gallery/beach.svg', alt: 'Agadir beach', width: 400, height: 300 },
    { url: '/cities/agadir/gallery/marina.svg', alt: 'Agadir marina', width: 400, height: 300 },
    { url: '/cities/agadir/gallery/souk.svg', alt: 'Agadir souk', width: 400, height: 300 },
    { url: '/cities/agadir/gallery/mountains.svg', alt: 'Agadir mountains', width: 400, height: 300 },
    { url: '/cities/agadir/gallery/modern-city.svg', alt: 'Agadir modern city', width: 400, height: 300 },
    { url: '/cities/agadir/gallery/sunset.svg', alt: 'Agadir sunset', width: 400, height: 300 },
    { url: '/cities/agadir/gallery/kasbah.svg', alt: 'Agadir Kasbah', width: 400, height: 300 },
    { url: '/cities/agadir/gallery/valley-birds.svg', alt: 'Agadir Valley of Birds', width: 400, height: 300 },
    { url: '/cities/agadir/gallery/golf.svg', alt: 'Agadir golf courses', width: 400, height: 300 },
    { url: '/cities/agadir/gallery/fishing-port.svg', alt: 'Agadir fishing port', width: 400, height: 300 },
    { url: '/cities/agadir/gallery/museum.svg', alt: 'Agadir Amazigh Heritage Museum', width: 400, height: 300 },
    { url: '/cities/agadir/gallery/paradise-valley.svg', alt: 'Agadir Paradise Valley', width: 400, height: 300 }
  ],
  meknes: [
    { url: '/cities/meknes/gallery/medina.svg', alt: 'Meknes medina', width: 400, height: 300 },
    { url: '/cities/meknes/gallery/royal-palace.svg', alt: 'Meknes Royal Palace', width: 400, height: 300 },
    { url: '/cities/meknes/gallery/bab-mansour.svg', alt: 'Meknes Bab Mansour', width: 400, height: 300 },
    { url: '/cities/meknes/gallery/architecture.svg', alt: 'Meknes architecture', width: 400, height: 300 },
    { url: '/cities/meknes/gallery/souks.svg', alt: 'Meknes souks', width: 400, height: 300 },
    { url: '/cities/meknes/gallery/vineyards.svg', alt: 'Meknes vineyards', width: 400, height: 300 },
    { url: '/cities/meknes/gallery/mausoleum.svg', alt: 'Meknes Mausoleum of Moulay Ismail', width: 400, height: 300 },
    { url: '/cities/meknes/gallery/museum.svg', alt: 'Meknes Dar Jamai Museum', width: 400, height: 300 },
    { url: '/cities/meknes/gallery/heri-souani.svg', alt: 'Meknes Heri es-Souani', width: 400, height: 300 },
    { url: '/cities/meknes/gallery/madrasa.svg', alt: 'Meknes Bou Inania Madrasa', width: 400, height: 300 },
    { url: '/cities/meknes/gallery/agdal-basin.svg', alt: 'Meknes Agdal Basin', width: 400, height: 300 },
    { url: '/cities/meknes/gallery/place-hedim.svg', alt: 'Meknes Place el-Hedim', width: 400, height: 300 }
  ],
  ouarzazate: [
    { url: '/cities/ouarzazate/gallery/desert.svg', alt: 'Ouarzazate desert', width: 400, height: 300 },
    { url: '/cities/ouarzazate/gallery/atlas-studios.svg', alt: 'Ouarzazate Atlas Studios', width: 400, height: 300 },
    { url: '/cities/ouarzazate/gallery/kasbah.svg', alt: 'Ouarzazate kasbah', width: 400, height: 300 },
    { url: '/cities/ouarzazate/gallery/mountains.svg', alt: 'Ouarzazate mountains', width: 400, height: 300 },
    { url: '/cities/ouarzazate/gallery/palm-groves.svg', alt: 'Ouarzazate palm groves', width: 400, height: 300 },
    { url: '/cities/ouarzazate/gallery/sunset.svg', alt: 'Ouarzazate sunset', width: 400, height: 300 },
    { url: '/cities/ouarzazate/gallery/ait-ben-haddou.svg', alt: 'Ait Ben Haddou Ouarzazate', width: 400, height: 300 },
    { url: '/cities/ouarzazate/gallery/taourirt-kasbah.svg', alt: 'Ouarzazate Taourirt Kasbah', width: 400, height: 300 },
    { url: '/cities/ouarzazate/gallery/cinema-museum.svg', alt: 'Ouarzazate Cinema Museum', width: 400, height: 300 },
    { url: '/cities/ouarzazate/gallery/draa-valley.svg', alt: 'Ouarzazate Draa Valley', width: 400, height: 300 },
    { url: '/cities/ouarzazate/gallery/skoura-oasis.svg', alt: 'Ouarzazate Skoura Oasis', width: 400, height: 300 },
    { url: '/cities/ouarzazate/gallery/tifoultoute-kasbah.svg', alt: 'Ouarzazate Tifoultoute Kasbah', width: 400, height: 300 }
  ]
};

/**
 * Fetch images from Unsplash API for a specific city
 */
async function fetchUnsplashImages(citySlug: string, limit: number = 12): Promise<CityImage[]> {
  const searchTerms = CITY_SEARCH_TERMS[citySlug];
  if (!searchTerms) {
    console.warn(`No search terms found for city: ${citySlug}`);
    return [];
  }

  const images: CityImage[] = [];
  const usedIds = new Set<string>();

  try {
    for (const searchTerm of searchTerms.slice(0, limit)) {
      if (images.length >= limit) break;

      const response = await fetch(
        `/api/unsplash?q=${encodeURIComponent(searchTerm)}&per_page=1&w=400&h=300`
      );

      if (!response.ok) {
        console.warn(`Unsplash API error for "${searchTerm}": ${response.status}`);
        continue;
      }

      const data: { images: Array<{ id: string; src: string; alt: string; photographer?: string; width: number; height: number }> } = await response.json();
      
      if (data.images && data.images.length > 0) {
        const result = data.images[0];
        
        // Avoid duplicates
        if (result && !usedIds.has(result.id)) {
          usedIds.add(result.id);
          images.push({
            url: result.src,
            alt: result.alt || `${searchTerm} - Morocco`,
            photographer: result.photographer,
            width: result.width,
            height: result.height
          });
        }
      }
    }
  } catch (error) {
    console.error(`Error fetching Unsplash images for ${citySlug}:`, error);
  }

  return images;
}

/**
 * Get fallback images for a city
 */
function getFallbackImages(citySlug: string): CityImage[] {
  return FALLBACK_IMAGES[citySlug] || [];
}

/**
 * Main function to get city images with proper fallbacks
 */
export async function getCityImages(citySlug: string, limit: number = 12): Promise<CityImage[]> {
  console.log(`Fetching images for city: ${citySlug}`);
  
  // Normalize city slug
  const normalizedSlug = citySlug.toLowerCase()
    .replace(/[èéêë]/g, 'e')
    .replace(/[àáâä]/g, 'a')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôö]/g, 'o')
    .replace(/[ç]/g, 'c');

  try {
    // Try to fetch from Unsplash first
    const unsplashImages = await fetchUnsplashImages(normalizedSlug, limit);
    console.log(`Found ${unsplashImages.length} Unsplash images for ${citySlug}`);

    // If we have enough images, return them
    if (unsplashImages.length >= limit) {
      return unsplashImages.slice(0, limit);
    }

    // If we need more images, get fallbacks
    const fallbackImages = getFallbackImages(normalizedSlug);
    console.log(`Found ${fallbackImages.length} fallback images for ${citySlug}`);

    // Combine Unsplash and fallback images
    const combinedImages = [...unsplashImages];
    const usedUrls = new Set(unsplashImages.map(img => img.url));

    for (const fallbackImage of fallbackImages) {
      if (combinedImages.length >= limit) break;
      if (!usedUrls.has(fallbackImage.url)) {
        combinedImages.push(fallbackImage);
        usedUrls.add(fallbackImage.url);
      }
    }

    // If still not enough, fill with generic fallbacks
    if (combinedImages.length < limit) {
      const genericFallbacks = getFallbackImages('marrakech'); // Use Marrakech as generic fallback
      for (const genericImage of genericFallbacks) {
        if (combinedImages.length >= limit) break;
        if (!usedUrls.has(genericImage.url)) {
          combinedImages.push({
            ...genericImage,
            alt: `${citySlug} - Morocco`
          });
          usedUrls.add(genericImage.url);
        }
      }
    }

    console.log(`Returning ${combinedImages.length} total images for ${citySlug}`);
    return combinedImages.slice(0, limit);

  } catch (error) {
    console.error(`Error getting images for ${citySlug}:`, error);
    
    // Return fallback images only
    const fallbackImages = getFallbackImages(normalizedSlug);
    console.log(`Using ${fallbackImages.length} fallback images for ${citySlug}`);
    return fallbackImages.slice(0, limit);
  }
}

/**
 * Get a single hero image for a city
 */
export async function getCityHeroImage(citySlug: string): Promise<CityImage | null> {
  const images = await getCityImages(citySlug, 1);
  return images.length > 0 && images[0] ? images[0] : null;
}
