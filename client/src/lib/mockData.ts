import { addMonths, format, subMonths } from "date-fns";

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
  history: Array<{
    date: string;
    price: number;
  }>;
  forecast: Array<{
    date: string;
    price: number;
    lowerBound: number;
    upperBound: number;
  }>;
}

// Structured Data for Dropdowns
export const INDIAN_CITIES = {
  "Mumbai": [
    "Bandra West", "Andheri East", "Powai", "Juhu", "Worli", "Lower Parel", "Chembur", "Goregaon", "Malad", "Borivali"
  ],
  "Delhi NCR": [
    "Vasant Kunj", "Greater Kailash", "Dwarka", "Saket", "Hauz Khas", "Gurgaon - Cyber City", "Gurgaon - Sector 56", "Noida - Sector 62", "Noida - Sector 150"
  ],
  "Bengaluru": [
    "Indiranagar", "Koramangala", "Whitefield", "HSR Layout", "Jayanagar", "Electronic City", "Hebbal", "Malleshwaram", "Yelahanka"
  ],
  "Hyderabad": [
    "Gachibowli", "Jubilee Hills", "Banjara Hills", "Hitech City", "Kondapur", "Madhapur", "Begumpet", "Kukatpally"
  ],
  "Pune": [
    "Koregaon Park", "Viman Nagar", "Kalyani Nagar", "Baner", "Wakad", "Hinjewadi", "Aundh", "Hadapsar"
  ],
  "Chennai": [
    "Adyar", "Besant Nagar", "Anna Nagar", "T Nagar", "Velachery", "OMR", "Porur", "Mylapore"
  ],
  "Kolkata": [
    "Salt Lake", "New Town", "Park Street", "Ballygunge", "Dum Dum", "Jadavpur"
  ],
  "Ahmedabad": [
    "Satellite", "Bodakdev", "Vastrapur", "Thaltej", "Gota", "Bopal"
  ]
};

// Flattened list for search
export const SEARCHABLE_LOCATIONS = Object.entries(INDIAN_CITIES).flatMap(([city, areas]) => 
  areas.map(area => ({ city, area, label: `${area}, ${city}` }))
);

export const POPULAR_LOCATIONS = [
  "Bandra West, Mumbai",
  "Indiranagar, Bengaluru",
  "Cyber City, Delhi NCR",
  "Gachibowli, Hyderabad"
];

const BASE_PRICES: Record<string, number> = {
  "Mumbai": 25000,
  "Delhi NCR": 12000,
  "Bengaluru": 9000,
  "Hyderabad": 7500,
  "Chennai": 7000,
  "Pune": 8000,
  "Kolkata": 6000,
  "Ahmedabad": 5000
};

export const generateMockData = (query: string): RealEstateData => {
  // 1. Parse Input
  // Try to find exact match in our database
  let foundLocation = SEARCHABLE_LOCATIONS.find(l => 
    l.label.toLowerCase() === query.toLowerCase() || 
    l.area.toLowerCase() === query.toLowerCase()
  );

  let isNearbyFallback = false;
  let nearbyLocationName = "";
  
  // 2. Fallback Logic
  if (!foundLocation) {
    // If exact match not found, try to find partial match
    const partialMatch = SEARCHABLE_LOCATIONS.find(l => 
      l.label.toLowerCase().includes(query.toLowerCase()) ||
      query.toLowerCase().includes(l.area.toLowerCase())
    );

    if (partialMatch) {
      foundLocation = partialMatch;
    } else {
      // If absolutely no match, pick a "Nearby" location based on hash of string
      // This simulates "Geospatial nearby search" when exact sector isn't found
      isNearbyFallback = true;
      const hash = query.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
      const allLocations = SEARCHABLE_LOCATIONS;
      foundLocation = allLocations[hash % allLocations.length];
      nearbyLocationName = foundLocation.label;
    }
  }

  const cityBasePrice = BASE_PRICES[foundLocation.city] || 8000;
  
  // Deterministic "random" based on location length to keep it consistent
  const areaPremium = (foundLocation.area.length * 100); 
  const startPrice = cityBasePrice + areaPremium;
  const volatility = startPrice * 0.02; // 2% volatility
  
  const history = [];
  const today = new Date();
  
  // 3. Generate History (Last 12 Months)
  // Trend: Generally upwards for India RE (say 6-12% annual)
  const annualGrowthRateHistorical = 0.08; 
  const monthlyGrowth = annualGrowthRateHistorical / 12;

  let currentMonthlyPrice = startPrice;

  // We generate backwards from today to ensure today's price is the "current" one
  // Wait, better to generate forward from 1 year ago
  let priceRunner = startPrice;

  for (let i = 12; i >= 0; i--) {
    const date = subMonths(today, i);
    // Add trend
    priceRunner = priceRunner * (1 + monthlyGrowth);
    // Add noise
    const noise = (Math.sin(i * 0.5) * volatility);
    
    history.push({
      date: format(date, "MMM yyyy"),
      price: Math.round(priceRunner + noise),
    });
  }

  const currentPrice = history[history.length - 1].price;
  const priceOneYearAgo = history[0].price;
  const yoyGrowth = ((currentPrice - priceOneYearAgo) / priceOneYearAgo) * 100;

  // 4. Generate ML Forecast (Next 10 Years)
  // Using a simplified Logarithmic decay growth model + Cyclical market adjustment
  // Real estate doesn't grow linearly forever.
  
  const forecast = [];
  let futurePrice = currentPrice;
  const longTermGrowthRate = 0.06; // 6% long term avg
  
  for (let year = 1; year <= 10; year++) {
    // Growth rate slightly decelerates over time (market maturation)
    const yearGrowth = longTermGrowthRate + (Math.random() * 0.02 - 0.01); // Random fluctuation
    
    futurePrice = futurePrice * (1 + yearGrowth);
    
    // Confidence interval widens over time (Uncertainty cone)
    // Year 1: +/- 3%, Year 10: +/- 15%
    const uncertaintyFactor = 0.03 + (year * 0.012);
    const uncertaintyAmount = futurePrice * uncertaintyFactor;
    
    forecast.push({
      date: format(addMonths(today, year * 12), "yyyy"),
      price: Math.round(futurePrice),
      lowerBound: Math.round(futurePrice - uncertaintyAmount),
      upperBound: Math.round(futurePrice + uncertaintyAmount),
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
    transactions: 500 + Math.floor(Math.random() * 1000),
    projectedGrowth5y: ((forecast[4].price - currentPrice) / currentPrice) * 100,
    projectedGrowth10y: ((forecast[9].price - currentPrice) / currentPrice) * 100,
    history,
    forecast,
  };
};
