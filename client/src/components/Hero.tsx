import { motion } from "framer-motion";
import { Search, MapPin, Navigation } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import heroImage from "@/assets/hero-bg.png"; // We'll assume this imports correctly after build
import { POPULAR_LOCATIONS } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";

export function Hero() {
  const [searchValue, setSearchValue] = useState("");
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLocating, setIsLocating] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      setLocation(`/analysis/${encodeURIComponent(searchValue)}`);
    }
  };

  const handleUseLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, we'd reverse geocode here. 
          // For mockup, we'll simulate finding a nearby area
          setTimeout(() => {
            setIsLocating(false);
            setLocation("/analysis/Indiranagar, Bangalore");
            toast({
              title: "Location Detected",
              description: "Showing data for Indiranagar, Bangalore (Nearby)",
            });
          }, 1500);
        },
        (error) => {
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
      {/* Background Graphic */}
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
              Predict the future of your <span className="text-primary">next investment</span>
            </h1>
            
            <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg">
              Analyze property price trends across India with AI-powered forecasts. Get 10-year growth projections for any location.
            </p>

            <div className="bg-white p-2 rounded-2xl shadow-xl border border-slate-100 max-w-lg mb-8">
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Enter locality (e.g. Bandra West, Mumbai)"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400 text-slate-900"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                </div>
                <button 
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2"
                >
                  <Search className="h-5 w-5" />
                  <span className="hidden sm:inline">Analyze</span>
                </button>
              </form>
              
              <div className="mt-2 px-2 pb-1 flex items-center justify-between">
                <button 
                  onClick={handleUseLocation}
                  disabled={isLocating}
                  className="text-sm font-medium text-slate-500 hover:text-primary flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <Navigation className={`h-3.5 w-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                  {isLocating ? "Detecting..." : "Use current location"}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Trending Locations</p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_LOCATIONS.slice(0, 4).map((loc) => (
                  <button
                    key={loc}
                    onClick={() => setLocation(`/analysis/${encodeURIComponent(loc)}`)}
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-sm text-slate-600 hover:border-primary hover:text-primary transition-colors shadow-sm"
                  >
                    {loc.split(',')[0]}
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
