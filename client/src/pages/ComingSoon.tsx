import { Navbar } from "@/components/Navbar";
import { Link } from "wouter";
import { Smartphone, ArrowRight } from "lucide-react";

export default function ComingSoon() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="container px-4 flex flex-col items-center justify-center min-h-[80vh] text-center">
        <div className="bg-white p-4 rounded-full shadow-lg mb-8 animate-bounce">
          <Smartphone className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl md:text-6xl font-display font-bold text-slate-900 mb-6">
          PropSight Mobile App
          <span className="block text-primary mt-2">Coming Soon</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mb-10 leading-relaxed">
          We're building the ultimate real estate companion for your pocket. 
          Get real-time price alerts, augmented reality property tours, and instant valuation reports on the go.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <div className="flex-1 bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-center gap-3 opacity-50 cursor-not-allowed">
            <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="h-8" />
          </div>
          <div className="flex-1 bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-center gap-3 opacity-50 cursor-not-allowed">
            <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Play Store" className="h-8" />
          </div>
        </div>

        <div className="mt-12">
          <Link href="/">
            <a className="text-primary font-medium flex items-center gap-2 hover:underline">
              Back to Dashboard <ArrowRight className="h-4 w-4" />
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
