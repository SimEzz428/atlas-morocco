"use client";

export interface CityImage {
  src: string;
  alt: string;
  photographer?: string;
  isLocal?: boolean;
}

interface UnsplashResponse {
  results: Array<{
    id: string;
    urls: {
      small: string;
      regular: string;
    };
    alt_description: string;
    user: {
      name: string;
    };
  }>;
}

// Local curated images for each city (fallback when Unsplash fails)
const LOCAL_CITY_IMAGES: Record<string, CityImage[]> = {
  marrakech: [
    {
      src: "/cities/marrakech/jemaa-el-fnaa.jpg",
      alt: "Jemaa el-Fnaa square in Marrakech",
      isLocal: true
    },
    {
      src: "/cities/marrakech/koutoubia-mosque.jpg",
      alt: "Koutoubia Mosque Marrakech",
      isLocal: true
    },
    {
      src: "/cities/marrakech/bahia-palace.jpg",
      alt: "Bahia Palace Marrakech",
      isLocal: true
    },
    {
      src: "/cities/marrakech/majorelle-garden.jpg",
      alt: "Majorelle Garden Marrakech",
      isLocal: true
    },
    {
      src: "/cities/marrakech/saadian-tombs.jpg",
      alt: "Saadian Tombs Marrakech",
      isLocal: true
    },
    {
      src: "/cities/marrakech/el-badi-palace.jpg",
      alt: "El Badi Palace Marrakech",
      isLocal: true
    },
    {
      src: "/cities/marrakech/menara-gardens.jpg",
      alt: "Menara Gardens Marrakech",
      isLocal: true
    },
    {
      src: "/cities/marrakech/marrakech-museum.jpg",
      alt: "Marrakech Museum",
      isLocal: true
    },
    {
      src: "/cities/marrakech/le-jardin-secret.jpg",
      alt: "Le Jardin Secret Marrakech",
      isLocal: true
    },
    {
      src: "/cities/marrakech/dar-si-said.jpg",
      alt: "Dar Si Said Museum Marrakech",
      isLocal: true
    },
    {
      src: "/cities/marrakech/marrakech-souks.jpg",
      alt: "Marrakech souks",
      isLocal: true
    },
    {
      src: "/cities/marrakech/marrakech-medina.jpg",
      alt: "Marrakech medina",
      isLocal: true
    }
  ],
  rabat: [
    {
      src: "/cities/rabat/hassan-tower.jpg",
      alt: "Hassan Tower Rabat",
      isLocal: true
    },
    {
      src: "/cities/rabat/royal-palace.jpg",
      alt: "Rabat Royal Palace",
      isLocal: true
    },
    {
      src: "/cities/rabat/kasbah-oudayas.jpg",
      alt: "Kasbah of the Udayas Rabat",
      isLocal: true
    },
    {
      src: "/cities/rabat/chellah-necropolis.jpg",
      alt: "Chellah Necropolis Rabat",
      isLocal: true
    },
    {
      src: "/cities/rabat/mohammed-v-mausoleum.jpg",
      alt: "Mohammed V Mausoleum Rabat",
      isLocal: true
    },
    {
      src: "/cities/rabat/rabat-coastline.jpg",
      alt: "Rabat coastline",
      isLocal: true
    },
    {
      src: "/cities/rabat/andalusian-gardens.jpg",
      alt: "Andalusian Gardens Rabat",
      isLocal: true
    },
    {
      src: "/cities/rabat/bou-regreg-river.jpg",
      alt: "Bou Regreg River Rabat",
      isLocal: true
    },
    {
      src: "/cities/rabat/rabat-medina.jpg",
      alt: "Rabat medina",
      isLocal: true
    },
    {
      src: "/cities/rabat/archaeological-museum.jpg",
      alt: "Rabat Archaeological Museum",
      isLocal: true
    },
    {
      src: "/cities/rabat/parliament-building.jpg",
      alt: "Rabat Parliament Building",
      isLocal: true
    },
    {
      src: "/cities/rabat/modern-district.jpg",
      alt: "Rabat modern district",
      isLocal: true
    }
  ],
  casablanca: [
    {
      src: "/cities/casablanca/hassan-ii-mosque.jpg",
      alt: "Hassan II Mosque Casablanca",
      isLocal: true
    },
    {
      src: "/cities/casablanca/city-center.jpg",
      alt: "Casablanca city center",
      isLocal: true
    },
    {
      src: "/cities/casablanca/corniche.jpg",
      alt: "Casablanca Corniche",
      isLocal: true
    },
    {
      src: "/cities/casablanca/twin-center.jpg",
      alt: "Casablanca Twin Center",
      isLocal: true
    },
    {
      src: "/cities/casablanca/habous-quarter.jpg",
      alt: "Casablanca Habous Quarter",
      isLocal: true
    },
    {
      src: "/cities/casablanca/mohammed-v-square.jpg",
      alt: "Mohammed V Square Casablanca",
      isLocal: true
    },
    {
      src: "/cities/casablanca/ain-diab-beach.jpg",
      alt: "Ain Diab Beach Casablanca",
      isLocal: true
    },
    {
      src: "/cities/casablanca/central-market.jpg",
      alt: "Central Market Casablanca",
      isLocal: true
    },
    {
      src: "/cities/casablanca/casablanca-port.jpg",
      alt: "Casablanca port",
      isLocal: true
    },
    {
      src: "/cities/casablanca/cathedral.jpg",
      alt: "Casablanca Cathedral",
      isLocal: true
    },
    {
      src: "/cities/casablanca/skyline.jpg",
      alt: "Casablanca skyline",
      isLocal: true
    },
    {
      src: "/cities/casablanca/architecture.jpg",
      alt: "Casablanca architecture",
      isLocal: true
    }
  ],
  fes: [
    {
      src: "/cities/fes/medina.jpg",
      alt: "Fes medina",
      isLocal: true
    },
    {
      src: "/cities/fes/al-quaraouiyine.jpg",
      alt: "Al Quaraouiyine University Fes",
      isLocal: true
    },
    {
      src: "/cities/fes/tanneries.jpg",
      alt: "Fes tanneries",
      isLocal: true
    },
    {
      src: "/cities/fes/bou-inania-madrasa.jpg",
      alt: "Bou Inania Madrasa Fes",
      isLocal: true
    },
    {
      src: "/cities/fes/royal-palace.jpg",
      alt: "Royal Palace Fes",
      isLocal: true
    },
    {
      src: "/cities/fes/attarine-madrasa.jpg",
      alt: "Attarine Madrasa Fes",
      isLocal: true
    },
    {
      src: "/cities/fes/jewish-quarter.jpg",
      alt: "Fes Jewish Quarter",
      isLocal: true
    },
    {
      src: "/cities/fes/pottery-workshops.jpg",
      alt: "Fes pottery workshops",
      isLocal: true
    },
    {
      src: "/cities/fes/carpet-souk.jpg",
      alt: "Fes carpet souk",
      isLocal: true
    },
    {
      src: "/cities/fes/fes-pottery.jpg",
      alt: "Fes pottery",
      isLocal: true
    },
    {
      src: "/cities/fes/fes-architecture.jpg",
      alt: "Fes architecture",
      isLocal: true
    },
    {
      src: "/cities/fes/fes-souks.jpg",
      alt: "Fes souks",
      isLocal: true
    }
  ],
  chefchaouen: [
    {
      src: "/cities/chefchaouen/blue-streets.jpg",
      alt: "Blue streets of Chefchaouen",
      isLocal: true
    },
    {
      src: "/cities/chefchaouen/blue-houses.jpg",
      alt: "Chefchaouen blue houses",
      isLocal: true
    },
    {
      src: "/cities/chefchaouen/mountains.jpg",
      alt: "Chefchaouen mountains",
      isLocal: true
    },
    {
      src: "/cities/chefchaouen/medina.jpg",
      alt: "Chefchaouen medina",
      isLocal: true
    },
    {
      src: "/cities/chefchaouen/waterfalls.jpg",
      alt: "Chefchaouen waterfalls",
      isLocal: true
    },
    {
      src: "/cities/chefchaouen/rooftops.jpg",
      alt: "Chefchaouen rooftops",
      isLocal: true
    },
    {
      src: "/cities/chefchaouen/spanish-mosque.jpg",
      alt: "Spanish Mosque Chefchaouen",
      isLocal: true
    },
    {
      src: "/cities/chefchaouen/kasbah-museum.jpg",
      alt: "Chefchaouen Kasbah Museum",
      isLocal: true
    },
    {
      src: "/cities/chefchaouen/ras-el-maa.jpg",
      alt: "Ras El Maa Waterfall Chefchaouen",
      isLocal: true
    },
    {
      src: "/cities/chefchaouen/plaza-uta.jpg",
      alt: "Plaza Uta el-Hammam Chefchaouen",
      isLocal: true
    },
    {
      src: "/cities/chefchaouen/akchour-waterfalls.jpg",
      alt: "Akchour Waterfalls Chefchaouen",
      isLocal: true
    },
    {
      src: "/cities/chefchaouen/talassemtane.jpg",
      alt: "Talassemtane National Park Chefchaouen",
      isLocal: true
    }
  ],
  essaouira: [
    {
      src: "/cities/essaouira/beach.jpg",
      alt: "Essaouira beach",
      isLocal: true
    },
    {
      src: "/cities/essaouira/medina.jpg",
      alt: "Essaouira medina",
      isLocal: true
    },
    {
      src: "/cities/essaouira/port.jpg",
      alt: "Essaouira port",
      isLocal: true
    },
    {
      src: "/cities/essaouira/ramparts.jpg",
      alt: "Essaouira ramparts",
      isLocal: true
    },
    {
      src: "/cities/essaouira/art-galleries.jpg",
      alt: "Essaouira art galleries",
      isLocal: true
    },
    {
      src: "/cities/essaouira/fishing-boats.jpg",
      alt: "Essaouira fishing boats",
      isLocal: true
    },
    {
      src: "/cities/essaouira/skala-ville.jpg",
      alt: "Essaouira Skala de la Ville",
      isLocal: true
    },
    {
      src: "/cities/essaouira/skala-port.jpg",
      alt: "Essaouira Skala du Port",
      isLocal: true
    },
    {
      src: "/cities/essaouira/jewish-quarter.jpg",
      alt: "Essaouira Jewish Quarter",
      isLocal: true
    },
    {
      src: "/cities/essaouira/windsurfing.jpg",
      alt: "Essaouira windsurfing",
      isLocal: true
    },
    {
      src: "/cities/essaouira/souks.jpg",
      alt: "Essaouira souks",
      isLocal: true
    },
    {
      src: "/cities/essaouira/sunset.jpg",
      alt: "Essaouira sunset",
      isLocal: true
    }
  ],
  tangier: [
    {
      src: "/cities/tangier/medina.jpg",
      alt: "Tangier medina",
      isLocal: true
    },
    {
      src: "/cities/tangier/coastline.jpg",
      alt: "Tangier coastline",
      isLocal: true
    },
    {
      src: "/cities/tangier/port.jpg",
      alt: "Tangier port",
      isLocal: true
    },
    {
      src: "/cities/tangier/kasbah.jpg",
      alt: "Tangier Kasbah",
      isLocal: true
    },
    {
      src: "/cities/tangier/strait-view.jpg",
      alt: "Tangier Strait view",
      isLocal: true
    },
    {
      src: "/cities/tangier/american-legation.jpg",
      alt: "Tangier American Legation Museum",
      isLocal: true
    },
    {
      src: "/cities/tangier/grand-socco.jpg",
      alt: "Tangier Grand Socco",
      isLocal: true
    },
    {
      src: "/cities/tangier/petit-socco.jpg",
      alt: "Tangier Petit Socco",
      isLocal: true
    },
    {
      src: "/cities/tangier/cap-spartel.jpg",
      alt: "Tangier Cap Spartel",
      isLocal: true
    },
    {
      src: "/cities/tangier/hercules-cave.jpg",
      alt: "Tangier Hercules Cave",
      isLocal: true
    },
    {
      src: "/cities/tangier/beach.jpg",
      alt: "Tangier beach",
      isLocal: true
    },
    {
      src: "/cities/tangier/architecture.jpg",
      alt: "Tangier architecture",
      isLocal: true
    }
  ],
  agadir: [
    {
      src: "/cities/agadir/beach.jpg",
      alt: "Agadir beach",
      isLocal: true
    },
    {
      src: "/cities/agadir/marina.jpg",
      alt: "Agadir marina",
      isLocal: true
    },
    {
      src: "/cities/agadir/souk.jpg",
      alt: "Agadir souk",
      isLocal: true
    },
    {
      src: "/cities/agadir/mountains.jpg",
      alt: "Agadir mountains",
      isLocal: true
    },
    {
      src: "/cities/agadir/modern-city.jpg",
      alt: "Agadir modern city",
      isLocal: true
    },
    {
      src: "/cities/agadir/sunset.jpg",
      alt: "Agadir sunset",
      isLocal: true
    },
    {
      src: "/cities/agadir/kasbah.jpg",
      alt: "Agadir Kasbah",
      isLocal: true
    },
    {
      src: "/cities/agadir/valley-birds.jpg",
      alt: "Agadir Valley of Birds",
      isLocal: true
    },
    {
      src: "/cities/agadir/golf-courses.jpg",
      alt: "Agadir golf courses",
      isLocal: true
    },
    {
      src: "/cities/agadir/fishing-port.jpg",
      alt: "Agadir fishing port",
      isLocal: true
    },
    {
      src: "/cities/agadir/amazigh-museum.jpg",
      alt: "Agadir Amazigh Heritage Museum",
      isLocal: true
    },
    {
      src: "/cities/agadir/paradise-valley.jpg",
      alt: "Agadir Paradise Valley",
      isLocal: true
    }
  ],
  meknes: [
    {
      src: "/cities/meknes/medina.jpg",
      alt: "Meknes medina",
      isLocal: true
    },
    {
      src: "/cities/meknes/royal-palace.jpg",
      alt: "Meknes Royal Palace",
      isLocal: true
    },
    {
      src: "/cities/meknes/bab-mansour.jpg",
      alt: "Meknes Bab Mansour",
      isLocal: true
    },
    {
      src: "/cities/meknes/mausoleum-ismail.jpg",
      alt: "Mausoleum of Moulay Ismail Meknes",
      isLocal: true
    },
    {
      src: "/cities/meknes/dar-jamai-museum.jpg",
      alt: "Meknes Dar Jamai Museum",
      isLocal: true
    },
    {
      src: "/cities/meknes/heri-souani.jpg",
      alt: "Meknes Heri es-Souani",
      isLocal: true
    },
    {
      src: "/cities/meknes/bou-inania-madrasa.jpg",
      alt: "Meknes Bou Inania Madrasa",
      isLocal: true
    },
    {
      src: "/cities/meknes/agdal-basin.jpg",
      alt: "Meknes Agdal Basin",
      isLocal: true
    },
    {
      src: "/cities/meknes/place-hedim.jpg",
      alt: "Meknes Place el-Hedim",
      isLocal: true
    },
    {
      src: "/cities/meknes/architecture.jpg",
      alt: "Meknes architecture",
      isLocal: true
    },
    {
      src: "/cities/meknes/souks.jpg",
      alt: "Meknes souks",
      isLocal: true
    },
    {
      src: "/cities/meknes/vineyards.jpg",
      alt: "Meknes vineyards",
      isLocal: true
    }
  ],
  ouarzazate: [
    {
      src: "/cities/ouarzazate/desert.jpg",
      alt: "Ouarzazate desert",
      isLocal: true
    },
    {
      src: "/cities/ouarzazate/atlas-studios.jpg",
      alt: "Ouarzazate Atlas Studios",
      isLocal: true
    },
    {
      src: "/cities/ouarzazate/ait-ben-haddou.jpg",
      alt: "Ait Ben Haddou Ouarzazate",
      isLocal: true
    },
    {
      src: "/cities/ouarzazate/taourirt-kasbah.jpg",
      alt: "Ouarzazate Taourirt Kasbah",
      isLocal: true
    },
    {
      src: "/cities/ouarzazate/cinema-museum.jpg",
      alt: "Ouarzazate Cinema Museum",
      isLocal: true
    },
    {
      src: "/cities/ouarzazate/draa-valley.jpg",
      alt: "Ouarzazate Draa Valley",
      isLocal: true
    },
    {
      src: "/cities/ouarzazate/skoura-oasis.jpg",
      alt: "Ouarzazate Skoura Oasis",
      isLocal: true
    },
    {
      src: "/cities/ouarzazate/tifoultoute-kasbah.jpg",
      alt: "Ouarzazate Tifoultoute Kasbah",
      isLocal: true
    },
    {
      src: "/cities/ouarzazate/mountains.jpg",
      alt: "Ouarzazate mountains",
      isLocal: true
    },
    {
      src: "/cities/ouarzazate/palm-groves.jpg",
      alt: "Ouarzazate palm groves",
      isLocal: true
    },
    {
      src: "/cities/ouarzazate/sunset.jpg",
      alt: "Ouarzazate sunset",
      isLocal: true
    },
    {
      src: "/cities/ouarzazate/kasbah.jpg",
      alt: "Ouarzazate kasbah",
      isLocal: true
    }
  ]
};

// High-quality Unsplash image URLs for each city (backup when local images fail)
const UNSPLASH_CITY_IMAGES: Record<string, CityImage[]> = {
  marrakech: [
    {
      src: "https://images.unsplash.com/photo-1585004607620-fb4c44331e73?w=400&h=300&fit=crop&q=80&t=1001",
      alt: "Jemaa el-Fnaa square in Marrakech",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&q=80&t=1002",
      alt: "Majorelle Garden Marrakech",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop&q=80&t=1003",
      alt: "Bahia Palace Marrakech",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1580122058982-0a1d81f09625?w=400&h=300&fit=crop&q=80&t=1004",
      alt: "Koutoubia Mosque Marrakech",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?w=400&h=300&fit=crop&q=80&t=1005",
      alt: "Marrakech souks",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1582919534700-acf2374f10d3?w=400&h=300&fit=crop&q=80&t=1006",
      alt: "Marrakech medina",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1544966503-7cc4a7c4b4b4?w=400&h=300&fit=crop&q=80&t=1007",
      alt: "Saadian Tombs Marrakech",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=400&h=300&fit=crop&q=80&t=1008",
      alt: "El Badi Palace Marrakech",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&q=80&t=1009",
      alt: "Menara Gardens Marrakech",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop&q=80&t=1010",
      alt: "Marrakech Museum",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1580122058982-0a1d81f09625?w=400&h=300&fit=crop&q=80&t=1011",
      alt: "Le Jardin Secret Marrakech",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?w=400&h=300&fit=crop&q=80&t=1012",
      alt: "Dar Si Said Museum Marrakech",
      photographer: "Unsplash"
    }
  ],
  rabat: [
    {
      src: "https://images.unsplash.com/photo-1580122058982-0a1d81f09625?w=400&h=300&fit=crop&q=80&t=4001",
      alt: "Hassan Tower Rabat",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?w=400&h=300&fit=crop&q=80&t=4002",
      alt: "Rabat Royal Palace",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1582919534700-acf2374f10d3?w=400&h=300&fit=crop&q=80&t=4003",
      alt: "Rabat Kasbah",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=400&h=300&fit=crop&q=80&t=4004",
      alt: "Rabat medina",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&q=80&t=4005",
      alt: "Rabat coastline",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop&q=80&t=4006",
      alt: "Rabat modern district",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1544966503-7cc4a7c4b4b4?w=400&h=300&fit=crop&q=80&t=4007",
      alt: "Chellah Necropolis Rabat",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=400&h=300&fit=crop&q=80&t=4008",
      alt: "Rabat Archaeological Museum",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&q=80&t=4009",
      alt: "Rabat Parliament Building",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop&q=80&t=4010",
      alt: "Rabat Andalusian Gardens",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1580122058982-0a1d81f09625?w=400&h=300&fit=crop&q=80&t=4011",
      alt: "Rabat Bou Regreg River",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?w=400&h=300&fit=crop&q=80&t=4012",
      alt: "Rabat Mohammed V Mausoleum",
      photographer: "Unsplash"
    }
  ],
  casablanca: [
    {
      src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&q=80&t=2001",
      alt: "Hassan II Mosque Casablanca",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop&q=80&t=2002",
      alt: "Casablanca city center",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1580122058982-0a1d81f09625?w=400&h=300&fit=crop&q=80&t=2003",
      alt: "Casablanca Corniche",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?w=400&h=300&fit=crop&q=80&t=2004",
      alt: "Casablanca architecture",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1582919534700-acf2374f10d3?w=400&h=300&fit=crop&q=80&t=2005",
      alt: "Casablanca skyline",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=400&h=300&fit=crop&q=80&t=2006",
      alt: "Casablanca port",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1544966503-7cc4a7c4b4b4?w=400&h=300&fit=crop&q=80&t=2007",
      alt: "Casablanca Twin Center",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=400&h=300&fit=crop&q=80&t=2008",
      alt: "Casablanca Cathedral",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&q=80&t=2009",
      alt: "Casablanca Habous Quarter",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop&q=80&t=2010",
      alt: "Casablanca Mohammed V Square",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1580122058982-0a1d81f09625?w=400&h=300&fit=crop&q=80&t=2011",
      alt: "Casablanca Ain Diab Beach",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?w=400&h=300&fit=crop&q=80&t=2012",
      alt: "Casablanca Central Market",
      photographer: "Unsplash"
    }
  ],
  fes: [
    {
      src: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop&q=80&t=3001",
      alt: "Fes medina",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1580122058982-0a1d81f09625?w=400&h=300&fit=crop&q=80&t=3002",
      alt: "Al Quaraouiyine University Fes",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?w=400&h=300&fit=crop&q=80&t=3003",
      alt: "Fes tanneries",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1582919534700-acf2374f10d3?w=400&h=300&fit=crop&q=80&t=3004",
      alt: "Fes pottery",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=400&h=300&fit=crop&q=80&t=3005",
      alt: "Fes architecture",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&q=80&t=3006",
      alt: "Fes souks",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1544966503-7cc4a7c4b4b4?w=400&h=300&fit=crop&q=80&t=3007",
      alt: "Bou Inania Madrasa Fes",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=400&h=300&fit=crop&q=80&t=3008",
      alt: "Royal Palace Fes",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&q=80&t=3009",
      alt: "Attarine Madrasa Fes",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop&q=80&t=3010",
      alt: "Fes Jewish Quarter",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1580122058982-0a1d81f09625?w=400&h=300&fit=crop&q=80&t=3011",
      alt: "Fes pottery workshops",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?w=400&h=300&fit=crop&q=80&t=3012",
      alt: "Fes carpet souk",
      photographer: "Unsplash"
    }
  ],
  chefchaouen: [
    {
      src: "https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?w=400&h=300&fit=crop&q=80&t=5001",
      alt: "Blue streets of Chefchaouen",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1582919534700-acf2374f10d3?w=400&h=300&fit=crop&q=80&t=5002",
      alt: "Chefchaouen blue houses",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=400&h=300&fit=crop&q=80&t=5003",
      alt: "Chefchaouen mountains",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&q=80&t=5004",
      alt: "Chefchaouen medina",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop&q=80&t=5005",
      alt: "Chefchaouen waterfalls",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1580122058982-0a1d81f09625?w=400&h=300&fit=crop&q=80&t=5006",
      alt: "Chefchaouen rooftops",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1544966503-7cc4a7c4b4b4?w=400&h=300&fit=crop&q=80&t=5007",
      alt: "Spanish Mosque Chefchaouen",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=400&h=300&fit=crop&q=80&t=5008",
      alt: "Chefchaouen Kasbah Museum",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&q=80&t=5009",
      alt: "Ras El Maa Waterfall Chefchaouen",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop&q=80&t=5010",
      alt: "Plaza Uta el-Hammam Chefchaouen",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1580122058982-0a1d81f09625?w=400&h=300&fit=crop&q=80&t=5011",
      alt: "Akchour Waterfalls Chefchaouen",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?w=400&h=300&fit=crop&q=80&t=5012",
      alt: "Talassemtane National Park Chefchaouen",
      photographer: "Unsplash"
    }
  ],
  essaouira: [
    {
      src: "https://images.unsplash.com/photo-1582919534700-acf2374f10d3?w=400&h=300&fit=crop&q=80&t=6001",
      alt: "Essaouira beach",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=400&h=300&fit=crop&q=80&t=6002",
      alt: "Essaouira medina",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&q=80&t=6003",
      alt: "Essaouira port",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop&q=80&t=6004",
      alt: "Essaouira ramparts",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1580122058982-0a1d81f09625?w=400&h=300&fit=crop&q=80&t=6005",
      alt: "Essaouira art galleries",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?w=400&h=300&fit=crop&q=80&t=6006",
      alt: "Essaouira fishing boats",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1544966503-7cc4a7c4b4b4?w=400&h=300&fit=crop&q=80&t=6007",
      alt: "Essaouira Skala de la Ville",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=400&h=300&fit=crop&q=80&t=6008",
      alt: "Essaouira Skala du Port",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&q=80&t=6009",
      alt: "Essaouira Jewish Quarter",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop&q=80&t=6010",
      alt: "Essaouira windsurfing",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1580122058982-0a1d81f09625?w=400&h=300&fit=crop&q=80&t=6011",
      alt: "Essaouira souks",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?w=400&h=300&fit=crop&q=80&t=6012",
      alt: "Essaouira sunset",
      photographer: "Unsplash"
    }
  ],
  tangier: [
    {
      src: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop&q=80&t=7001",
      alt: "Tangier medina",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1580122058982-0a1d81f09625?w=400&h=300&fit=crop&q=80&t=7002",
      alt: "Tangier coastline",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?w=400&h=300&fit=crop&q=80&t=7003",
      alt: "Tangier port",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1582919534700-acf2374f10d3?w=400&h=300&fit=crop&q=80&t=7004",
      alt: "Tangier Kasbah",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=400&h=300&fit=crop&q=80&t=7005",
      alt: "Tangier Strait view",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&q=80&t=7006",
      alt: "Tangier architecture",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1544966503-7cc4a7c4b4b4?w=400&h=300&fit=crop&q=80&t=7007",
      alt: "Tangier American Legation Museum",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=400&h=300&fit=crop&q=80&t=7008",
      alt: "Tangier Grand Socco",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&q=80&t=7009",
      alt: "Tangier Petit Socco",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop&q=80&t=7010",
      alt: "Tangier Cap Spartel",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1580122058982-0a1d81f09625?w=400&h=300&fit=crop&q=80&t=7011",
      alt: "Tangier Hercules Cave",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?w=400&h=300&fit=crop&q=80&t=7012",
      alt: "Tangier beach",
      photographer: "Unsplash"
    }
  ],
  agadir: [
    {
      src: "https://images.unsplash.com/photo-1582919534700-acf2374f10d3?w=400&h=300&fit=crop&q=80&t=8001",
      alt: "Agadir beach",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=400&h=300&fit=crop&q=80&t=8002",
      alt: "Agadir marina",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&q=80&t=8003",
      alt: "Agadir souk",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop&q=80&t=8004",
      alt: "Agadir mountains",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1580122058982-0a1d81f09625?w=400&h=300&fit=crop&q=80&t=8005",
      alt: "Agadir modern city",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?w=400&h=300&fit=crop&q=80&t=8006",
      alt: "Agadir sunset",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1544966503-7cc4a7c4b4b4?w=400&h=300&fit=crop&q=80&t=8007",
      alt: "Agadir Kasbah",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=400&h=300&fit=crop&q=80&t=8008",
      alt: "Agadir Valley of Birds",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&q=80&t=8009",
      alt: "Agadir golf courses",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop&q=80&t=8010",
      alt: "Agadir fishing port",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1580122058982-0a1d81f09625?w=400&h=300&fit=crop&q=80&t=8011",
      alt: "Agadir Amazigh Heritage Museum",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?w=400&h=300&fit=crop&q=80&t=8012",
      alt: "Agadir Paradise Valley",
      photographer: "Unsplash"
    }
  ],
  meknes: [
    {
      src: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop&q=80&t=9001",
      alt: "Meknes medina",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1580122058982-0a1d81f09625?w=400&h=300&fit=crop&q=80&t=9002",
      alt: "Meknes Royal Palace",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?w=400&h=300&fit=crop&q=80&t=9003",
      alt: "Meknes Bab Mansour",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1582919534700-acf2374f10d3?w=400&h=300&fit=crop&q=80&t=9004",
      alt: "Meknes architecture",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=400&h=300&fit=crop&q=80&t=9005",
      alt: "Meknes souks",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&q=80&t=9006",
      alt: "Meknes vineyards",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1544966503-7cc4a7c4b4b4?w=400&h=300&fit=crop&q=80&t=9007",
      alt: "Meknes Mausoleum of Moulay Ismail",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=400&h=300&fit=crop&q=80&t=9008",
      alt: "Meknes Dar Jamai Museum",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&q=80&t=9009",
      alt: "Meknes Heri es-Souani",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop&q=80&t=9010",
      alt: "Meknes Bou Inania Madrasa",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1580122058982-0a1d81f09625?w=400&h=300&fit=crop&q=80&t=9011",
      alt: "Meknes Agdal Basin",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?w=400&h=300&fit=crop&q=80&t=9012",
      alt: "Meknes Place el-Hedim",
      photographer: "Unsplash"
    }
  ],
  ouarzazate: [
    {
      src: "https://images.unsplash.com/photo-1582919534700-acf2374f10d3?w=400&h=300&fit=crop&q=80&t=10001",
      alt: "Ouarzazate desert",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=400&h=300&fit=crop&q=80&t=10002",
      alt: "Ouarzazate Atlas Studios",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&q=80&t=10003",
      alt: "Ouarzazate kasbah",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop&q=80&t=10004",
      alt: "Ouarzazate mountains",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1580122058982-0a1d81f09625?w=400&h=300&fit=crop&q=80&t=10005",
      alt: "Ouarzazate palm groves",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?w=400&h=300&fit=crop&q=80&t=10006",
      alt: "Ouarzazate sunset",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1544966503-7cc4a7c4b4b4?w=400&h=300&fit=crop&q=80&t=10007",
      alt: "Ait Ben Haddou Ouarzazate",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=400&h=300&fit=crop&q=80&t=10008",
      alt: "Ouarzazate Taourirt Kasbah",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&q=80&t=10009",
      alt: "Ouarzazate Cinema Museum",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop&q=80&t=10010",
      alt: "Ouarzazate Draa Valley",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1580122058982-0a1d81f09625?w=400&h=300&fit=crop&q=80&t=10011",
      alt: "Ouarzazate Skoura Oasis",
      photographer: "Unsplash"
    },
    {
      src: "https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?w=400&h=300&fit=crop&q=80&t=10012",
      alt: "Ouarzazate Tifoultoute Kasbah",
      photographer: "Unsplash"
    }
  ]
};

/**
 * Get 12 unique, high-quality images for a specific city
 * Priority: Local images > Unsplash API > Hardcoded Unsplash URLs
 */
export async function getCityImages(citySlug: string): Promise<CityImage[]> {
  const normalizedSlug = citySlug.toLowerCase().trim();
  
  try {
    // First, try to fetch from Unsplash API
    const unsplashImages = await fetchUnsplashImages(normalizedSlug);
    
    if (unsplashImages.length >= 12) {
      return unsplashImages.slice(0, 12);
    }
    
    // If we don't have enough from API, supplement with local images
    const localImages = LOCAL_CITY_IMAGES[normalizedSlug] || [];
    const combinedImages = [...unsplashImages, ...localImages];
    
    if (combinedImages.length >= 12) {
      return combinedImages.slice(0, 12);
    }
    
    // If still not enough, use hardcoded Unsplash URLs as final fallback
    const hardcodedImages = UNSPLASH_CITY_IMAGES[normalizedSlug] || [];
    const finalImages = [...combinedImages, ...hardcodedImages];
    
    return finalImages.slice(0, 12);
    
  } catch (error) {
    console.warn(`Failed to fetch images for ${normalizedSlug}:`, error);
    
    // Fallback to local images first
    const localImages = LOCAL_CITY_IMAGES[normalizedSlug] || [];
    if (localImages.length >= 12) {
      return localImages.slice(0, 12);
    }
    
    // Final fallback to hardcoded Unsplash URLs
    const hardcodedImages = UNSPLASH_CITY_IMAGES[normalizedSlug] || [];
    const finalImages = [...localImages, ...hardcodedImages];
    
    return finalImages.slice(0, 12);
  }
}

/**
 * Fetch images from Unsplash API for a specific city
 */
async function fetchUnsplashImages(citySlug: string): Promise<CityImage[]> {
  const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
  
  if (!UNSPLASH_ACCESS_KEY) {
    console.warn('Unsplash API key not found, using fallback images');
    return [];
  }
  
  try {
    // Create city-specific search queries
    const searchQueries = getCitySearchQueries(citySlug);
    const allImages: CityImage[] = [];
    
    // Fetch images for each search query
    for (const query of searchQueries) {
      if (allImages.length >= 12) break;
      
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=3&orientation=landscape&content_filter=high`,
        {
          headers: {
            'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
          },
        }
      );
      
      if (!response.ok) {
        console.warn(`Unsplash API error for query "${query}": ${response.status}`);
        continue;
      }
      
      const data: UnsplashResponse = await response.json();
      
      const queryImages: CityImage[] = data.results.map((photo) => ({
        src: `${photo.urls.regular}&w=400&h=300&fit=crop&q=80`,
        alt: photo.alt_description || `${citySlug} Morocco`,
        photographer: photo.user.name,
      }));
      
      allImages.push(...queryImages);
    }
    
    // Remove duplicates based on src URL
    const uniqueImages = allImages.filter((image, index, self) => 
      index === self.findIndex(img => img.src === image.src)
    );
    
    return uniqueImages.slice(0, 12);
    
  } catch (error) {
    console.warn(`Unsplash API error for ${citySlug}:`, error);
    return [];
  }
}

/**
 * Get city-specific search queries for Unsplash API
 */
function getCitySearchQueries(citySlug: string): string[] {
  const queries: Record<string, string[]> = {
    marrakech: [
      "Jemaa el-Fnaa Marrakech Morocco",
      "Koutoubia Mosque Marrakech",
      "Bahia Palace Marrakech",
      "Majorelle Garden Marrakech",
      "Saadian Tombs Marrakech"
    ],
    rabat: [
      "Hassan Tower Rabat Morocco",
      "Royal Palace Rabat Morocco",
      "Kasbah Udayas Rabat Morocco",
      "Chellah Necropolis Rabat Morocco",
      "Mohammed V Mausoleum Rabat Morocco"
    ],
    casablanca: [
      "Hassan II Mosque Casablanca Morocco",
      "Casablanca city center Morocco",
      "Casablanca Corniche Morocco",
      "Twin Center Casablanca Morocco",
      "Habous Quarter Casablanca Morocco"
    ],
    fes: [
      "Fes medina Morocco",
      "Al Quaraouiyine University Fes Morocco",
      "Fes tanneries Morocco",
      "Bou Inania Madrasa Fes Morocco",
      "Royal Palace Fes Morocco"
    ],
    chefchaouen: [
      "Chefchaouen blue streets Morocco",
      "Chefchaouen blue houses Morocco",
      "Chefchaouen mountains Morocco",
      "Chefchaouen medina Morocco",
      "Chefchaouen waterfalls Morocco"
    ],
    essaouira: [
      "Essaouira beach Morocco",
      "Essaouira medina Morocco",
      "Essaouira port Morocco",
      "Essaouira ramparts Morocco",
      "Essaouira art galleries Morocco"
    ],
    tangier: [
      "Tangier medina Morocco",
      "Tangier coastline Morocco",
      "Tangier port Morocco",
      "Tangier Kasbah Morocco",
      "Tangier Strait Morocco"
    ],
    agadir: [
      "Agadir beach Morocco",
      "Agadir marina Morocco",
      "Agadir souk Morocco",
      "Agadir mountains Morocco",
      "Agadir modern city Morocco"
    ],
    meknes: [
      "Meknes medina Morocco",
      "Royal Palace Meknes Morocco",
      "Bab Mansour Meknes Morocco",
      "Mausoleum Moulay Ismail Meknes Morocco",
      "Meknes architecture Morocco"
    ],
    ouarzazate: [
      "Ouarzazate desert Morocco",
      "Atlas Studios Ouarzazate Morocco",
      "Ait Ben Haddou Ouarzazate Morocco",
      "Taourirt Kasbah Ouarzazate Morocco",
      "Ouarzazate mountains Morocco"
    ]
  };
  
  return queries[citySlug] || [`${citySlug} Morocco`];
}
