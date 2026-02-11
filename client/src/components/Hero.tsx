import { motion } from "framer-motion";
import { Navigation } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import heroImage from "@/assets/hero-bg.png";
import { POPULAR_LOCATIONS } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";
import { LocationSelector } from "@/components/LocationSelector";

export function Hero() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLocating, setIsLocating] = useState(false);

  const handleLocationSelect = (value: string) => {
    if (value) {
      setLocation(`/analysis/${encodeURIComponent(value)}`);
    }
  };

  const handleUseLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setTimeout(() => {
            setIsLocating(false);
            setLocation("/analysis/Indiranagar, Bengaluru");
            toast({
              title: "Location Detected",
              description: "Showing data for Indiranagar, Bengaluru (Nearby)",
            });
          }, 1500);
        },
        () => {
          setIsLocating(false);
          toast({
            variant: "destructive",
            title: "Location Error",
            description: "Could not detect location. Please search manually.",
          });
        }
      );
    } else {
      setIsLocating(false);
      toast({
        variant: "destructive",
        title: "Not Supported",
        description: "Geolocation is not supported by your browser.",
      });
    }
  };

  return (
    <div className="relative overflow-hidden bg-slate-50 min-h-[calc(100vh-4rem)] flex items-center">
      <div className="absolute inset-0 z-0 opacity-20 md:opacity-100 md:left-1/3 pointer-events-none">
        <img 
          src={heroImage} 
          alt="City Analytics" 
          className="w-full h-full object-cover md:object-contain object-right-bottom mask-image-gradient"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent md:via-slate-50/20"></div>
      </div>

      <div className="container relative z-10 px-4 py-12 md:py-24">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Live Real Estate Data 2025-2026
            </div>
            
            <h1 className="text-4xl md:text-6xl font-display font-bold text-slate-900 leading-tight mb-6">
              Real Estate Analytics <br/><span className="text-primary">Simplified.</span>
            </h1>
            
            <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg">
              Track price trends and get AI-powered 10-year forecasts for any locality in India.
            </p>

            <div className="bg-white p-4 rounded-2xl shadow-xl border border-slate-100 max-w-lg mb-8">
              <div className="flex flex-col gap-3">
                <label className="text-sm font-medium text-slate-700 ml-1">Select Location</label>
                <div className="flex gap-2 w-full">
                   <div className="flex-1">
                     <LocationSelector onSelect={handleLocationSelect} placeholder="Search City, Area, Sector..." />
                   </div>
                </div>
                
                <div className="flex justify-end">
                   <button 
                    onClick={handleUseLocation}
                    disabled={isLocating}
                    className="text-xs font-medium text-primary hover:underline flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <Navigation className={`h-3 w-3 ${isLocating ? 'animate-spin' : ''}`} />
                    {isLocating ? "Detecting location..." : "Use my current location"}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Trending Cities</p>
              <div className="flex flex-wrap gap-2">
                {['Mumbai', 'Bengaluru', 'Delhi NCR', 'Hyderabad'].map((city) => (
                  <button
                    key={city}
                    onClick={() => handleLocationSelect(`${city}`)} // Just searching the city name to find first match or fallback
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-sm text-slate-600 hover:border-primary hover:text-primary transition-colors shadow-sm"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
