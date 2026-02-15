import { Navbar } from "@/components/Navbar";
import { LocationSelector } from "@/components/LocationSelector";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { DollarSign, Clock, BarChart3 } from "lucide-react";

export default function SellersPage() {
  const [_, setLocation] = useLocation();

  const handleLocationSelect = (value: string) => {
    if (value) {
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
            <span className="bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full text-sm font-bold mb-6 inline-block">
              For Owners & Sellers
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6 leading-tight">
              Sell at the <span className="text-primary">Right Price</span> <br/>
              at the Right Time
            </h1>
            <p className="text-lg text-slate-600 mb-8">
              Get an instant AI valuation, track demand trends, and find the perfect window to list your property.
            </p>
            
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 text-left">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Where is your property located?
              </label>
              <LocationSelector 
                onSelect={handleLocationSelect} 
                placeholder="Enter city or locality (e.g. Bandra West, Mumbai)"
                className="h-14 text-lg"
              />
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
              <DollarSign className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Price Optimization</h3>
            <p className="text-slate-600">
              Determine the optimal listing price based on recent transactions and current market competition.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <Clock className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Timing Advisor</h3>
            <p className="text-slate-600">
              Know when demand is peaking in your sector to sell faster and negotiate better deals.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Future Value</h3>
            <p className="text-slate-600">
              Compare "Sell Now" vs "Hold for 1 Year" scenarios with AI-driven future price projections.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
