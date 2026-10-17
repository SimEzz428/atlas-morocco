import { PLACES, type Place } from "./places";

export type { Place };

export type Neighborhood = {
  name: string;
  description: string;
  highlights: string[];
};

export type Itinerary = {
  duration: number; // in days
  title: string;
  description: string;
  places: string[]; // place IDs
};

export type City = {
  id: string;
  name: string;
  slug: string;
  lat: number;
  lon: number;
  description: string;
  bestTimeToVisit: string;
  safetyTips: string[];
  etiquetteTips: string[];
  neighborhoods: Neighborhood[];
  places: Place[];
  itineraries: Itinerary[];
  practicalInfo: {
    gettingAround: string;
    simWifi: string;
    currency: string;
    emergencyNumbers: string[];
  };
};

const CITY_DATA: Omit<City, "places">[] = [
  {
    id: "marrakech",
    name: "Marrakech",
    slug: "marrakech",
    lat: 31.6295,
    lon: -7.9811,
    description: "The Red City, Morocco's most vibrant destination where ancient medinas meet modern luxury. Famous for its bustling souks, stunning palaces, and the iconic Jemaa el-Fnaa square.",
    bestTimeToVisit: "March-May and September-November for pleasant weather. Avoid July-August due to extreme heat.",
    safetyTips: ["Be cautious in crowded areas, especially Jemaa el-Fnaa at night", "Keep valuables secure and avoid displaying expensive items", "Use official guides for desert tours and excursions", "Stay hydrated and wear sunscreen during hot months"],
    etiquetteTips: ["Dress modestly, especially when visiting mosques and religious sites", "Learn basic Arabic greetings - locals appreciate the effort", "Bargain respectfully in souks - it's part of the culture", "Ask permission before photographing people, especially women"],
    neighborhoods: [
      {
        name: "Medina (Old City)",
        description: "The historic heart of Marrakech, surrounded by ancient walls",
        highlights: ["Jemaa el-Fnaa", "Souks", "Historic Riads", "Traditional Architecture"]
      },
      {
        name: "Gueliz (New City)",
        description: "Modern district with restaurants, shops, and contemporary amenities",
        highlights: ["Modern Restaurants", "Shopping Centers", "Art Galleries", "Nightlife"]
      },
      {
        name: "Hivernage",
        description: "Upscale residential area with luxury hotels and spas",
        highlights: ["Luxury Hotels", "High-End Spas", "Fine Dining", "Golf Courses"]
      }
    ],
    itineraries: [
      {
        duration: 1,
        title: "Marrakech in One Day",
        description: "Essential Marrakech highlights for a perfect day trip",
        places: ["jemaa-el-fnaa", "koutoubia-mosque", "bahia-palace", "jardin-majorelle", "souk-semmarine"]
      },
      {
        duration: 3,
        title: "Marrakech Explorer",
        description: "Comprehensive 3-day itinerary covering all major attractions",
        places: ["jemaa-el-fnaa", "koutoubia-mosque", "bahia-palace", "jardin-majorelle", "saadian-tombs", "el-badi-palace", "marrakech-museum", "menara-gardens", "le-jardin-secret"]
      },
      {
        duration: 5,
        title: "Marrakech & Beyond",
        description: "Extended stay including day trips and hidden gems",
        places: ["jemaa-el-fnaa", "koutoubia-mosque", "bahia-palace", "jardin-majorelle", "saadian-tombs", "el-badi-palace", "marrakech-museum", "menara-gardens", "le-jardin-secret", "dar-si-said-museum", "atlas-mountains-daytrip", "agafay-desert", "palmeraie"]
      }
    ],
    practicalInfo: {
      gettingAround: "Walking in the medina, taxis for longer distances. Grand taxis for intercity travel.",
      simWifi: "Maroc Telecom, Orange, and Inwi offer tourist SIM cards. Most hotels and cafés have WiFi.",
      currency: "Moroccan Dirham (MAD). ATMs widely available. Credit cards accepted in hotels and restaurants.",
      emergencyNumbers: ["Police: 19", "Medical: 15", "Fire: 15", "Tourist Police: 0524-38-46-01"]
    }
  },
  {
    id: "fes",
    name: "Fès",
    slug: "fes",
    lat: 34.033,
    lon: -4.983,
    description: "Morocco's spiritual and intellectual capital, home to the world's oldest university and most authentic medina.",
    bestTimeToVisit: "April-June and September-November for comfortable weather and fewer crowds.",
    safetyTips: ["Be cautious in the medina's narrow alleys, especially at night", "Use official guides for tannery visits", "Keep valuables secure in crowded areas"],
    etiquetteTips: ["Dress conservatively, especially in religious areas", "Respect prayer times and mosque etiquette", "Learn basic Arabic greetings"],
    neighborhoods: [
      {
        name: "Fès el-Bali",
        description: "The ancient medina, UNESCO World Heritage site",
        highlights: ["Medersas", "Tanneries", "Traditional Souks", "Historic Architecture"]
      },
      {
        name: "Fès el-Jdid",
        description: "Newer medina with royal palaces",
        highlights: ["Royal Palace", "Jewish Quarter", "Modern Amenities"]
      }
    ],
    itineraries: [
      {
        duration: 1,
        title: "Fès in One Day",
        description: "Essential Fès highlights",
        places: ["bab-bou-jeloud", "medersa-bou-inania", "chouara-tannery", "al-quaraouiyine-university", "neijarine-foundouk"]
      },
      {
        duration: 2,
        title: "Fès Cultural Explorer",
        description: "Comprehensive 2-day itinerary covering all major cultural sites",
        places: ["bab-bou-jeloud", "medersa-bou-inania", "chouara-tannery", "al-quaraouiyine-university", "dar-batha-museum", "neijarine-foundouk", "fes-pottery-cooperative", "royal-palace-fes", "mellah-fes", "borj-nord"]
      },
      {
        duration: 3,
        title: "Fès Complete Experience",
        description: "Extended stay including hidden gems and local experiences",
        places: ["bab-bou-jeloud", "medersa-bou-inania", "chouara-tannery", "al-quaraouiyine-university", "dar-batha-museum", "neijarine-foundouk", "fes-pottery-cooperative", "cafe-clock-fes", "riad-idrissy", "fes-el-jdid", "royal-palace-fes", "mellah-fes", "borj-nord", "souk-el-henna", "zaouia-moulay-idriss"]
      }
    ],
    practicalInfo: {
      gettingAround: "Walking in medina, taxis for longer distances",
      simWifi: "Tourist SIM cards available, WiFi in hotels",
      currency: "Moroccan Dirham (MAD)",
      emergencyNumbers: ["Police: 19", "Medical: 15"]
    }
  },
  {
    id: "essaouira",
    name: "Essaouira",
    slug: "essaouira",
    lat: 31.51,
    lon: -9.77,
    description: "A charming coastal town known for its laid-back atmosphere, fresh seafood, and artistic community.",
    bestTimeToVisit: "Year-round destination, best weather April-October.",
    safetyTips: ["Be cautious on windy days near the port", "Keep valuables secure on the beach"],
    etiquetteTips: ["Respect local fishing traditions", "Dress modestly in the medina"],
    neighborhoods: [
      {
        name: "Medina",
        description: "UNESCO World Heritage medina with whitewashed buildings",
        highlights: ["Art Galleries", "Cafés", "Traditional Architecture"]
      },
      {
        name: "Port Area",
        description: "Working fishing port with fresh seafood",
        highlights: ["Fish Market", "Harbor Views", "Fresh Seafood"]
      }
    ],
    itineraries: [
      {
        duration: 1,
        title: "Essaouira Coastal Escape",
        description: "Perfect day trip to Morocco's artistic coastal gem",
        places: ["sqala-du-port", "essaouira-medina", "fish-market", "essaouira-beach", "cafe-taros"]
      },
      {
        duration: 2,
        title: "Essaouira Art & Culture",
        description: "Comprehensive 2-day itinerary exploring art, history, and coastal beauty",
        places: ["sqala-du-port", "essaouira-medina", "art-galleries", "fish-market", "essaouira-beach", "skala-de-la-ville", "sidi-mohammed-ben-abdallah-museum", "woodworking-cooperative", "essaouira-port"]
      },
      {
        duration: 3,
        title: "Essaouira Complete Experience",
        description: "Extended stay including hidden gems and local experiences",
        places: ["sqala-du-port", "essaouira-medina", "art-galleries", "fish-market", "essaouira-beach", "mellah-essaouira", "le-chalet-de-la-plage", "cafe-taros", "riad-mimouna", "skala-de-la-ville", "sidi-mohammed-ben-abdallah-museum", "woodworking-cooperative", "essaouira-mogador-island", "essaouira-port", "essaouira-souk"]
      }
    ],
    practicalInfo: {
      gettingAround: "Walking in medina, taxis available",
      simWifi: "Tourist SIM cards, WiFi in hotels",
      currency: "Moroccan Dirham (MAD)",
      emergencyNumbers: ["Police: 19", "Medical: 15"]
    }
  },
  {
    id: "casablanca",
    name: "Casablanca",
    slug: "casablanca",
    lat: 33.5731,
    lon: -7.5898,
    description: "Morocco's economic capital and largest city, blending modern architecture with traditional charm.",
    bestTimeToVisit: "Year-round, best weather April-June and September-November.",
    safetyTips: ["Be cautious in crowded areas", "Use official taxis", "Keep valuables secure"],
    etiquetteTips: ["Dress appropriately for business districts", "Respect local customs"],
    neighborhoods: [
      {
        name: "City Center",
        description: "Modern business district with contemporary architecture",
        highlights: ["Business Centers", "Modern Restaurants", "Shopping"]
      },
      {
        name: "Corniche",
        description: "Coastal area with beaches and entertainment",
        highlights: ["Beaches", "Nightlife", "Restaurants"]
      }
    ],
    itineraries: [
      {
        duration: 1,
        title: "Casablanca Modern & Traditional",
        description: "Essential Casablanca experience blending modern and traditional",
        places: ["hassan-ii-mosque", "casablanca-medina", "mahkama-du-pacha", "corniche-ain-diab", "rick-cafe"]
      },
      {
        duration: 2,
        title: "Casablanca Business & Culture",
        description: "Comprehensive 2-day itinerary exploring business district and cultural sites",
        places: ["hassan-ii-mosque", "casablanca-medina", "mahkama-du-pacha", "habous-quarter", "royal-palace-casablanca", "casablanca-twin-center", "morocco-mall", "villa-des-arts", "parc-de-la-ligue-arabe"]
      },
      {
        duration: 3,
        title: "Casablanca Complete Experience",
        description: "Extended stay including hidden gems and local experiences",
        places: ["hassan-ii-mosque", "casablanca-medina", "mahkama-du-pacha", "habous-quarter", "royal-palace-casablanca", "casablanca-twin-center", "morocco-mall", "rick-cafe", "le-cabestan", "cafe-maure", "villa-des-arts", "parc-de-la-ligue-arabe", "casablanca-cathedral", "central-market", "corniche-ain-diab"]
      }
    ],
    practicalInfo: {
      gettingAround: "Taxis, buses, walking in city center",
      simWifi: "Tourist SIM cards, WiFi widely available",
      currency: "Moroccan Dirham (MAD)",
      emergencyNumbers: ["Police: 19", "Medical: 15"]
    }
  },
  {
    id: "rabat",
    name: "Rabat",
    slug: "rabat",
    lat: 34.0209,
    lon: -6.8416,
    description: "Morocco's capital city, combining historic sites with modern government buildings.",
    bestTimeToVisit: "Year-round, pleasant climate throughout the year.",
    safetyTips: ["Be cautious in crowded areas", "Use official guides for historic sites"],
    etiquetteTips: ["Dress appropriately for government areas", "Respect local customs"],
    neighborhoods: [
      {
        name: "Medina",
        description: "Historic medina with traditional architecture",
        highlights: ["Traditional Souks", "Historic Architecture"]
      },
      {
        name: "Hassan District",
        description: "Modern government and business area",
        highlights: ["Government Buildings", "Modern Architecture"]
      }
    ],
    itineraries: [
      {
        duration: 1,
        title: "Rabat Capital Tour",
        description: "Essential Rabat experience",
        places: ["kasbah-udayas", "hassan-tower"]
      }
    ],
    practicalInfo: {
      gettingAround: "Taxis, buses, walking",
      simWifi: "Tourist SIM cards, WiFi available",
      currency: "Moroccan Dirham (MAD)",
      emergencyNumbers: ["Police: 19", "Medical: 15"]
    }
  },
  {
    id: "chefchaouen",
    name: "Chefchaouen",
    slug: "chefchaouen",
    lat: 35.1688,
    lon: -5.2636,
    description: "The famous 'Blue City' nestled in the Rif Mountains, known for its stunning blue-washed buildings.",
    bestTimeToVisit: "April-June and September-November for comfortable weather.",
    safetyTips: ["Be cautious on steep streets", "Wear comfortable walking shoes"],
    etiquetteTips: ["Respect local customs in this conservative town", "Ask permission before photographing locals"],
    neighborhoods: [
      {
        name: "Medina",
        description: "The famous blue-washed medina",
        highlights: ["Blue Streets", "Traditional Architecture", "Artisan Shops"]
      },
      {
        name: "Spanish Quarter",
        description: "Area with Spanish colonial influence",
        highlights: ["Spanish Architecture", "Cafés"]
      }
    ],
    itineraries: [
      {
        duration: 1,
        title: "Chefchaouen Blue Experience",
        description: "Perfect day in the Blue City",
        places: ["blue-streets", "spanish-mosque-viewpoint"]
      }
    ],
    practicalInfo: {
      gettingAround: "Walking in medina, taxis available",
      simWifi: "Tourist SIM cards, WiFi in hotels",
      currency: "Moroccan Dirham (MAD)",
      emergencyNumbers: ["Police: 19", "Medical: 15"]
    }
  },
  {
    id: "agadir",
    name: "Agadir",
    slug: "agadir",
    lat: 30.4278,
    lon: -9.5981,
    description: "Morocco's premier beach destination with modern resorts and year-round sunshine.",
    bestTimeToVisit: "Year-round beach destination, best weather October-April.",
    safetyTips: ["Be cautious on the beach at night", "Use sunscreen and stay hydrated"],
    etiquetteTips: ["Respect beach etiquette", "Dress appropriately in town"],
    neighborhoods: [
      {
        name: "Beach Area",
        description: "Modern beachfront with resorts and restaurants",
        highlights: ["Beaches", "Resorts", "Water Sports"]
      },
      {
        name: "City Center",
        description: "Modern city center with shopping and dining",
        highlights: ["Shopping", "Restaurants", "Entertainment"]
      }
    ],
    itineraries: [
      {
        duration: 1,
        title: "Agadir Beach Day",
        description: "Perfect beach getaway",
        places: ["agadir-beach", "agadir-oufella"]
      }
    ],
    practicalInfo: {
      gettingAround: "Taxis, buses, walking",
      simWifi: "Tourist SIM cards, WiFi in resorts",
      currency: "Moroccan Dirham (MAD)",
      emergencyNumbers: ["Police: 19", "Medical: 15"]
    }
  },
  {
    id: "ouarzazate",
    name: "Ouarzazate",
    slug: "ouarzazate",
    lat: 30.9335,
    lon: -6.937,
    description: "The 'Hollywood of Morocco' and gateway to the Sahara Desert.",
    bestTimeToVisit: "October-April for comfortable desert weather.",
    safetyTips: ["Be prepared for desert conditions", "Use official guides for desert tours"],
    etiquetteTips: ["Respect local Berber customs", "Dress appropriately for desert climate"],
    neighborhoods: [
      {
        name: "City Center",
        description: "Modern city with hotels and restaurants",
        highlights: ["Hotels", "Restaurants", "Tour Agencies"]
      },
      {
        name: "Atlas Studios",
        description: "Famous film studios and sets",
        highlights: ["Film Sets", "Studios", "Museums"]
      }
    ],
    itineraries: [
      {
        duration: 1,
        title: "Ouarzazate Film Tour",
        description: "Hollywood in Morocco",
        places: ["ait-ben-haddou", "atlas-studios"]
      }
    ],
    practicalInfo: {
      gettingAround: "Taxis, tour buses",
      simWifi: "Tourist SIM cards, WiFi in hotels",
      currency: "Moroccan Dirham (MAD)",
      emergencyNumbers: ["Police: 19", "Medical: 15"]
    }
  },
  {
    id: "tangier",
    name: "Tangier",
    slug: "tangier",
    lat: 35.7595,
    lon: -5.834,
    description: "Morocco's gateway to Europe, a cosmopolitan city with rich history and culture.",
    bestTimeToVisit: "April-October for pleasant weather and ferry connections.",
    safetyTips: ["Be cautious in crowded port areas", "Use official taxis"],
    etiquetteTips: ["Respect local customs", "Dress appropriately"],
    neighborhoods: [
      {
        name: "Medina",
        description: "Historic medina with traditional architecture",
        highlights: ["Traditional Architecture", "Souks", "Historic Sites"]
      },
      {
        name: "Port Area",
        description: "Modern port with ferry connections to Europe",
        highlights: ["Ferry Terminal", "Modern Facilities"]
      }
    ],
    itineraries: [
      {
        duration: 1,
        title: "Tangier Gateway Tour",
        description: "Essential Tangier experience",
        places: ["tangier-medina", "cap-spartel"]
      }
    ],
    practicalInfo: {
      gettingAround: "Taxis, buses, walking",
      simWifi: "Tourist SIM cards, WiFi available",
      currency: "Moroccan Dirham (MAD)",
      emergencyNumbers: ["Police: 19", "Medical: 15"]
    }
  },
  {
    id: "meknes",
    name: "Meknes",
    slug: "meknes",
    lat: 33.8935,
    lon: -5.5473,
    description: "One of Morocco's four imperial cities with impressive historical monuments.",
    bestTimeToVisit: "April-June and September-November for comfortable weather.",
    safetyTips: ["Be cautious in crowded areas", "Use official guides for historic sites"],
    etiquetteTips: ["Respect local customs", "Dress appropriately"],
    neighborhoods: [
      {
        name: "Medina",
        description: "Historic medina with traditional architecture",
        highlights: ["Traditional Architecture", "Historic Sites"]
      },
      {
        name: "Imperial City",
        description: "Area with royal palaces and monuments",
        highlights: ["Royal Palaces", "Historic Monuments"]
      }
    ],
    itineraries: [
      {
        duration: 1,
        title: "Meknes Imperial Tour",
        description: "Essential Meknes experience",
        places: ["meknes-medina", "bab-mansour"]
      }
    ],
    practicalInfo: {
      gettingAround: "Taxis, buses, walking",
      simWifi: "Tourist SIM cards, WiFi available",
      currency: "Moroccan Dirham (MAD)",
      emergencyNumbers: ["Police: 19", "Medical: 15"]
    }
  }
];

export const CITIES: City[] = CITY_DATA.map((city) => ({ ...city, places: PLACES[city.slug] ?? [] }));

export function getCity(slug: string): City | undefined {
  return CITIES.find((city) => city.slug === slug.toLowerCase());
}
