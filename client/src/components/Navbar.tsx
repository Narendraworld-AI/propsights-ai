import { useState } from "react";
import { Link, useLocation } from "wouter";
import { MapPin, Sun, Moon, Menu, X } from "lucide-react";
import { LocationSelector } from "@/components/LocationSelector";
import { useTheme } from "@/lib/ThemeProvider";

export function Navbar() {
  const [location, setLocation] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isAnalysis = location.startsWith("/analysis");

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md transition-colors">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 gap-2 sm:gap-4">
        {/* Logo */}
        <Link href="/" onClick={closeMobileMenu} className="flex items-center gap-2 cursor-pointer shrink-0">
          <div className="bg-primary rounded-lg p-1.5 shadow-xs">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <span className="font-display text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            PropSight<span className="text-primary">.in</span>
          </span>
        </Link>

        {/* Search in Navbar (Analysis Page only, hidden on small mobile) */}
        {isAnalysis && (
          <div className="hidden lg:flex items-center flex-1 max-w-xs mx-4">
            <LocationSelector
              onSelect={(val) => setLocation(`/analysis/${encodeURIComponent(val)}`)}
              placeholder="Search location..."
              className="h-9 text-xs bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
            />
          </div>
        )}

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6 shrink-0">
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
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-slate-700" />
            )}
          </button>

          <Link
            href="/coming-soon"
            className="bg-slate-900 dark:bg-primary dark:hover:bg-primary/90 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-slate-800 transition-colors shadow-2xs"
          >
            Get App
          </Link>
        </div>

        {/* Mobile Right Controls: Theme Toggle & Hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle Dark / Light Theme"
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:text-primary transition-all shadow-2xs cursor-pointer"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-slate-700" />
            )}
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Open Navigation Menu"
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:text-primary transition-all cursor-pointer"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5 text-slate-900 dark:text-white" />
            ) : (
              <Menu className="h-5 w-5 text-slate-900 dark:text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-200 shadow-xl">
          <Link
            href="/buyers"
            onClick={closeMobileMenu}
            className="block py-2 text-base font-medium text-slate-700 dark:text-slate-200 hover:text-primary"
          >
            For Buyers
          </Link>
          <Link
            href="/sellers"
            onClick={closeMobileMenu}
            className="block py-2 text-base font-medium text-slate-700 dark:text-slate-200 hover:text-primary"
          >
            For Sellers
          </Link>
          <Link
            href="/archive"
            onClick={closeMobileMenu}
            className="block py-2 text-base font-medium text-slate-700 dark:text-slate-200 hover:text-primary"
          >
            10-Yr Historical Archive & Docs
          </Link>
          <Link
            href="/coming-soon"
            onClick={closeMobileMenu}
            className="block w-full text-center bg-primary text-white py-2.5 rounded-xl font-semibold text-sm shadow-md"
          >
            Get App
          </Link>
        </div>
      )}
    </nav>
  );
}
