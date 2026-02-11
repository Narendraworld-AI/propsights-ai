import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { Navbar } from "@/components/Navbar";
import { generateMockData, RealEstateData } from "@/lib/mockData";
import { PriceChart } from "@/components/PriceChart";
import { ForecastChart } from "@/components/ForecastChart";
import { PriceHistoryTable } from "@/components/PriceHistoryTable";
import { StatsGrid } from "@/components/StatsGrid";
import { MapView } from "@/components/MapView";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Info, AlertTriangle } from "lucide-react";
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

  useEffect(() => {
    if (!match || !params?.location) {
      setLocation("/");
      return;
    }

    setLoading(true);
    setData(null); // Clear previous data to force re-render

    // Simulate API fetch delay
    const timer = setTimeout(() => {
      try {
        const locationQuery = decodeURIComponent(params.location);
        const mockData = generateMockData(locationQuery);
        
        if (mockData) {
          setData(mockData);
          if (mockData.isNearbyFallback) {
            setShowFallbackDialog(true);
          }
        } else {
          console.error("Failed to generate mock data");
        }
      } catch (error) {
        console.error("Error generating data:", error);
      } finally {
        setLoading(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [match, params?.location]); // Depend on params.location explicitly

  if (loading) {
    return <AnalysisSkeleton />;
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4 bg-slate-50">
        <AlertTriangle className="h-12 w-12 text-slate-300" />
        <h2 className="text-xl font-bold text-slate-700">Unable to load data</h2>
        <p className="text-slate-500">We couldn't generate analytics for this location.</p>
        <Button onClick={() => setLocation("/")}>Search Another Location</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar />
      
      {/* Fallback Notification Dialog */}
      <Dialog open={showFallbackDialog} onOpenChange={setShowFallbackDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-600">
              <AlertTriangle className="h-5 w-5" />
              Exact Location Data Not Found
            </DialogTitle>
            <DialogDescription className="pt-2">
              We couldn't find sufficient data for <strong>{params?.location ? decodeURIComponent(params.location) : "your location"}</strong>. 
              <br/><br/>
              We are showing data for nearby <strong>{data.nearbyLocationName}</strong> instead.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => setShowFallbackDialog(false)}>Understood</Button>
          </div>
        </DialogContent>
      </Dialog>

      <main className="container px-4 py-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
              <MapPin className="h-4 w-4" />
              <span>India</span>
              <span>/</span>
              <span>{data.city}</span>
              <span>/</span>
              <span className="font-semibold text-slate-700">{data.area}</span>
            </div>
            <h1 className="text-3xl font-display font-bold text-slate-900">{data.area}, {data.city}</h1>
            <p className="text-slate-500 mt-1">Market analysis updated: Feb 2026</p>
          </div>
          
          <div className="flex items-center gap-3 flex-wrap">
            <Select defaultValue="apartment">
              <SelectTrigger className="w-[140px] bg-white">
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
                <SelectItem value="plot">Plot</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
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

        {/* Nearby Fallback Alert Banner */}
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
          projectedGrowth5y={data.projectedGrowth5y}
          projectedGrowth10y={data.projectedGrowth10y}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="history" className="w-full">
              <div className="flex items-center justify-between mb-4">
                <TabsList className="grid w-[300px] grid-cols-2">
                  <TabsTrigger value="history">Historical Trend</TabsTrigger>
                  <TabsTrigger value="forecast">Future Forecast</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="history" className="mt-0 space-y-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.99 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <PriceChart data={data.history} />
                </motion.div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <PriceHistoryTable history={data.history} />
                   
                   <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-center">
                      <h3 className="font-semibold text-slate-800 mb-4">Market Sentiment</h3>
                      <div className="flex items-center gap-4 mb-2">
                        <div className="h-2 flex-1 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full w-[80%] bg-primary rounded-full"></div>
                        </div>
                        <span className="font-bold text-primary">Bullish</span>
                      </div>
                      <p className="text-sm text-slate-500 mt-2">
                        Prices in <strong>{data.area}</strong> have grown by {(data.yoyGrowth).toFixed(1)}% in the last year, outperforming the city average.
                      </p>
                   </div>
                </div>
              </TabsContent>
              
              <TabsContent value="forecast" className="mt-0 space-y-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.99 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <ForecastChart data={data.forecast} />
                </motion.div>

                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                  <h3 className="font-semibold text-slate-800 mb-4">Why invest in {data.area}?</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {['High Appreciation Potential', 'Upcoming Infrastructure', 'Rental Demand', 'Connectivity'].map((item, i) => (
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
                       <div className="text-slate-500">Pincode</div>
                       <div className="font-medium text-slate-800">400XXX</div>
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
