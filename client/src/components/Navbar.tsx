import { Link, useLocation } from "wouter";
import { Search, MapPin } from "lucide-react";

export function Navbar() {
  const [location] = useLocation();
  const isAnalysis = location.startsWith("/analysis");

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md dark:bg-slate-950/80">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <div className="bg-primary rounded-lg p-1.5">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            PropSight<span className="text-primary">.in</span>
          </span>
        </Link>

        {isAnalysis && (
          <div className="hidden md:flex items-center bg-slate-100 rounded-full px-4 py-1.5 border border-slate-200">
            <Search className="h-4 w-4 text-slate-400 mr-2" />
            <input 
              type="text" 
              placeholder="Search another location..." 
              className="bg-transparent border-none focus:outline-none text-sm w-64 text-slate-700 placeholder:text-slate-400"
            />
          </div>
        )}

        <div className="flex items-center gap-4">
          <button className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
            For Buyers
          </button>
          <button className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
            For Sellers
          </button>
          <button className="hidden sm:inline-flex bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-slate-800 transition-colors">
            Get App
          </button>
        </div>
      </div>
    </nav>
  );
}
