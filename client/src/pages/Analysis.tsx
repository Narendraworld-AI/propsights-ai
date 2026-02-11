import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { Navbar } from "@/components/Navbar";
import { generateMockData, RealEstateData } from "@/lib/mockData";
import { PriceChart } from "@/components/PriceChart";
import { ForecastChart } from "@/components/ForecastChart";
import { StatsGrid } from "@/components/StatsGrid";
import { MapView } from "@/components/MapView";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MapPin, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion } from "framer-motion";

export default function Analysis() {
  const [match, params] = useRoute("/analysis/:location");
  const [data, setData] = useState<RealEstateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [_, setLocation] = useLocation();

  useEffect(() => {
    if (!match || !params?.location) {
      setLocation("/");
      return;
    }

    setLoading(true);
    // Simulate API fetch delay
    const timer = setTimeout(() => {
      const locationName = decodeURIComponent(params.location);
      const mockData = generateMockData(locationName);
      setData(mockData);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [match, params, setLocation]);

  if (loading) {
    return <AnalysisSkeleton />;
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar />
      
      <main className="container px-4 py-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
              <MapPin className="h-4 w-4" />
              <span>India</span>
              <span>/</span>
              <span>Karnataka</span> {/* Mock state */}
            </div>
            <h1 className="text-3xl font-display font-bold text-slate-900">{data.location}</h1>
            <p className="text-slate-500 mt-1">Market analysis updated: Feb 2026</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Select defaultValue="apartment">
              <SelectTrigger className="w-[140px] bg-white">
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
                <SelectItem value="plot">Plot</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="buy">
              <SelectTrigger className="w-[120px] bg-white">
                <SelectValue placeholder="Transaction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="buy">Buy</SelectItem>
                <SelectItem value="rent">Rent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Nearby Fallback Alert (Mock logic: if location has "Unknown" string) */}
        {data.location.includes("Unknown") && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Exact location data unavailable</AlertTitle>
            <AlertDescription>
              We're showing data for <b>Nearby Area</b> instead.
            </AlertDescription>
          </Alert>
        )}

        <StatsGrid 
          currentPrice={data.currentPrice} 
          yoyGrowth={data.yoyGrowth}
          projectedGrowth5y={data.projectedGrowth5y}
          projectedGrowth10y={data.projectedGrowth10y}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="history" className="w-full">
              <div className="flex items-center justify-between mb-4">
                <TabsList className="grid w-[300px] grid-cols-2">
                  <TabsTrigger value="history">Historical (1Y)</TabsTrigger>
                  <TabsTrigger value="forecast">Forecast (10Y)</TabsTrigger>
                </TabsList>
                {/* Legend or other controls could go here */}
              </div>
              
              <TabsContent value="history" className="mt-0">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <PriceChart data={data.history} />
                </motion.div>
              </TabsContent>
              
              <TabsContent value="forecast" className="mt-0">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <ForecastChart data={data.forecast} />
                </motion.div>
              </TabsContent>
            </Tabs>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
               <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                  <h3 className="font-semibold text-slate-800 mb-4">Growth Drivers</h3>
                  <ul className="space-y-3">
                    {['Upcoming Metro Station', 'Proximity to Tech Park', 'Infrastructure Upgrades'].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                        <div className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
               </div>
               <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                  <h3 className="font-semibold text-slate-800 mb-4">Market Sentiment</h3>
                  <div className="flex items-center gap-4 mb-2">
                    <div className="h-2 flex-1 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full w-[70%] bg-primary rounded-full"></div>
                    </div>
                    <span className="font-bold text-primary">Bullish</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    70% of analysts predict positive growth for this quarter.
                  </p>
               </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white p-1 rounded-xl shadow-soft border border-border">
               <MapView locationName={data.location} />
               <div className="p-4">
                 <h4 className="font-semibold text-sm text-slate-800 mb-1">Location Insights</h4>
                 <p className="text-xs text-slate-500">
                   {data.location} has seen a {data.yoyGrowth.toFixed(1)}% rise in demand over the last quarter due to new commercial projects.
                 </p>
               </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-xl text-white shadow-xl">
              <h3 className="font-display font-bold text-lg mb-2">Get detailed report</h3>
              <p className="text-slate-300 text-sm mb-4">
                Download a comprehensive PDF report with 50+ data points for {data.location}.
              </p>
              <button className="w-full py-2 bg-white text-slate-900 rounded-lg font-medium text-sm hover:bg-slate-50 transition-colors">
                Download PDF
              </button>
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
          </div>
          <div className="space-y-4">
             <Skeleton className="h-[300px] rounded-xl" />
             <Skeleton className="h-[150px] rounded-xl" />
          </div>
        </div>
      </main>
    </div>
  );
}
