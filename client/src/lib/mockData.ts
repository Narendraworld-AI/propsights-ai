import { addYears, format, subYears } from "date-fns";

export interface YearlyDataPoint {
  year: number;
  price: number;
}

export interface RealEstateData {
  location: string;
  city: string;
  area: string;
  isNearbyFallback?: boolean;
  nearbyLocationName?: string;
  currentPrice: number; // Price per sqft
  yoyGrowth: number;
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
  }>;
}

// EXPANDED DATASET FOR INDIAN CITIES
export const INDIAN_CITIES = {
  "Delhi NCR": [
    // Delhi
    "Vasant Kunj", "Greater Kailash", "Saket", "Hauz Khas", "Dwarka", "Rohini", "Lajpat Nagar", "Defence Colony", "Mayur Vihar", "Janakpuri",
    // Gurugram
    "Gurgaon - Cyber City", "Gurgaon - Sector 56", "Gurgaon - Sector 45", "Gurgaon - Golf Course Road", "Gurgaon - Sohna Road", "Gurgaon - MG Road", "Gurgaon - Sector 82",
    // Noida
    "Noida - Sector 62", "Noida - Sector 150", "Noida - Sector 137", "Noida - Sector 75", "Noida - Sector 44", "Noida - Sector 18",
    // Ghaziabad
    "Indirapuram", "Vaishali", "Vasundhara", "Raj Nagar Extension", "Crossings Republik",
    // Faridabad
    "Faridabad - Sector 15", "Faridabad - Neharpar", "Faridabad - NIT"
  ],
  "Mumbai": [
    "Bandra West", "Andheri East", "Andheri West", "Powai", "Juhu", "Worli", "Lower Parel", "Chembur", "Goregaon East", "Goregaon West", "Malad West", "Borivali East", "Kandivali", "Mulund", "Thane West", "Navi Mumbai - Vashi", "Navi Mumbai - Kharghar"
  ],
  "Bengaluru": [
    "Indiranagar", "Koramangala", "Whitefield", "HSR Layout", "Jayanagar", "Electronic City", "Hebbal", "Malleshwaram", "Yelahanka", "Sarjapur Road", "Marathahalli", "Bellandur", "Banashankari", "JP Nagar"
  ],
  "Hyderabad": [
    "Gachibowli", "Jubilee Hills", "Banjara Hills", "Hitech City", "Kondapur", "Madhapur", "Begumpet", "Kukatpally", "Manikonda", "Miyapur", "Nallagandla"
  ],
  "Pune": [
    "Koregaon Park", "Viman Nagar", "Kalyani Nagar", "Baner", "Wakad", "Hinjewadi", "Aundh", "Hadapsar", "Magarpatta", "Kharadi", "Pimple Saudagar"
  ],
  "Chennai": [
    "Adyar", "Besant Nagar", "Anna Nagar", "T Nagar", "Velachery", "OMR", "Porur", "Mylapore", "Nungambakkam", "Thiruvanmiyur", "Medavakkam"
  ],
  "Kolkata": [
    "Salt Lake", "New Town", "Park Street", "Ballygunge", "Dum Dum", "Jadavpur", "Rajarhat", "Garia", "Behala"
  ],
  "Ahmedabad": [
    "Satellite", "Bodakdev", "Vastrapur", "Thaltej", "Gota", "Bopal", "Mani Nagar", "Navrangpura", "SG Highway"
  ]
};

// Flattened list for search
export const SEARCHABLE_LOCATIONS = Object.entries(INDIAN_CITIES).flatMap(([city, areas]) => 
  areas.map(area => ({ city, area, label: `${area}, ${city}` }))
);

const BASE_PRICES: Record<string, number> = {
  "Mumbai": 22000,
  "Delhi NCR": 10000,
  "Bengaluru": 8500,
  "Hyderabad": 7000,
  "Chennai": 7500,
  "Pune": 7800,
  "Kolkata": 5500,
  "Ahmedabad": 4800
};

// Growth Factors by City (CAGR estimate)
const GROWTH_FACTORS: Record<string, number> = {
  "Mumbai": 0.05,
  "Delhi NCR": 0.06,
  "Bengaluru": 0.09, // High growth IT hub
  "Hyderabad": 0.10, // Emerging IT hub
  "Pune": 0.07,
  "Chennai": 0.05,
  "Kolkata": 0.04,
  "Ahmedabad": 0.06
};

// Deterministic Pseudo-Random Generator to ensure same data for same location
function seededRandom(seed: number) {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

export const generateMockData = (query: string): RealEstateData => {
  // 1. Identify Location
  let foundLocation = SEARCHABLE_LOCATIONS.find(l => 
    l.label.toLowerCase() === query.toLowerCase() || 
    l.area.toLowerCase() === query.toLowerCase()
  );

  let isNearbyFallback = false;
  let nearbyLocationName = "";
  
  // Fallback Logic
  if (!foundLocation) {
    const partialMatch = SEARCHABLE_LOCATIONS.find(l => 
      l.label.toLowerCase().includes(query.toLowerCase()) ||
      query.toLowerCase().includes(l.area.toLowerCase())
    );

    if (partialMatch) {
      foundLocation = partialMatch;
    } else {
      isNearbyFallback = true;
      // Consistent fallback based on string length sum
      const hash = query.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
      foundLocation = SEARCHABLE_LOCATIONS[hash % SEARCHABLE_LOCATIONS.length];
      nearbyLocationName = foundLocation.label;
    }
  }

  // 2. Generate Base Parameters
  const seed = foundLocation.area.length + foundLocation.city.length;
  const basePrice = BASE_PRICES[foundLocation.city] || 5000;
  // Area premium: Longer names or specific letters get slight premium to vary prices
  const areaPremium = (seed * 120) % 5000; 
  const currentPrice = basePrice + areaPremium;
  const growthRate = GROWTH_FACTORS[foundLocation.city] || 0.06;

  // 3. Generate History (Last 10 Years)
  const history: YearlyDataPoint[] = [];
  const currentYear = new Date().getFullYear();
  
  // Generate backwards from 2025 down to 2015
  // We want the curve to look realistic, so we add some seeded noise
  let priceRunner = currentPrice;
  
  // Create historical data points
  const historyPoints = [];
  for (let i = 0; i <= 10; i++) {
     const year = currentYear - i;
     // Reverse growth calculation: Price = Current / (1+rate)^years
     // Add noise
     const noiseFactor = 1 + ((seededRandom(seed + year) - 0.5) * 0.04); // +/- 2% random fluctuation per year
     
     // Specific correction for COVID years (2020-2021) - market was flat/down
     let yearGrowth = growthRate;
     if (year === 2020 || year === 2021) yearGrowth = 0.01; 
     
     historyPoints.push({
       year,
       price: Math.round(priceRunner)
     });
     
     priceRunner = priceRunner / (1 + yearGrowth) * noiseFactor;
  }
  
  // Sort chronological
  historyPoints.reverse();
  
  const priceOneYearAgo = historyPoints.find(p => p.year === currentYear - 1)?.price || currentPrice * 0.9;
  const yoyGrowth = ((currentPrice - priceOneYearAgo) / priceOneYearAgo) * 100;

  // 4. Generate Forecast (Next 10 Years)
  const forecast = [];
  let futurePrice = currentPrice;
  
  for (let i = 1; i <= 10; i++) {
    const year = currentYear + i;
    // Future growth slightly dampens over time (logistic growth curve assumption)
    const dampenedGrowth = growthRate * (1 - (i * 0.02)); // decays slightly
    const yearGrowth = Math.max(0.03, dampenedGrowth) + ((seededRandom(seed + year + 100) - 0.5) * 0.02);
    
    futurePrice = futurePrice * (1 + yearGrowth);
    
    // Confidence Interval
    const uncertainty = futurePrice * (0.02 * i); // 2% uncertainty per year into future
    
    forecast.push({
      date: year.toString(),
      year: year,
      price: Math.round(futurePrice),
      lowerBound: Math.round(futurePrice - uncertainty),
      upperBound: Math.round(futurePrice + uncertainty),
    });
  }

  return {
    location: isNearbyFallback ? query : foundLocation.label,
    city: foundLocation.city,
    area: foundLocation.area,
    isNearbyFallback,
    nearbyLocationName,
    currentPrice: Math.round(currentPrice),
    yoyGrowth,
    transactions: 500 + Math.floor(seededRandom(seed) * 2000),
    projectedGrowth5y: ((forecast[4].price - currentPrice) / currentPrice) * 100,
    projectedGrowth10y: ((forecast[9].price - currentPrice) / currentPrice) * 100,
    history: historyPoints,
    forecast,
  };
};

export const POPULAR_LOCATIONS = [
  "Bandra West, Mumbai",
  "Indiranagar, Bengaluru",
  "Cyber City, Delhi NCR",
  "Gachibowli, Hyderabad"
];
