// src/server/db.ts
export type Place = {
  id: string;
  name: string;
  category: "food" | "architecture" | "culture" | "nature" | "shopping" | "view" | "museum" | "garden" | "mosque" | "market" | "beach" | "palace" | "cafe" | "restaurant" | "viewpoint" | "medina" | "souk" | "daytrip" | "monument" | "historical" | "entertainment" | "adventure" | "spiritual" | "art" | "nightlife" | "wellness" | "family" | "romantic" | "photography" | "local-life";
  description: string;
  lat: number;
  lon: number;
  visitTime: number; // in minutes
  bestTime: "morning" | "afternoon" | "evening" | "anytime";
  cost: string; // e.g., "50 MAD", "Free", "—"
  accessibility: string;
  tags: string[]; // e.g., ["kid-friendly", "scenic", "hidden-gem"]
  blurb?: string;
  imageUrl?: string; // High-quality image URL
  rating?: number; // 1-5 stars
  highlights?: string[]; // Key features
  tips?: string[]; // Visiting tips
  nearbyPlaces?: string[]; // IDs of nearby places
};

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

export const CITIES: City[] = [
  {
    id: "marrakech",
    name: "Marrakech",
    slug: "marrakech",
    lat: 31.6295,
    lon: -7.9811,
    description: "The Red City, Morocco's most vibrant destination where ancient medinas meet modern luxury. Famous for its bustling souks, stunning palaces, and the iconic Jemaa el-Fnaa square.",
    bestTimeToVisit: "March-May and September-November for pleasant weather. Avoid July-August due to extreme heat.",
    safetyTips: [
      "Be cautious in crowded areas, especially Jemaa el-Fnaa at night",
      "Keep valuables secure and avoid displaying expensive items",
      "Use official guides for desert tours and excursions",
      "Stay hydrated and wear sunscreen during hot months"
    ],
    etiquetteTips: [
      "Dress modestly, especially when visiting mosques and religious sites",
      "Learn basic Arabic greetings - locals appreciate the effort",
      "Bargain respectfully in souks - it's part of the culture",
      "Ask permission before photographing people, especially women"
    ],
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
    places: [
      {
        id: "jemaa-el-fnaa",
        name: "Jemaa el-Fnaa",
        category: "market",
        description: "The beating heart of Marrakech, this UNESCO World Heritage square comes alive with food stalls, street performers, and traditional entertainment.",
        lat: 31.62542,
        lon: -7.98907,
        visitTime: 120,
        bestTime: "evening",
        cost: "Free (food 20-50 MAD)",
        accessibility: "Wheelchair accessible main areas, some stalls may be challenging",
        tags: ["must-see", "cultural", "photogenic"],
        blurb: "Experience the magic of Morocco's most famous square"
      },
      {
        id: "jardin-majorelle",
        name: "Jardin Majorelle",
        category: "garden",
        description: "A stunning botanical garden created by French painter Jacques Majorelle, featuring vibrant blue buildings and exotic plants.",
        lat: 31.64248,
        lon: -8.00314,
        visitTime: 90,
        bestTime: "morning",
        cost: "70 MAD",
        accessibility: "Fully accessible with paved paths",
        tags: ["instagram-worthy", "peaceful", "artistic"],
        blurb: "A peaceful oasis of color and nature"
      },
      {
        id: "bahia-palace",
        name: "Bahia Palace",
        category: "palace",
        description: "A masterpiece of Moroccan architecture showcasing intricate tilework, carved cedar ceilings, and beautiful courtyards.",
        lat: 31.6258,
        lon: -7.9811,
        visitTime: 60,
        bestTime: "morning",
        cost: "70 MAD",
        accessibility: "Mostly accessible, some narrow passages",
        tags: ["architectural", "historical", "photogenic"],
        blurb: "Step into the opulent world of Moroccan royalty"
      },
      {
        id: "koutoubia-mosque",
        name: "Koutoubia Mosque",
        category: "mosque",
        description: "Marrakech's iconic 12th-century mosque with a 77-meter minaret, visible from throughout the city.",
        lat: 31.6244,
        lon: -7.9936,
        visitTime: 30,
        bestTime: "anytime",
        cost: "Free (exterior only)",
        accessibility: "Exterior viewing only for non-Muslims",
        tags: ["landmark", "architectural", "spiritual"],
        blurb: "The symbol of Marrakech's skyline"
      },
      {
        id: "saadian-tombs",
        name: "Saadian Tombs",
        category: "culture",
        description: "16th-century royal burial ground featuring exquisite tilework and peaceful gardens.",
        lat: 31.6258,
        lon: -7.9811,
        visitTime: 45,
        bestTime: "morning",
        cost: "70 MAD",
        accessibility: "Fully accessible",
        tags: ["historical", "peaceful", "architectural"],
        blurb: "Discover hidden royal treasures"
      },
      {
        id: "el-badi-palace",
        name: "El Badi Palace",
        category: "palace",
        description: "Ruins of a once-magnificent palace built by Sultan Ahmad al-Mansur, now hosting cultural events.",
        lat: 31.6258,
        lon: -7.9811,
        visitTime: 60,
        bestTime: "afternoon",
        cost: "70 MAD",
        accessibility: "Partially accessible, uneven surfaces",
        tags: ["historical", "ruins", "cultural"],
        blurb: "Wander through the remains of imperial grandeur"
      },
      {
        id: "marrakech-museum",
        name: "Marrakech Museum",
        category: "museum",
        description: "Housed in a beautiful palace, showcasing Moroccan art, artifacts, and cultural exhibitions.",
        lat: 31.6258,
        lon: -7.9811,
        visitTime: 90,
        bestTime: "morning",
        cost: "50 MAD",
        accessibility: "Fully accessible",
        tags: ["educational", "cultural", "artistic"],
        blurb: "Immerse yourself in Moroccan culture and history"
      },
      {
        id: "menara-gardens",
        name: "Menara Gardens",
        category: "garden",
        description: "A peaceful olive grove with a beautiful pavilion overlooking the Atlas Mountains.",
        lat: 31.6258,
        lon: -7.9811,
        visitTime: 60,
        bestTime: "evening",
        cost: "Free",
        accessibility: "Fully accessible",
        tags: ["peaceful", "scenic", "romantic"],
        blurb: "Escape the city bustle in this serene garden"
      },
      {
        id: "le-jardin-secret",
        name: "Le Jardin Secret",
        category: "garden",
        description: "A hidden gem featuring both Islamic and exotic gardens with a historic palace.",
        lat: 31.6258,
        lon: -7.9811,
        visitTime: 75,
        bestTime: "morning",
        cost: "80 MAD",
        accessibility: "Fully accessible",
        tags: ["hidden-gem", "peaceful", "instagram-worthy"],
        blurb: "Discover Marrakech's best-kept secret"
      },
      {
        id: "dar-si-said-museum",
        name: "Dar Si Said Museum",
        category: "museum",
        description: "A beautiful palace showcasing Moroccan arts and crafts, including Berber jewelry and textiles.",
        lat: 31.6258,
        lon: -7.9811,
        visitTime: 60,
        bestTime: "morning",
        cost: "30 MAD",
        accessibility: "Mostly accessible",
        tags: ["artistic", "cultural", "crafts"],
        blurb: "Explore the finest Moroccan craftsmanship"
      },
      {
        id: "atlas-mountains-daytrip",
        name: "Atlas Mountains Day Trip",
        category: "daytrip",
        description: "Scenic mountain villages, waterfalls, and traditional Berber culture just outside the city.",
        lat: 31.6258,
        lon: -7.9811,
        visitTime: 480,
        bestTime: "morning",
        cost: "300-500 MAD",
        accessibility: "Requires good mobility for hiking",
        tags: ["nature", "adventure", "cultural"],
        blurb: "Experience authentic Berber mountain life"
      },
      {
        id: "agafay-desert",
        name: "Agafay Desert",
        category: "daytrip",
        description: "A rocky desert landscape perfect for camel rides, luxury camping, and stargazing.",
        lat: 31.6258,
        lon: -7.9811,
        visitTime: 360,
        bestTime: "afternoon",
        cost: "400-800 MAD",
        accessibility: "Camel rides may not be suitable for all",
        tags: ["desert", "adventure", "luxury"],
        blurb: "Desert adventure without leaving Marrakech"
      },
      {
        id: "riad-el-fenn",
        name: "Riad El Fenn",
        category: "restaurant",
        description: "Luxury riad with exceptional rooftop dining and stunning city views.",
        lat: 31.6258,
        lon: -7.9811,
        visitTime: 120,
        bestTime: "evening",
        cost: "200-400 MAD",
        accessibility: "Rooftop access via stairs",
        tags: ["luxury", "romantic", "fine-dining"],
        blurb: "Dine with the best views in Marrakech"
      },
      {
        id: "cafe-arabe",
        name: "Café Arabe",
        category: "restaurant",
        description: "Elegant rooftop restaurant serving Moroccan and Italian cuisine in a beautiful setting.",
        lat: 31.6258,
        lon: -7.9811,
        visitTime: 90,
        bestTime: "evening",
        cost: "150-300 MAD",
        accessibility: "Rooftop access via stairs",
        tags: ["romantic", "fusion", "rooftop"],
        blurb: "Perfect blend of Moroccan and international flavors"
      },
      {
        id: "le-grand-cafe-de-la-post",
        name: "Le Grand Café de la Poste",
        category: "restaurant",
        description: "Historic French brasserie with colonial charm and excellent French-Moroccan cuisine.",
        lat: 31.6258,
        lon: -7.9811,
        visitTime: 90,
        bestTime: "evening",
        cost: "200-350 MAD",
        accessibility: "Fully accessible",
        tags: ["historic", "french", "elegant"],
        blurb: "Step back into colonial-era Marrakech"
      },
      {
        id: "cafe-clock",
        name: "Café Clock",
        category: "cafe",
        description: "Trendy café known for camel burgers, cultural events, and rooftop views.",
        lat: 31.6258,
        lon: -7.9811,
        visitTime: 60,
        bestTime: "afternoon",
        cost: "80-150 MAD",
        accessibility: "Rooftop access via stairs",
        tags: ["trendy", "cultural", "unique"],
        blurb: "Try the famous camel burger"
      },
      {
        id: "riad-yima",
        name: "Riad Yima",
        category: "cafe",
        description: "Art gallery café owned by photographer Hassan Hajjaj, featuring vibrant pop art.",
        lat: 31.6258,
        lon: -7.9811,
        visitTime: 45,
        bestTime: "afternoon",
        cost: "60-120 MAD",
        accessibility: "Fully accessible",
        tags: ["artistic", "instagram-worthy", "cultural"],
        blurb: "Where art meets excellent coffee"
      },
      {
        id: "souk-semmarine",
        name: "Souk Semmarine",
        category: "souk",
        description: "The main shopping street in the medina, perfect for textiles, leather goods, and souvenirs.",
        lat: 31.6258,
        lon: -7.9811,
        visitTime: 120,
        bestTime: "morning",
        cost: "Variable (bargaining required)",
        accessibility: "Narrow passages, can be crowded",
        tags: ["shopping", "cultural", "authentic"],
        blurb: "The ultimate Marrakech shopping experience"
      },
      {
        id: "souk-el-kebir",
        name: "Souk El Kebir",
        category: "souk",
        description: "Traditional market specializing in spices, herbs, and traditional medicines.",
        lat: 31.6258,
        lon: -7.9811,
        visitTime: 60,
        bestTime: "morning",
        cost: "Variable",
        accessibility: "Narrow passages",
        tags: ["spices", "traditional", "authentic"],
        blurb: "Discover the scents and flavors of Morocco"
      },
      {
        id: "souk-cherratin",
        name: "Souk Cherratin",
        category: "souk",
        description: "Leather goods market where you can watch artisans craft traditional bags and shoes.",
        lat: 31.6258,
        lon: -7.9811,
        visitTime: 45,
        bestTime: "morning",
        cost: "Variable",
        accessibility: "Narrow passages",
        tags: ["leather", "artisan", "traditional"],
        blurb: "Watch master craftsmen at work"
      },
      {
        id: "kasbah-district",
        name: "Kasbah District",
        category: "culture",
        description: "Historic royal quarter with narrow streets, traditional houses, and local life.",
        lat: 31.6258,
        lon: -7.9811,
        visitTime: 90,
        bestTime: "morning",
        cost: "Free",
        accessibility: "Narrow streets, uneven surfaces",
        tags: ["authentic", "residential", "cultural"],
        blurb: "Experience authentic Marrakech residential life"
      },
      {
        id: "mellah-jewish-quarter",
        name: "Mellah (Jewish Quarter)",
        category: "culture",
        description: "Historic Jewish quarter with synagogues, cemeteries, and unique architecture.",
        lat: 31.6258,
        lon: -7.9811,
        visitTime: 60,
        bestTime: "morning",
        cost: "Free",
        accessibility: "Narrow streets",
        tags: ["historical", "multicultural", "peaceful"],
        blurb: "Explore Marrakech's Jewish heritage"
      },
      {
        id: "palmeraie",
        name: "Palmeraie",
        category: "nature",
        description: "A vast palm grove on the city's outskirts, perfect for camel rides and luxury resorts.",
        lat: 31.6258,
        lon: -7.9811,
        visitTime: 120,
        bestTime: "morning",
        cost: "100-200 MAD",
        accessibility: "Camel rides may not be suitable for all",
        tags: ["nature", "luxury", "peaceful"],
        blurb: "Escape to the palm groves"
      },
      {
        id: "ouirgane-valley",
        name: "Ouirgane Valley",
        category: "daytrip",
        description: "Beautiful mountain valley with traditional Berber villages and hiking trails.",
        lat: 31.6258,
        lon: -7.9811,
        visitTime: 360,
        bestTime: "morning",
        cost: "200-400 MAD",
        accessibility: "Requires good mobility",
        tags: ["nature", "hiking", "cultural"],
        blurb: "Discover pristine mountain beauty"
      },
      {
        id: "nomad-marrakech",
        name: "Nomad Marrakech",
        category: "restaurant",
        description: "Trendy rooftop restaurant with modern Moroccan cuisine and stunning medina views.",
        lat: 31.6258,
        lon: -7.9811,
        visitTime: 90,
        bestTime: "evening",
        cost: "200-350 MAD",
        accessibility: "Rooftop access via stairs",
        tags: ["modern", "rooftop", "fusion"],
        blurb: "Contemporary Moroccan dining with a view"
      },
      {
        id: "le-tajine",
        name: "Le Tajine",
        category: "restaurant",
        description: "Traditional Moroccan restaurant serving authentic tagines and couscous in a beautiful riad setting.",
        lat: 31.6258,
        lon: -7.9811,
        visitTime: 75,
        bestTime: "evening",
        cost: "150-250 MAD",
        accessibility: "Fully accessible",
        tags: ["traditional", "authentic", "riad"],
        blurb: "Experience authentic Moroccan flavors"
      },
      {
        id: "cafe-des-epices",
        name: "Café des Épices",
        category: "cafe",
        description: "Charming café in the spice market serving fresh mint tea and Moroccan pastries.",
        lat: 31.6258,
        lon: -7.9811,
        visitTime: 45,
        bestTime: "afternoon",
        cost: "30-60 MAD",
        accessibility: "Fully accessible",
        tags: ["traditional", "tea", "pastries"],
        blurb: "Perfect spot for mint tea and people watching"
      },
      {
        id: "marrakech-museum-photography",
        name: "Marrakech Museum of Photography",
        category: "museum",
        description: "Contemporary museum showcasing Moroccan photography and visual arts.",
        lat: 31.6258,
        lon: -7.9811,
        visitTime: 60,
        bestTime: "morning",
        cost: "50 MAD",
        accessibility: "Fully accessible",
        tags: ["art", "photography", "contemporary"],
        blurb: "Discover Morocco through photography"
      },
      {
        id: "agdal-gardens",
        name: "Agdal Gardens",
        category: "garden",
        description: "Historic royal gardens with olive groves, fruit trees, and peaceful walking paths.",
        lat: 31.6258,
        lon: -7.9811,
        visitTime: 90,
        bestTime: "morning",
        cost: "Free",
        accessibility: "Fully accessible",
        tags: ["royal", "peaceful", "historic"],
        blurb: "Royal gardens perfect for a morning stroll"
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
    safetyTips: [
      "Be cautious in the medina's narrow alleys, especially at night",
      "Use official guides for tannery visits",
      "Keep valuables secure in crowded areas"
    ],
    etiquetteTips: [
      "Dress conservatively, especially in religious areas",
      "Respect prayer times and mosque etiquette",
      "Learn basic Arabic greetings"
    ],
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
            places: [
              {
                id: "medersa-bou-inania",
                name: "Medersa Bou Inania",
                category: "architecture",
                description: "14th-century Islamic school with stunning architecture and intricate tilework.",
                lat: 34.0667,
                lon: -4.9833,
                visitTime: 60,
                bestTime: "morning",
                cost: "20 MAD",
                accessibility: "Mostly accessible",
                tags: ["architectural", "historical", "educational"],
                blurb: "Masterpiece of Islamic architecture"
              },
              {
                id: "chouara-tannery",
                name: "Chouara Tannery",
                category: "culture",
                description: "Traditional leather tannery where you can watch the ancient craft of leather making.",
                lat: 34.0667,
                lon: -4.9833,
                visitTime: 45,
                bestTime: "morning",
                cost: "Free (tips expected)",
                accessibility: "Viewing platforms available",
                tags: ["traditional", "cultural", "authentic"],
                blurb: "Step into medieval Morocco"
              },
              {
                id: "bab-bou-jeloud",
                name: "Bab Bou Jeloud",
                category: "architecture",
                description: "The iconic blue gate marking the entrance to Fès el-Bali.",
                lat: 34.0667,
                lon: -4.9833,
                visitTime: 15,
                bestTime: "anytime",
                cost: "Free",
                accessibility: "Fully accessible",
                tags: ["landmark", "photogenic", "iconic"],
                blurb: "The gateway to ancient Fès"
              },
              {
                id: "al-quaraouiyine-university",
                name: "Al Quaraouiyine University",
                category: "culture",
                description: "The world's oldest university, founded in 859 AD, still functioning today.",
                lat: 34.0667,
                lon: -4.9833,
                visitTime: 30,
                bestTime: "morning",
                cost: "Free (exterior only)",
                accessibility: "Exterior viewing only for non-Muslims",
                tags: ["historical", "educational", "unesco"],
                blurb: "The world's oldest university"
              },
              {
                id: "dar-batha-museum",
                name: "Dar Batha Museum",
                category: "museum",
                description: "Beautiful palace museum showcasing Moroccan arts, crafts, and ceramics.",
                lat: 34.0667,
                lon: -4.9833,
                visitTime: 60,
                bestTime: "morning",
                cost: "20 MAD",
                accessibility: "Fully accessible",
                tags: ["art", "cultural", "palace"],
                blurb: "Moroccan arts and crafts collection"
              },
              {
                id: "neijarine-foundouk",
                name: "Neijarine Foundouk",
                category: "culture",
                description: "Historic caravanserai with beautiful fountain and traditional architecture.",
                lat: 34.0667,
                lon: -4.9833,
                visitTime: 30,
                bestTime: "morning",
                cost: "Free",
                accessibility: "Fully accessible",
                tags: ["historical", "architectural", "peaceful"],
                blurb: "Historic trading post with stunning fountain"
              },
              {
                id: "fes-pottery-cooperative",
                name: "Fès Pottery Cooperative",
                category: "culture",
                description: "Watch traditional pottery making and purchase authentic Fès ceramics.",
                lat: 34.0667,
                lon: -4.9833,
                visitTime: 45,
                bestTime: "morning",
                cost: "Free (purchase optional)",
                accessibility: "Fully accessible",
                tags: ["artisan", "traditional", "shopping"],
                blurb: "Watch master potters at work"
              },
              {
                id: "cafe-clock-fes",
                name: "Café Clock Fès",
                category: "cafe",
                description: "Trendy café known for camel burgers and cultural events in a beautiful riad.",
                lat: 34.0667,
                lon: -4.9833,
                visitTime: 60,
                bestTime: "afternoon",
                cost: "80-150 MAD",
                accessibility: "Rooftop access via stairs",
                tags: ["trendy", "cultural", "unique"],
                blurb: "Try the famous camel burger"
              },
              {
                id: "riad-idrissy",
                name: "Riad Idrissy",
                category: "restaurant",
                description: "Elegant riad restaurant serving refined Moroccan cuisine in a beautiful setting.",
                lat: 34.0667,
                lon: -4.9833,
                visitTime: 90,
                bestTime: "evening",
                cost: "200-350 MAD",
                accessibility: "Fully accessible",
                tags: ["luxury", "traditional", "elegant"],
                blurb: "Fine dining in a historic riad"
              },
              {
                id: "fes-el-jdid",
                name: "Fès el-Jdid",
                category: "culture",
                description: "The newer medina with royal palaces and the Jewish quarter.",
                lat: 34.0667,
                lon: -4.9833,
                visitTime: 90,
                bestTime: "morning",
                cost: "Free",
                accessibility: "Mostly accessible",
                tags: ["royal", "historical", "multicultural"],
                blurb: "Explore the royal quarter"
              },
              {
                id: "royal-palace-fes",
                name: "Royal Palace Fès",
                category: "architecture",
                description: "Magnificent royal palace with stunning gates and traditional architecture.",
                lat: 34.0667,
                lon: -4.9833,
                visitTime: 30,
                bestTime: "morning",
                cost: "Free (exterior only)",
                accessibility: "Fully accessible",
                tags: ["royal", "architectural", "photogenic"],
                blurb: "Stunning royal architecture"
              },
              {
                id: "mellah-fes",
                name: "Mellah (Jewish Quarter)",
                category: "culture",
                description: "Historic Jewish quarter with synagogues, cemeteries, and unique architecture.",
                lat: 34.0667,
                lon: -4.9833,
                visitTime: 60,
                bestTime: "morning",
                cost: "Free",
                accessibility: "Narrow streets",
                tags: ["historical", "multicultural", "peaceful"],
                blurb: "Explore Fès's Jewish heritage"
              },
              {
                id: "borj-nord",
                name: "Borj Nord",
                category: "viewpoint",
                description: "Historic fortress offering panoramic views of Fès and the surrounding countryside.",
                lat: 34.0667,
                lon: -4.9833,
                visitTime: 45,
                bestTime: "evening",
                cost: "20 MAD",
                accessibility: "Requires climbing stairs",
                tags: ["scenic", "historical", "sunset"],
                blurb: "Best views of Fès"
              },
              {
                id: "souk-el-henna",
                name: "Souk el-Henna",
                category: "market",
                description: "Traditional market specializing in henna, cosmetics, and traditional medicines.",
                lat: 34.0667,
                lon: -4.9833,
                visitTime: 30,
                bestTime: "morning",
                cost: "Variable",
                accessibility: "Narrow passages",
                tags: ["traditional", "cosmetics", "authentic"],
                blurb: "Traditional cosmetics and henna"
              },
              {
                id: "zaouia-moulay-idriss",
                name: "Zaouia Moulay Idriss",
                category: "culture",
                description: "Sacred shrine dedicated to the founder of Fès, important pilgrimage site.",
                lat: 34.0667,
                lon: -4.9833,
                visitTime: 20,
                bestTime: "morning",
                cost: "Free",
                accessibility: "Exterior viewing only for non-Muslims",
                tags: ["sacred", "historical", "pilgrimage"],
                blurb: "Sacred shrine of Fès's founder"
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
    safetyTips: [
      "Be cautious on windy days near the port",
      "Keep valuables secure on the beach"
    ],
    etiquetteTips: [
      "Respect local fishing traditions",
      "Dress modestly in the medina"
    ],
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
            places: [
              {
                id: "sqala-du-port",
                name: "Sqala du Port",
                category: "view",
                description: "Historic fortifications with panoramic views of the Atlantic Ocean.",
                lat: 31.5085,
                lon: -9.7595,
                visitTime: 60,
                bestTime: "evening",
                cost: "60 MAD",
                accessibility: "Fully accessible",
                tags: ["scenic", "historical", "photogenic"],
                blurb: "Breathtaking ocean views"
              },
              {
                id: "essaouira-medina",
                name: "Essaouira Medina",
                category: "medina",
                description: "UNESCO World Heritage medina with whitewashed buildings and art galleries.",
                lat: 31.5085,
                lon: -9.7595,
                visitTime: 120,
                bestTime: "morning",
                cost: "Free",
                accessibility: "Mostly accessible",
                tags: ["cultural", "artistic", "peaceful"],
                blurb: "Artistic haven by the sea"
              },
              {
                id: "essaouira-beach",
                name: "Essaouira Beach",
                category: "beach",
                description: "Long sandy beach perfect for windsurfing, kiteboarding, and beach walks.",
                lat: 31.5085,
                lon: -9.7595,
                visitTime: 180,
                bestTime: "morning",
                cost: "Free",
                accessibility: "Fully accessible",
                tags: ["beach", "water-sports", "windy"],
                blurb: "Morocco's windsurfing capital"
              },
              {
                id: "fish-market",
                name: "Fish Market",
                category: "market",
                description: "Vibrant morning fish market where you can buy fresh seafood and watch the daily catch.",
                lat: 31.5085,
                lon: -9.7595,
                visitTime: 45,
                bestTime: "morning",
                cost: "Variable",
                accessibility: "Fully accessible",
                tags: ["fresh-seafood", "local-life", "authentic"],
                blurb: "Fresh catch of the day"
              },
              {
                id: "mellah-essaouira",
                name: "Mellah (Jewish Quarter)",
                category: "culture",
                description: "Historic Jewish quarter with synagogues and unique architecture.",
                lat: 31.5085,
                lon: -9.7595,
                visitTime: 60,
                bestTime: "morning",
                cost: "Free",
                accessibility: "Narrow streets",
                tags: ["historical", "multicultural", "peaceful"],
                blurb: "Explore Essaouira's Jewish heritage"
              },
              {
                id: "art-galleries",
                name: "Art Galleries District",
                category: "culture",
                description: "Collection of contemporary art galleries showcasing local and international artists.",
                lat: 31.5085,
                lon: -9.7595,
                visitTime: 90,
                bestTime: "afternoon",
                cost: "Free",
                accessibility: "Fully accessible",
                tags: ["art", "contemporary", "cultural"],
                blurb: "Essaouira's thriving art scene"
              },
              {
                id: "le-chalet-de-la-plage",
                name: "Le Chalet de la Plage",
                category: "restaurant",
                description: "Beachfront restaurant serving fresh seafood with stunning ocean views.",
                lat: 31.5085,
                lon: -9.7595,
                visitTime: 90,
                bestTime: "evening",
                cost: "150-300 MAD",
                accessibility: "Fully accessible",
                tags: ["seafood", "beachfront", "romantic"],
                blurb: "Fresh seafood with ocean views"
              },
              {
                id: "cafe-taros",
                name: "Café Taros",
                category: "cafe",
                description: "Trendy rooftop café with panoramic views of the medina and ocean.",
                lat: 31.5085,
                lon: -9.7595,
                visitTime: 60,
                bestTime: "afternoon",
                cost: "60-120 MAD",
                accessibility: "Rooftop access via stairs",
                tags: ["rooftop", "scenic", "trendy"],
                blurb: "Best views in Essaouira"
              },
              {
                id: "riad-mimouna",
                name: "Riad Mimouna",
                category: "restaurant",
                description: "Elegant riad restaurant serving refined Moroccan cuisine in a beautiful setting.",
                lat: 31.5085,
                lon: -9.7595,
                visitTime: 90,
                bestTime: "evening",
                cost: "200-350 MAD",
                accessibility: "Fully accessible",
                tags: ["luxury", "traditional", "elegant"],
                blurb: "Fine dining in a historic riad"
              },
              {
                id: "skala-de-la-ville",
                name: "Skala de la Ville",
                category: "view",
                description: "Historic city walls with cannons and panoramic views of the Atlantic.",
                lat: 31.5085,
                lon: -9.7595,
                visitTime: 45,
                bestTime: "evening",
                cost: "60 MAD",
                accessibility: "Requires climbing stairs",
                tags: ["historical", "scenic", "fortifications"],
                blurb: "Historic fortifications with ocean views"
              },
              {
                id: "sidi-mohammed-ben-abdallah-museum",
                name: "Sidi Mohammed Ben Abdallah Museum",
                category: "museum",
                description: "Museum showcasing Essaouira's history, culture, and traditional crafts.",
                lat: 31.5085,
                lon: -9.7595,
                visitTime: 60,
                bestTime: "morning",
                cost: "20 MAD",
                accessibility: "Fully accessible",
                tags: ["historical", "cultural", "educational"],
                blurb: "Discover Essaouira's rich history"
              },
              {
                id: "woodworking-cooperative",
                name: "Woodworking Cooperative",
                category: "culture",
                description: "Watch traditional thuya wood carving and purchase authentic handicrafts.",
                lat: 31.5085,
                lon: -9.7595,
                visitTime: 45,
                bestTime: "morning",
                cost: "Free (purchase optional)",
                accessibility: "Fully accessible",
                tags: ["artisan", "traditional", "shopping"],
                blurb: "Watch master woodcarvers at work"
              },
              {
                id: "essaouira-mogador-island",
                name: "Mogador Island",
                category: "nature",
                description: "Small island off Essaouira's coast, home to rare birds and historic ruins.",
                lat: 31.5085,
                lon: -9.7595,
                visitTime: 120,
                bestTime: "morning",
                cost: "100-200 MAD",
                accessibility: "Boat access required",
                tags: ["nature", "birdwatching", "historical"],
                blurb: "Island sanctuary for rare birds"
              },
              {
                id: "essaouira-port",
                name: "Essaouira Port",
                category: "culture",
                description: "Working fishing port where you can watch traditional blue boats and fishermen.",
                lat: 31.5085,
                lon: -9.7595,
                visitTime: 30,
                bestTime: "morning",
                cost: "Free",
                accessibility: "Fully accessible",
                tags: ["fishing", "traditional", "photogenic"],
                blurb: "Traditional blue fishing boats"
              },
              {
                id: "essaouira-souk",
                name: "Essaouira Souk",
                category: "market",
                description: "Traditional market with handicrafts, textiles, and local products.",
                lat: 31.5085,
                lon: -9.7595,
                visitTime: 60,
                bestTime: "morning",
                cost: "Variable",
                accessibility: "Narrow passages",
                tags: ["shopping", "handicrafts", "traditional"],
                blurb: "Authentic Moroccan handicrafts"
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
    safetyTips: [
      "Be cautious in crowded areas",
      "Use official taxis",
      "Keep valuables secure"
    ],
    etiquetteTips: [
      "Dress appropriately for business districts",
      "Respect local customs"
    ],
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
            places: [
              {
                id: "hassan-ii-mosque",
                name: "Hassan II Mosque",
                category: "mosque",
                description: "One of the world's largest mosques with stunning ocean views.",
                lat: 33.6083,
                lon: -7.6328,
                visitTime: 90,
                bestTime: "morning",
                cost: "130 MAD",
                accessibility: "Fully accessible",
                tags: ["architectural", "spiritual", "iconic"],
                blurb: "Architectural marvel by the sea"
              },
              {
                id: "corniche-ain-diab",
                name: "Corniche Ain Diab",
                category: "beach",
                description: "Popular beachfront area with restaurants and entertainment.",
                lat: 33.5731,
                lon: -7.5898,
                visitTime: 120,
                bestTime: "evening",
                cost: "Free",
                accessibility: "Fully accessible",
                tags: ["beach", "entertainment", "dining"],
                blurb: "Casablanca's vibrant waterfront"
              },
              {
                id: "casablanca-medina",
                name: "Casablanca Medina",
                category: "medina",
                description: "Historic medina with traditional architecture and local life.",
                lat: 33.5731,
                lon: -7.5898,
                visitTime: 90,
                bestTime: "morning",
                cost: "Free",
                accessibility: "Narrow streets, challenging for wheelchairs",
                tags: ["traditional", "authentic", "cultural"],
                blurb: "Traditional heart of modern Casablanca"
              },
              {
                id: "mahkama-du-pacha",
                name: "Mahkama du Pacha",
                category: "architecture",
                description: "Stunning government building with exquisite Moroccan architecture.",
                lat: 33.5731,
                lon: -7.5898,
                visitTime: 45,
                bestTime: "morning",
                cost: "Free (exterior only)",
                accessibility: "Fully accessible",
                tags: ["architectural", "government", "photogenic"],
                blurb: "Masterpiece of Moroccan architecture"
              },
              {
                id: "habous-quarter",
                name: "Habous Quarter",
                category: "culture",
                description: "New medina built in traditional style with shops and cafes.",
                lat: 33.5731,
                lon: -7.5898,
                visitTime: 60,
                bestTime: "morning",
                cost: "Free",
                accessibility: "Fully accessible",
                tags: ["traditional", "shopping", "authentic"],
                blurb: "New medina in traditional style"
              },
              {
                id: "royal-palace-casablanca",
                name: "Royal Palace Casablanca",
                category: "architecture",
                description: "Magnificent royal palace with stunning gates and traditional architecture.",
                lat: 33.5731,
                lon: -7.5898,
                visitTime: 30,
                bestTime: "morning",
                cost: "Free (exterior only)",
                accessibility: "Fully accessible",
                tags: ["royal", "architectural", "photogenic"],
                blurb: "Stunning royal architecture"
              },
              {
                id: "casablanca-twin-center",
                name: "Casablanca Twin Center",
                category: "architecture",
                description: "Modern twin towers symbolizing Casablanca's economic power.",
                lat: 33.5731,
                lon: -7.5898,
                visitTime: 30,
                bestTime: "evening",
                cost: "Free",
                accessibility: "Fully accessible",
                tags: ["modern", "business", "iconic"],
                blurb: "Symbol of modern Morocco"
              },
              {
                id: "morocco-mall",
                name: "Morocco Mall",
                category: "shopping",
                description: "Africa's largest shopping mall with international brands and entertainment.",
                lat: 33.5731,
                lon: -7.5898,
                visitTime: 180,
                bestTime: "afternoon",
                cost: "Variable",
                accessibility: "Fully accessible",
                tags: ["shopping", "entertainment", "modern"],
                blurb: "Africa's largest shopping destination"
              },
              {
                id: "rick-cafe",
                name: "Rick's Café",
                category: "restaurant",
                description: "Recreation of the famous café from Casablanca movie with live piano music.",
                lat: 33.5731,
                lon: -7.5898,
                visitTime: 90,
                bestTime: "evening",
                cost: "200-400 MAD",
                accessibility: "Fully accessible",
                tags: ["movie-themed", "romantic", "live-music"],
                blurb: "Here's looking at you, kid"
              },
              {
                id: "le-cabestan",
                name: "Le Cabestan",
                category: "restaurant",
                description: "Elegant beachfront restaurant with Mediterranean cuisine and ocean views.",
                lat: 33.5731,
                lon: -7.5898,
                visitTime: 90,
                bestTime: "evening",
                cost: "300-500 MAD",
                accessibility: "Fully accessible",
                tags: ["luxury", "beachfront", "mediterranean"],
                blurb: "Fine dining by the ocean"
              },
              {
                id: "cafe-maure",
                name: "Café Maure",
                category: "cafe",
                description: "Traditional café serving mint tea and Moroccan pastries in historic setting.",
                lat: 33.5731,
                lon: -7.5898,
                visitTime: 45,
                bestTime: "afternoon",
                cost: "40-80 MAD",
                accessibility: "Fully accessible",
                tags: ["traditional", "tea", "historic"],
                blurb: "Traditional Moroccan café experience"
              },
              {
                id: "villa-des-arts",
                name: "Villa des Arts",
                category: "museum",
                description: "Contemporary art museum showcasing Moroccan and international artists.",
                lat: 33.5731,
                lon: -7.5898,
                visitTime: 90,
                bestTime: "morning",
                cost: "50 MAD",
                accessibility: "Fully accessible",
                tags: ["art", "contemporary", "cultural"],
                blurb: "Contemporary art in beautiful villa"
              },
              {
                id: "parc-de-la-ligue-arabe",
                name: "Parc de la Ligue Arabe",
                category: "garden",
                description: "Large urban park perfect for walking, jogging, and relaxation.",
                lat: 33.5731,
                lon: -7.5898,
                visitTime: 60,
                bestTime: "morning",
                cost: "Free",
                accessibility: "Fully accessible",
                tags: ["park", "nature", "peaceful"],
                blurb: "Green oasis in the city"
              },
              {
                id: "casablanca-cathedral",
                name: "Casablanca Cathedral",
                category: "architecture",
                description: "Historic cathedral showcasing colonial architecture and cultural heritage.",
                lat: 33.5731,
                lon: -7.5898,
                visitTime: 30,
                bestTime: "morning",
                cost: "Free",
                accessibility: "Fully accessible",
                tags: ["historical", "colonial", "architectural"],
                blurb: "Colonial architectural gem"
              },
              {
                id: "central-market",
                name: "Central Market",
                category: "market",
                description: "Vibrant local market with fresh produce, spices, and traditional goods.",
                lat: 33.5731,
                lon: -7.5898,
                visitTime: 60,
                bestTime: "morning",
                cost: "Variable",
                accessibility: "Can be crowded",
                tags: ["local-life", "fresh-produce", "authentic"],
                blurb: "Experience local Casablanca life"
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
    safetyTips: [
      "Be cautious in crowded areas",
      "Use official guides for historic sites"
    ],
    etiquetteTips: [
      "Dress appropriately for government areas",
      "Respect local customs"
    ],
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
    places: [
      {
        id: "kasbah-udayas",
        name: "Kasbah of the Udayas",
        category: "culture",
        description: "Historic fortress with beautiful gardens and ocean views.",
        lat: 34.0319,
        lon: -6.8361,
        visitTime: 90,
        bestTime: "morning",
        cost: "Free",
        accessibility: "Fully accessible",
        tags: ["historical", "scenic", "peaceful"],
        blurb: "Historic fortress with ocean views"
      },
      {
        id: "hassan-tower",
        name: "Hassan Tower",
        category: "architecture",
        description: "12th-century minaret and royal mausoleum complex.",
        lat: 34.0209,
        lon: -6.8416,
        visitTime: 60,
        bestTime: "morning",
        cost: "Free",
        accessibility: "Fully accessible",
        tags: ["historical", "architectural", "royal"],
        blurb: "Royal architectural masterpiece"
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
    safetyTips: [
      "Be cautious on steep streets",
      "Wear comfortable walking shoes"
    ],
    etiquetteTips: [
      "Respect local customs in this conservative town",
      "Ask permission before photographing locals"
    ],
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
    places: [
      {
        id: "blue-streets",
        name: "Blue Streets",
        category: "culture",
        description: "The iconic blue-washed streets and buildings that make Chefchaouen famous.",
        lat: 35.1714,
        lon: -5.2696,
        visitTime: 120,
        bestTime: "morning",
        cost: "Free",
        accessibility: "Steep streets, challenging for wheelchairs",
        tags: ["instagram-worthy", "photogenic", "unique"],
        blurb: "The world's most photogenic city"
      },
      {
        id: "spanish-mosque-viewpoint",
        name: "Spanish Mosque Viewpoint",
        category: "viewpoint",
        description: "Scenic viewpoint offering panoramic views of the blue city.",
        lat: 35.1714,
        lon: -5.2696,
        visitTime: 60,
        bestTime: "evening",
        cost: "Free",
        accessibility: "Requires hiking uphill",
        tags: ["scenic", "hiking", "sunset"],
        blurb: "Best views of the Blue City"
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
    safetyTips: [
      "Be cautious on the beach at night",
      "Use sunscreen and stay hydrated"
    ],
    etiquetteTips: [
      "Respect beach etiquette",
      "Dress appropriately in town"
    ],
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
    places: [
      {
        id: "agadir-beach",
        name: "Agadir Beach",
        category: "beach",
        description: "Long sandy beach perfect for swimming, sunbathing, and water sports.",
        lat: 30.4278,
        lon: -9.5981,
        visitTime: 180,
        bestTime: "morning",
        cost: "Free",
        accessibility: "Fully accessible",
        tags: ["beach", "water-sports", "family-friendly"],
        blurb: "Morocco's premier beach destination"
      },
      {
        id: "agadir-oufella",
        name: "Agadir Oufella",
        category: "viewpoint",
        description: "Historic kasbah ruins with panoramic views of the city and ocean.",
        lat: 30.4278,
        lon: -9.5981,
        visitTime: 60,
        bestTime: "evening",
        cost: "Free",
        accessibility: "Requires climbing stairs",
        tags: ["scenic", "historical", "sunset"],
        blurb: "Best views of Agadir and the ocean"
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
    lon: -6.9370,
    description: "The 'Hollywood of Morocco' and gateway to the Sahara Desert.",
    bestTimeToVisit: "October-April for comfortable desert weather.",
    safetyTips: [
      "Be prepared for desert conditions",
      "Use official guides for desert tours"
    ],
    etiquetteTips: [
      "Respect local Berber customs",
      "Dress appropriately for desert climate"
    ],
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
    places: [
      {
        id: "ait-ben-haddou",
        name: "Ait Ben Haddou",
        category: "culture",
        description: "UNESCO World Heritage ksar featured in many Hollywood films.",
        lat: 30.9333,
        lon: -6.9167,
        visitTime: 120,
        bestTime: "morning",
        cost: "Free",
        accessibility: "Requires walking uphill",
        tags: ["unesco", "filming-location", "historical"],
        blurb: "Hollywood's favorite Moroccan backdrop"
      },
      {
        id: "atlas-studios",
        name: "Atlas Studios",
        category: "culture",
        description: "Morocco's largest film studio with sets from famous movies.",
        lat: 30.9335,
        lon: -6.9370,
        visitTime: 90,
        bestTime: "morning",
        cost: "80 MAD",
        accessibility: "Fully accessible",
        tags: ["filming-location", "entertainment", "unique"],
        blurb: "Step into Hollywood history"
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
    lon: -5.8340,
    description: "Morocco's gateway to Europe, a cosmopolitan city with rich history and culture.",
    bestTimeToVisit: "April-October for pleasant weather and ferry connections.",
    safetyTips: [
      "Be cautious in crowded port areas",
      "Use official taxis"
    ],
    etiquetteTips: [
      "Respect local customs",
      "Dress appropriately"
    ],
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
    places: [
      {
        id: "tangier-medina",
        name: "Tangier Medina",
        category: "medina",
        description: "Historic medina with traditional architecture and vibrant souks.",
        lat: 35.7595,
        lon: -5.8340,
        visitTime: 120,
        bestTime: "morning",
        cost: "Free",
        accessibility: "Narrow streets, challenging for wheelchairs",
        tags: ["cultural", "traditional", "authentic"],
        blurb: "Gateway between Africa and Europe"
      },
      {
        id: "cap-spartel",
        name: "Cap Spartel",
        category: "viewpoint",
        description: "Scenic cape where the Atlantic meets the Mediterranean.",
        lat: 35.7595,
        lon: -5.8340,
        visitTime: 60,
        bestTime: "evening",
        cost: "Free",
        accessibility: "Fully accessible",
        tags: ["scenic", "geographic", "sunset"],
        blurb: "Where two seas meet"
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
    safetyTips: [
      "Be cautious in crowded areas",
      "Use official guides for historic sites"
    ],
    etiquetteTips: [
      "Respect local customs",
      "Dress appropriately"
    ],
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
    places: [
      {
        id: "meknes-medina",
        name: "Meknes Medina",
        category: "medina",
        description: "Historic medina with traditional architecture and local life.",
        lat: 33.8935,
        lon: -5.5473,
        visitTime: 120,
        bestTime: "morning",
        cost: "Free",
        accessibility: "Narrow streets, challenging for wheelchairs",
        tags: ["cultural", "traditional", "authentic"],
        blurb: "Imperial city charm"
      },
      {
        id: "bab-mansour",
        name: "Bab Mansour",
        category: "architecture",
        description: "Magnificent gate considered one of Morocco's most beautiful.",
        lat: 33.8935,
        lon: -5.5473,
        visitTime: 30,
        bestTime: "morning",
        cost: "Free",
        accessibility: "Fully accessible",
        tags: ["architectural", "historical", "photogenic"],
        blurb: "Morocco's most beautiful gate"
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