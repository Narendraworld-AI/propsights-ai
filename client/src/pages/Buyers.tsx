import { Navbar } from "@/components/Navbar";
import { LocationSelector } from "@/components/LocationSelector";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { TrendingUp, ShieldCheck, MapPin } from "lucide-react";

export default function BuyersPage() {
  const [_, setLocation] = useLocation();

  const handleLocationSelect = (value: string) => {
    if (value) {
      // Redirect to analysis page with buyer focus if possible, or just standard analysis
      // Since we want specific "For Buyers" page, we could also render data here, 
      // but re-using Analysis page logic is more robust for now.
      // Let's redirect to Analysis for the location.
      setLocation(`/analysis/${encodeURIComponent(value)}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="container px-4 py-12">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-bold mb-6 inline-block">
              For Buyers & Investors
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6 leading-tight">
              Find Undervalued Properties <br/>
              <span className="text-primary">Before Everyone Else</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8">
              Use AI to identify high-growth sectors, analyze rental yields, and check fair market valuations across India.
            </p>
            
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 text-left">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Where are you looking to buy?
              </label>
              <LocationSelector 
                onSelect={handleLocationSelect} 
                placeholder="Enter city or locality (e.g. Whitefield, Bangalore)"
                className="h-14 text-lg"
              />
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Growth Forecasts</h3>
            <p className="text-slate-600">
              See which areas are projected to appreciate by 20%+ over the next 3 years based on infrastructure data.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <ShieldCheck className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Risk Assessment</h3>
            <p className="text-slate-600">
              Evaluate market stability and potential downside risks before you make an offer.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Smart Discovery</h3>
            <p className="text-slate-600">
              Find alternative sectors nearby that offer better value for money and higher rental yields.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
