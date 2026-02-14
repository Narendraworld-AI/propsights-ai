import { addYears, format, subYears } from "date-fns";

export type PropertyType = "apartment" | "villa" | "plot" | "commercial" | "flat";

export interface YearlyDataPoint {
  year: number;
  price: number;
}

export interface RealEstateData {
  location: string;
  city: string;
  area: string;
  propertyType: PropertyType;
  isNearbyFallback?: boolean;
  nearbyLocationName?: string;
  currentPrice: number; // Price per sqft
  yoyGrowth: number;
  cagr5y: number;
  transactions: number;
  projectedGrowth5y: number;
  projectedGrowth10y: number;
  history: YearlyDataPoint[];
  forecast: Array<{
    date: string;
    year: number;
    price: number;
    lowerBound: number;
    upperBound: number;
    conservative: number;
    aggressive: number;
  }>;
}

// EXPANDED NCR & METRO DATA
// Generating large lists programmatically to keep file size manageable but coverage high
const generateSectors = (prefix: string, count: number) => 
  Array.from({ length: count }, (_, i) => `${prefix} Sector ${i + 1}`);

const NOIDA_SECTORS = generateSectors("Noida", 168);
const GURGAON_SECTORS = generateSectors("Gurgaon", 115);
const GREATER_NOIDA_AREAS = ["Alpha I", "Alpha II", "Beta I", "Beta II", "Gamma I", "Gamma II", "Delta I", "Delta II", "Knowledge Park I", "Knowledge Park II", "Knowledge Park III", "Pari Chowk", "Tech Zone", "Tech Zone IV"];
const YAMUNA_EXPRESSWAY = ["YEIDA Sector 18", "YEIDA Sector 20", "YEIDA Sector 22D", "Jewar Airport Area"];
const NOIDA_EXTENSION = ["Noida Ext Sector 1", "Noida Ext Sector 4", "Noida Ext Sector 16", "Tech Zone 4"];
const GURGAON_PRIME = ["DLF Phase 1", "DLF Phase 2", "DLF Phase 3", "DLF Phase 4", "DLF Phase 5", "Golf Course Road", "Golf Course Ext Road", "Sohna Road", "MG Road", "Palam Vihar", "Dwarka Expressway"];

export const INDIAN_CITIES = {
  "Delhi NCR": [
    ...NOIDA_SECTORS,
    ...GREATER_NOIDA_AREAS,
    ...NOIDA_EXTENSION,
    ...YAMUNA_EXPRESSWAY,
    ...GURGAON_SECTORS,
    ...GURGAON_PRIME,
    "Vasant Kunj", "Greater Kailash", "Saket", "Hauz Khas", "Dwarka", "Rohini", "Lajpat Nagar", "Defence Colony", "Mayur Vihar", "Janakpuri", "Punjabi Bagh", "Pitampura", "Model Town",
    "Indirapuram", "Vaishali", "Vasundhara", "Raj Nagar Extension", "Crossings Republik", "Kaushambi",
    "Faridabad Sector 15", "Faridabad Sector 31", "Faridabad Sector 87", "Neharpar"
  ],
  "Mumbai": [
    "Bandra West", "Andheri East", "Andheri West", "Powai", "Juhu", "Worli", "Lower Parel", "Chembur", "Goregaon East", "Goregaon West", "Malad West", "Borivali East", "Kandivali", "Mulund", "Thane West", "Navi Mumbai - Vashi", "Navi Mumbai - Kharghar", "Colaba", "Dadar", "Prabhadevi", "BKC", "Santacruz", "Vile Parle"
  ],
  "Bengaluru": [
    "Indiranagar", "Koramangala", "Whitefield", "HSR Layout", "Jayanagar", "Electronic City", "Hebbal", "Malleshwaram", "Yelahanka", "Sarjapur Road", "Marathahalli", "Bellandur", "Banashankari", "JP Nagar", "BTM Layout", "Richmond Town", "Sadashivnagar", "Frazer Town"
  ],
  "Hyderabad": [
    "Gachibowli", "Jubilee Hills", "Banjara Hills", "Hitech City", "Kondapur", "Madhapur", "Begumpet", "Kukatpally", "Manikonda", "Miyapur", "Nallagandla", "Financial District", "Tellapur", "Kokapet"
  ],
  "Pune": [
    "Koregaon Park", "Viman Nagar", "Kalyani Nagar", "Baner", "Wakad", "Hinjewadi", "Aundh", "Hadapsar", "Magarpatta", "Kharadi", "Pimple Saudagar", "Bavdhan", "Kothrud", "Boat Club Road"
  ],
  "Chennai": [
    "Adyar", "Besant Nagar", "Anna Nagar", "T Nagar", "Velachery", "OMR", "Porur", "Mylapore", "Nungambakkam", "Thiruvanmiyur", "Medavakkam", "Perungudi", "ECR", "Sholinganallur"
  ],
  "Kolkata": [
    "Salt Lake", "New Town", "Park Street", "Ballygunge", "Dum Dum", "Jadavpur", "Rajarhat", "Garia", "Behala", "Alipore", "Southern Avenue", "Lake Gardens"
  ],
  "Ahmedabad": [
    "Satellite", "Bodakdev", "Vastrapur", "Thaltej", "Gota", "Bopal", "Mani Nagar", "Navrangpura", "SG Highway", "Prahlad Nagar", "Sindhu Bhavan Road"
  ]
};

// Search index optimization
export const SEARCHABLE_LOCATIONS = Object.entries(INDIAN_CITIES).flatMap(([city, areas]) => 
  areas.map(area => ({ 
    city, 
    area, 
    label: `${area}, ${city}`,
    // Adding rough lat/lng for better default map positioning (Mock coordinates)
    // In a real app, this would come from a database or Geocoding API
    lat: 28.6139, 
    lng: 77.2090
  }))
);

// Helper to get rough coordinates based on city (Mocking geocoding for now to ensure map moves)
export const getCoordinatesForLocation = (city: string, area: string) => {
  const cityCoords: Record<string, { lat: number; lng: number }> = {
    "Delhi NCR": { lat: 28.6139, lng: 77.2090 },
    "Mumbai": { lat: 19.0760, lng: 72.8777 },
    "Bengaluru": { lat: 12.9716, lng: 77.5946 },
    "Hyderabad": { lat: 17.3850, lng: 78.4867 },
    "Pune": { lat: 18.5204, lng: 73.8567 },
    "Chennai": { lat: 13.0827, lng: 80.2707 },
    "Kolkata": { lat: 22.5726, lng: 88.3639 },
    "Ahmedabad": { lat: 23.0225, lng: 72.5714 }
  };

  const base = cityCoords[city] || cityCoords["Delhi NCR"];
  // Add deterministic jitter based on area name to simulate different locations within city
  const seed = area.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
  const latOffset = (seededRandom(seed) - 0.5) * 0.1;
  const lngOffset = (seededRandom(seed + 1) - 0.5) * 0.1;

  return {
    lat: base.lat + latOffset,
    lng: base.lng + lngOffset
  };
};

// BASE PRICES PER CITY AND PROPERTY TYPE
const BASE_PRICES: Record<string, number> = {
  "Mumbai": 25000,
  "Delhi NCR": 11000,
  "Bengaluru": 9500,
  "Hyderabad": 8000,
  "Chennai": 8200,
  "Pune": 8500,
  "Kolkata": 6000,
  "Ahmedabad": 5500
};

const PROPERTY_MULTIPLIERS: Record<PropertyType, number> = {
  "apartment": 1.0,
  "flat": 0.95,
  "villa": 1.6,
  "plot": 1.4,
  "commercial": 1.8
};

const PROPERTY_GROWTH_MODIFIERS: Record<PropertyType, number> = {
  "apartment": 0,
  "flat": -0.01,
  "villa": 0.02,
  "plot": 0.03, // Land appreciates faster
  "commercial": 0.015
};

// Growth Factors by City (CAGR estimate)
const CITY_GROWTH_FACTORS: Record<string, number> = {
  "Mumbai": 0.055,
  "Delhi NCR": 0.065,
  "Bengaluru": 0.085, 
  "Hyderabad": 0.095, 
  "Pune": 0.075,
  "Chennai": 0.055,
  "Kolkata": 0.045,
  "Ahmedabad": 0.065
};

// Deterministic Pseudo-Random Generator
function seededRandom(seed: number) {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

// Simple cache for performance
const CACHE = new Map<string, RealEstateData>();

export const generateMockData = (query: string, propertyType: PropertyType = "apartment"): RealEstateData | null => {
  const cacheKey = `${query}-${propertyType}`;
  if (CACHE.has(cacheKey)) return CACHE.get(cacheKey)!;

  // 1. Identify Location
  let foundLocation = SEARCHABLE_LOCATIONS.find(l => 
    l.label.toLowerCase() === query.toLowerCase() || 
    l.area.toLowerCase() === query.toLowerCase()
  );

  let isNearbyFallback = false;
  let nearbyLocationName = "";
  
  if (!foundLocation) {
    const partialMatch = SEARCHABLE_LOCATIONS.find(l => 
      l.label.toLowerCase().includes(query.toLowerCase()) ||
      query.toLowerCase().includes(l.area.toLowerCase())
    );

    if (partialMatch) {
      foundLocation = partialMatch;
    } else {
      isNearbyFallback = true;
      const hash = query.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
      foundLocation = SEARCHABLE_LOCATIONS[hash % SEARCHABLE_LOCATIONS.length];
      nearbyLocationName = foundLocation.label;
    }
  }

  // 2. Generate Base Parameters
  const seed = foundLocation.area.length + foundLocation.city.length + propertyType.length;
  const cityBasePrice = BASE_PRICES[foundLocation.city] || 6000;
  
  // Area premium calculation
  const areaPremium = (seed * 150) % 6000; 
  
  // Apply property type multiplier
  const typeMultiplier = PROPERTY_MULTIPLIERS[propertyType];
  const adjustedBasePrice = (cityBasePrice + areaPremium) * typeMultiplier;
  
  const baseGrowthRate = CITY_GROWTH_FACTORS[foundLocation.city] || 0.06;
  const adjustedGrowthRate = baseGrowthRate + PROPERTY_GROWTH_MODIFIERS[propertyType];

  // 3. Generate History (Last 12 Years)
  const historyPoints: YearlyDataPoint[] = [];
  const currentYear = new Date().getFullYear();
  let priceRunner = adjustedBasePrice;
  
  // Generate backwards from current year
  for (let i = 0; i <= 12; i++) {
     const year = currentYear - i;
     // Add noise and cyclical adjustments
     const cyclePhase = Math.sin(year * 0.5); 
     const noise = 1 + ((seededRandom(seed + year) - 0.5) * 0.03); 
     
     // Market correction adjustments
     let yearGrowth = adjustedGrowthRate;
     if (year === 2020 || year === 2021) yearGrowth = 0.005; // Covid stagnant
     if (year === 2016 || year === 2017) yearGrowth = 0.02; // Demonetization/RERA impact
     if (year === 2023 || year === 2024) yearGrowth += 0.02; // Recent boom
     
     historyPoints.push({
       year,
       price: Math.round(priceRunner)
     });
     
     // Calculate previous year price (reverse growth)
     priceRunner = priceRunner / (1 + yearGrowth) * noise;
  }
  
  historyPoints.reverse();
  const currentPrice = historyPoints[historyPoints.length - 1].price;
  const priceOneYearAgo = historyPoints.find(p => p.year === currentYear - 1)?.price || currentPrice * 0.9;
  const priceFiveYearsAgo = historyPoints.find(p => p.year === currentYear - 5)?.price || currentPrice * 0.7;
  
  const yoyGrowth = ((currentPrice - priceOneYearAgo) / priceOneYearAgo) * 100;
  
  // CAGR Calculation: (End/Start)^(1/n) - 1
  const cagr5y = (Math.pow(currentPrice / priceFiveYearsAgo, 1/5) - 1) * 100;

  // 4. Generate Enhanced ML Forecast (Next 10 Years)
  const forecast = [];
  let futurePrice = currentPrice;
  let conservativePrice = currentPrice;
  let aggressivePrice = currentPrice;
  
  for (let i = 1; i <= 10; i++) {
    const year = currentYear + i;
    
    // Future Growth Model Components
    const inflationComponent = 0.045; // 4.5% baseline inflation
    const infrastructureMultiplier = 1 + (seededRandom(seed + 100) * 0.015); // Local infra boost
    const demandCycle = 1 + (Math.sin(i * 0.6) * 0.01); // Cyclical demand
    
    // Composite growth rates
    const moderateGrowth = (adjustedGrowthRate * infrastructureMultiplier * demandCycle);
    const conservativeGrowth = moderateGrowth * 0.75;
    const aggressiveGrowth = moderateGrowth * 1.35;
    
    futurePrice = futurePrice * (1 + moderateGrowth);
    conservativePrice = conservativePrice * (1 + conservativeGrowth);
    aggressivePrice = aggressivePrice * (1 + aggressiveGrowth);
    
    // Uncertainty widens with time
    const uncertainty = futurePrice * (0.015 * i); 
    
    forecast.push({
      date: year.toString(),
      year: year,
      price: Math.round(futurePrice),
      lowerBound: Math.round(Math.max(conservativePrice, futurePrice - uncertainty)),
      upperBound: Math.round(Math.min(aggressivePrice, futurePrice + uncertainty)),
      conservative: Math.round(conservativePrice),
      aggressive: Math.round(aggressivePrice)
    });
  }

  const result = {
    location: isNearbyFallback ? query : foundLocation.label,
    city: foundLocation.city,
    area: foundLocation.area,
    propertyType,
    isNearbyFallback,
    nearbyLocationName,
    currentPrice: Math.round(currentPrice),
    yoyGrowth,
    cagr5y,
    transactions: 200 + Math.floor(seededRandom(seed) * 1500),
    projectedGrowth5y: ((forecast[4].price - currentPrice) / currentPrice) * 100,
    projectedGrowth10y: ((forecast[9].price - currentPrice) / currentPrice) * 100,
    history: historyPoints,
    forecast,
  };

  CACHE.set(cacheKey, result);
  return result;
};

export const POPULAR_LOCATIONS = [
  "Bandra West, Mumbai",
  "Indiranagar, Bengaluru",
  "Cyber City, Delhi NCR",
  "Gachibowli, Hyderabad",
  "Noida Sector 150, Delhi NCR",
  "Golf Course Road, Delhi NCR"
];
