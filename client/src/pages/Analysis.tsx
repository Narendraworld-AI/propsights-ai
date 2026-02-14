import { useEffect, useState, useMemo } from "react";
import { useRoute, useLocation } from "wouter";
import { Navbar } from "@/components/Navbar";
import { generateMockData, RealEstateData, PropertyType } from "@/lib/mockData";
import { PriceChart } from "@/components/PriceChart";
import { ForecastChart } from "@/components/ForecastChart";
import { PriceHistoryTable } from "@/components/PriceHistoryTable";
import { StatsGrid } from "@/components/StatsGrid";
import { MapView } from "@/components/MapView";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Info, AlertTriangle, Filter } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Analysis() {
  const [match, params] = useRoute("/analysis/:location");
  const [data, setData] = useState<RealEstateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [_, setLocation] = useLocation();
  const [showFallbackDialog, setShowFallbackDialog] = useState(false);
  
  // Property Type State
  const [propertyType, setPropertyType] = useState<PropertyType>("apartment");

  useEffect(() => {
    if (!match || !params?.location) {
      setLocation("/");
      return;
    }

    // Reset and Load
    setLoading(true);
    setData(null);

    const timer = setTimeout(() => {
      try {
        const locationQuery = decodeURIComponent(params.location);
        const mockData = generateMockData(locationQuery, propertyType);
        
        if (mockData) {
          setData(mockData);
          if (mockData.isNearbyFallback) {
            setShowFallbackDialog(true);
          }
        } else {
          console.error("Failed to generate data");
        }
      } catch (error) {
        console.error("Error generating data:", error);
      } finally {
        setLoading(false);
      }
    }, 600); // Faster loading

    return () => clearTimeout(timer);
  }, [match, params?.location, propertyType]); 

  // Memoize charts to prevent unnecessary re-renders
  const memoizedHistory = useMemo(() => data?.history, [data]);
  const memoizedForecast = useMemo(() => data?.forecast, [data]);

  if (loading) {
    return <AnalysisSkeleton />;
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4 bg-slate-50">
        <AlertTriangle className="h-12 w-12 text-slate-300" />
        <h2 className="text-xl font-bold text-slate-700">Unable to load data</h2>
        <Button onClick={() => setLocation("/")}>Search Another Location</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar />
      
      <Dialog open={showFallbackDialog} onOpenChange={setShowFallbackDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-600">
              <AlertTriangle className="h-5 w-5" />
              Exact Location Data Not Found
            </DialogTitle>
            <DialogDescription className="pt-2">
              Showing analytics for nearby <strong>{data.nearbyLocationName}</strong> instead.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => setShowFallbackDialog(false)}>Understood</Button>
          </div>
        </DialogContent>
      </Dialog>

      <main className="container px-4 py-8 space-y-8">
        {/* Header with Filters */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
              <MapPin className="h-4 w-4" />
              <span>India</span>
              <span>/</span>
              <span>{data.city}</span>
              <span>/</span>
              <span className="font-semibold text-slate-700">{data.area}</span>
            </div>
            <h1 className="text-3xl font-display font-bold text-slate-900">{data.area}</h1>
            <p className="text-slate-500 mt-1">
              Real estate insights for <span className="capitalize font-medium text-slate-700">{propertyType}s</span> • Updated Feb 2026
            </p>
          </div>
          
          <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2 px-2 border-r border-slate-100 pr-4">
              <Filter className="h-4 w-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-600">Filters</span>
            </div>
            <div className="flex gap-2">
              <Select value={propertyType} onValueChange={(v) => setPropertyType(v as PropertyType)}>
                <SelectTrigger className="w-[140px] bg-slate-50 border-slate-200">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="flat">Flat</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="plot">Plot</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
              
              <Select defaultValue="buy">
                <SelectTrigger className="w-[120px] bg-slate-50 border-slate-200">
                  <SelectValue placeholder="Action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buy">Buy</SelectItem>
                  <SelectItem value="rent">Rent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {data.isNearbyFallback && (
          <Alert variant="default" className="bg-amber-50 border-amber-200">
            <Info className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800">Showing Nearby Data</AlertTitle>
            <AlertDescription className="text-amber-700">
              Data for the exact location was insufficient. Displaying analytics for <strong>{data.nearbyLocationName}</strong>.
            </AlertDescription>
          </Alert>
        )}

        <StatsGrid 
          currentPrice={data.currentPrice} 
          yoyGrowth={data.yoyGrowth}
          cagr5y={data.cagr5y}
          projectedGrowth10y={data.projectedGrowth10y}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="history" className="w-full">
              <div className="flex items-center justify-between mb-4">
                <TabsList className="grid w-[300px] grid-cols-2">
                  <TabsTrigger value="history">Historical Trend</TabsTrigger>
                  <TabsTrigger value="forecast">10Y Forecast</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="history" className="mt-0 space-y-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.99 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <PriceChart data={memoizedHistory!} />
                </motion.div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <PriceHistoryTable history={memoizedHistory!} />
                   
                   <div className="space-y-4">
                      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                        <h3 className="font-semibold text-slate-800 mb-2">Investment Verdict</h3>
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-2xl font-bold text-primary">
                            {data.cagr5y > 8 ? "Strong Buy" : data.cagr5y > 5 ? "Hold" : "Watch"}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500">
                          {data.cagr5y > 8 
                            ? "High growth potential zone with robust historical returns." 
                            : "Stable market with moderate appreciation expected."}
                        </p>
                      </div>

                      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                        <h3 className="font-semibold text-slate-800 mb-2">Market Sentiment</h3>
                        <div className="flex items-center gap-4 mb-2">
                          <div className="h-2 flex-1 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full transition-all duration-1000"
                              style={{ width: `${Math.min(100, Math.max(0, 50 + data.yoyGrowth * 2))}%` }}
                            ></div>
                          </div>
                          <span className="font-bold text-sm text-primary">
                            {data.yoyGrowth > 5 ? "Bullish" : "Neutral"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">Based on transaction volume and price momentum.</p>
                      </div>
                   </div>
                </div>
              </TabsContent>
              
              <TabsContent value="forecast" className="mt-0 space-y-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.99 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <ForecastChart data={memoizedForecast!} />
                </motion.div>

                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                  <h3 className="font-semibold text-slate-800 mb-4">Growth Drivers for {data.city}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {['Metro Expansion', 'Commercial Hub Growth', 'Better Connectivity', 'Retail Development'].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-slate-700 p-3 bg-slate-50 rounded-lg">
                        <div className="h-2 w-2 rounded-full bg-accent"></div>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white p-1 rounded-xl shadow-soft border border-border sticky top-24">
               <div className="relative">
                 <MapView locationName={`${data.area}, ${data.city}`} />
                 <div className="p-4 space-y-3">
                    <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      Location Details
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                       <div className="text-slate-500">Zone</div>
                       <div className="font-medium text-slate-800">{data.city} Region</div>
                       <div className="text-slate-500">Locality</div>
                       <div className="font-medium text-slate-800">{data.area}</div>
                       <div className="text-slate-500">Type</div>
                       <div className="font-medium text-slate-800 capitalize">{data.propertyType}</div>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function AnalysisSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar />
      <main className="container px-4 py-8 space-y-8">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-64" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-[400px] rounded-xl" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-[200px] rounded-xl" />
              <Skeleton className="h-[200px] rounded-xl" />
            </div>
          </div>
          <div className="space-y-4">
             <Skeleton className="h-[300px] rounded-xl" />
          </div>
        </div>
      </main>
    </div>
  );
}
