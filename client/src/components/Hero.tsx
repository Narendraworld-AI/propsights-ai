import { motion } from "framer-motion";
import { Navigation } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import heroImage from "@/assets/hero-bg.png";
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
    <div className="relative overflow-hidden bg-slate-50 dark:bg-slate-950 min-h-[calc(100vh-4rem)] flex items-center transition-colors">
      <div className="absolute inset-0 z-0 opacity-30 md:opacity-100 md:left-1/3 pointer-events-none">
        <img 
          src={heroImage} 
          alt="City Analytics" 
          className="w-full h-full object-cover md:object-contain object-right-bottom"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent dark:from-slate-950 dark:via-slate-950/85 dark:to-transparent"></div>
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
            
            <h1 className="text-4xl md:text-6xl font-display font-bold text-slate-900 dark:text-white leading-tight mb-6">
              Real Estate Analytics <br/><span className="text-primary">Simplified.</span>
            </h1>
            
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed max-w-lg">
              Track price trends and get AI-powered 10-year forecasts for any locality in India.
            </p>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-xl dark:shadow-2xl border border-slate-100 dark:border-slate-800 max-w-lg mb-8 transition-colors">
              <div className="flex flex-col gap-3">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Select Location</label>
                <div className="flex gap-2 w-full">
                   <div className="flex-1">
                     <LocationSelector onSelect={handleLocationSelect} placeholder="Search City, Area, Sector..." />
                   </div>
                </div>
                
                <div className="flex justify-end">
                   <button 
                    onClick={handleUseLocation}
                    disabled={isLocating}
                    className="text-xs font-medium text-primary hover:underline flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <Navigation className={`h-3 w-3 ${isLocating ? 'animate-spin' : ''}`} />
                    {isLocating ? "Detecting location..." : "Use my current location"}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">Top Indian Metros & Growth Hubs</p>
              <div className="flex flex-wrap gap-2">
                {['Delhi NCR', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Pune', 'Chennai', 'Indore', 'Bhopal', 'Ahmedabad', 'Kolkata'].map((city) => (
                  <button
                    key={city}
                    onClick={() => handleLocationSelect(`${city}`)}
                    className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-700 dark:text-slate-200 hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-all shadow-2xs cursor-pointer"
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
