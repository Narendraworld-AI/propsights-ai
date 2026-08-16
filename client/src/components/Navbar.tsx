import { Link, useLocation } from "wouter";
import { MapPin, Sun, Moon } from "lucide-react";
import { LocationSelector } from "@/components/LocationSelector";
import { useTheme } from "@/lib/ThemeProvider";

export function Navbar() {
  const [location, setLocation] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const isAnalysis = location.startsWith("/analysis");

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md transition-colors">
      <div className="container flex h-16 items-center justify-between px-4 gap-4">
        <Link href="/" className="flex items-center gap-2 cursor-pointer shrink-0">
          <div className="bg-primary rounded-lg p-1.5 shadow-xs">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            PropSight<span className="text-primary">.in</span>
          </span>
        </Link>

        {isAnalysis && (
          <div className="hidden md:flex items-center flex-1 max-w-xs">
            <LocationSelector
              onSelect={(val) => setLocation(`/analysis/${encodeURIComponent(val)}`)}
              placeholder="Search another location..."
              className="h-9 text-xs bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
            />
          </div>
        )}

        <div className="flex items-center gap-4 shrink-0">
          <Link
            href="/buyers"
            className={`text-sm font-medium transition-colors ${
              location === "/buyers" 
                ? "text-primary font-semibold" 
                : "text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary"
            }`}
          >
            For Buyers
          </Link>
          <Link
            href="/sellers"
            className={`text-sm font-medium transition-colors ${
              location === "/sellers" 
                ? "text-primary font-semibold" 
                : "text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary"
            }`}
          >
            For Sellers
          </Link>
          <Link
            href="/archive"
            className={`text-sm font-medium transition-colors flex items-center gap-1 ${
              location === "/archive" || location === "/documentation"
                ? "text-primary font-semibold"
                : "text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary"
            }`}
          >
            10-Yr Archive & Docs
          </Link>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Dark / Light Theme"
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:text-primary dark:hover:text-primary hover:border-primary/50 transition-all shadow-2xs cursor-pointer flex items-center justify-center"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-amber-400 animate-spin-once" />
            ) : (
              <Moon className="h-4 w-4 text-slate-700" />
            )}
          </button>

          <Link
            href="/coming-soon"
            className="hidden sm:inline-flex bg-slate-900 dark:bg-primary dark:hover:bg-primary/90 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-slate-800 transition-colors shadow-2xs"
          >
            Get App
          </Link>
        </div>
      </div>
    </nav>
  );
}
