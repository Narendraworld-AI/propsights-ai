import { addMonths, format, subMonths } from "date-fns";

export interface RealEstateData {
  location: string;
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

export const generateMockData = (location: string): RealEstateData => {
  // Deterministic "random" based on location length to keep it consistent
  const basePrice = 4500 + (location.length * 150); 
  const volatility = 50;
  
  const history = [];
  const today = new Date();
  
  // Generate 12 months history
  for (let i = 12; i >= 0; i--) {
    const date = subMonths(today, i);
    const trend = (12 - i) * (basePrice * 0.005); // Slight upward trend
    const noise = Math.sin(i) * volatility;
    history.push({
      date: format(date, "MMM yyyy"),
      price: Math.round(basePrice + trend + noise),
    });
  }

  const currentPrice = history[history.length - 1].price;
  const startPrice = history[0].price;
  const yoyGrowth = ((currentPrice - startPrice) / startPrice) * 100;

  // Generate 10 years forecast (monthly data points would be too many, let's do quarterly or yearly? Let's do yearly for 10 years)
  // Actually chart might look better with monthly for first few years then yearly. 
  // Let's do next 10 years (120 months) but aggregated to keep payload small? 
  // User asked for "next 10 year", let's do yearly points for forecast.
  
  const forecast = [];
  let futurePrice = currentPrice;
  
  for (let i = 1; i <= 10; i++) {
    // 5-8% annual growth model
    const growthRate = 0.05 + (Math.random() * 0.03); 
    futurePrice = futurePrice * (1 + growthRate);
    
    // Confidence interval widens over time
    const uncertainty = i * (futurePrice * 0.02); 
    
    forecast.push({
      date: format(addMonths(today, i * 12), "yyyy"),
      price: Math.round(futurePrice),
      lowerBound: Math.round(futurePrice - uncertainty),
      upperBound: Math.round(futurePrice + uncertainty),
    });
  }

  return {
    location,
    currentPrice,
    yoyGrowth,
    transactions: 1240 + location.length * 10,
    projectedGrowth5y: ((forecast[4].price - currentPrice) / currentPrice) * 100,
    projectedGrowth10y: ((forecast[9].price - currentPrice) / currentPrice) * 100,
    history,
    forecast,
  };
};

export const POPULAR_LOCATIONS = [
  "Indiranagar, Bangalore",
  "Bandra West, Mumbai",
  "Cyber City, Gurgaon",
  "Gachibowli, Hyderabad",
  "Viman Nagar, Pune",
  "Besant Nagar, Chennai"
];
