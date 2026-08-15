import { Link, useLocation } from "wouter";
import { MapPin } from "lucide-react";
import { LocationSelector } from "@/components/LocationSelector";

export function Navbar() {
  const [location, setLocation] = useLocation();
  const isAnalysis = location.startsWith("/analysis");

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between px-4 gap-4">
        <Link href="/" className="flex items-center gap-2 cursor-pointer shrink-0">
          <div className="bg-primary rounded-lg p-1.5 shadow-xs">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-slate-900">
            PropSight<span className="text-primary">.in</span>
          </span>
        </Link>

        {isAnalysis && (
          <div className="hidden md:flex items-center flex-1 max-w-xs">
            <LocationSelector
              onSelect={(val) => setLocation(`/analysis/${encodeURIComponent(val)}`)}
              placeholder="Search another location..."
              className="h-9 text-xs bg-slate-50 border-slate-200"
            />
          </div>
        )}

        <div className="flex items-center gap-4 shrink-0">
          <Link
            href="/buyers"
            className={`text-sm font-medium transition-colors ${
              location === "/buyers" ? "text-primary font-semibold" : "text-slate-600 hover:text-primary"
            }`}
          >
            For Buyers
          </Link>
          <Link
            href="/sellers"
            className={`text-sm font-medium transition-colors ${
              location === "/sellers" ? "text-primary font-semibold" : "text-slate-600 hover:text-primary"
            }`}
          >
            For Sellers
          </Link>
          <Link
            href="/coming-soon"
            className="hidden sm:inline-flex bg-slate-900 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-slate-800 transition-colors shadow-2xs"
          >
            Get App
          </Link>
        </div>
      </div>
    </nav>
  );
}
