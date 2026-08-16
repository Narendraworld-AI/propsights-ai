import * as React from "react";
import { Check, ChevronsUpDown, Search, ArrowLeft, Building2, MapPin, Sparkles, X, ChevronRight, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { METRO_CITIES, VERIFIED_AREA_DATA, SEARCHABLE_LOCATIONS } from "@/lib/mockData";

interface LocationSelectorProps {
  onSelect: (value: string) => void;
  className?: string;
  placeholder?: string;
}

export function LocationSelector({ onSelect, className, placeholder = "Search City, Area, Sector..." }: LocationSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCity, setSelectedCity] = React.useState<string | null>(null);
  const [activeSubRegion, setActiveSubRegion] = React.useState<string>("All");

  const handleSelect = (currentValue: string) => {
    setValue(currentValue);
    onSelect(currentValue);
    setOpen(false);
    setSearchQuery("");
    setSelectedCity(null);
    setActiveSubRegion("All");
  };

  // Sub-regions available for the selected city (e.g., Gurgaon, Noida, Delhi in Delhi NCR)
  const availableSubRegions = React.useMemo(() => {
    if (!selectedCity) return [];
    const regions = new Set<string>();
    VERIFIED_AREA_DATA.filter((a) => a.city === selectedCity).forEach((a) => {
      if (a.subRegion) regions.add(a.subRegion);
    });
    return Array.from(regions);
  }, [selectedCity]);

  // Areas for the selected city, optionally filtered by subRegion & searchQuery
  const cityAreas = React.useMemo(() => {
    if (!selectedCity) return [];
    let areas = VERIFIED_AREA_DATA.filter((a) => a.city === selectedCity);

    if (activeSubRegion !== "All") {
      areas = areas.filter((a) => a.subRegion === activeSubRegion);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      areas = areas.filter(
        (a) =>
          a.area.toLowerCase().includes(q) ||
          (a.subRegion && a.subRegion.toLowerCase().includes(q))
      );
    }

    return areas;
  }, [selectedCity, activeSubRegion, searchQuery]);

  // Global search results across all cities
  const globalSearchResults = React.useMemo(() => {
    if (!searchQuery.trim() || selectedCity) return [];
    const query = searchQuery.toLowerCase().trim();

    return SEARCHABLE_LOCATIONS.filter((item) => {
      const matchLabel = item.label.toLowerCase().includes(query);
      const matchArea = item.area.toLowerCase().includes(query);
      const matchCity = item.city.toLowerCase().includes(query);
      const matchSub = item.subRegion && item.subRegion.toLowerCase().includes(query);
      return matchLabel || matchArea || matchCity || matchSub;
    }).slice(0, 20);
  }, [searchQuery, selectedCity]);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setSearchQuery("");
      setSelectedCity(null);
      setActiveSubRegion("All");
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between h-12 text-left font-normal bg-white hover:bg-slate-50/80 border-slate-200 shadow-sm transition-all focus:ring-2 focus:ring-primary/20",
            className
          )}
        >
          <div className="flex items-center gap-2.5 truncate text-slate-800">
            <Search className="h-4 w-4 shrink-0 text-primary opacity-80" />
            {value ? (
              <span className="font-medium text-slate-900">{value}</span>
            ) : (
              <span className="text-slate-400 font-normal">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-40 text-slate-500" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[340px] sm:w-[500px] p-0 shadow-2xl border-slate-200 rounded-xl overflow-hidden" align="start">
        {/* Search Header Input */}
        <div className="flex items-center border-b border-slate-100 px-3.5 py-2.5 bg-slate-50/70">
          <Search className="h-4 w-4 text-slate-400 shrink-0 mr-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              selectedCity
                ? `Search sectors/areas in ${selectedCity}...`
                : "Type sector, locality, or city (e.g. Sector 150, Bandra, Vijay Nagar)..."
            }
            className="w-full bg-transparent text-sm placeholder:text-slate-400 text-slate-800 outline-none"
            autoFocus
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Sub-region Filter Pills (when inside a city with multiple zones) */}
        {selectedCity && availableSubRegions.length > 1 && (
          <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-100/60 border-b border-slate-200/60 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <Filter className="h-3 w-3" /> Zone:
            </span>
            <button
              onClick={() => setActiveSubRegion("All")}
              className={cn(
                "px-2.5 py-1 rounded-md text-xs font-medium transition-colors shrink-0",
                activeSubRegion === "All"
                  ? "bg-primary text-white shadow-2xs"
                  : "bg-white text-slate-600 hover:bg-slate-200/60 border border-slate-200/80"
              )}
            >
              All Zones
            </button>
            {availableSubRegions.map((sub) => (
              <button
                key={sub}
                onClick={() => setActiveSubRegion(sub)}
                className={cn(
                  "px-2.5 py-1 rounded-md text-xs font-medium transition-colors shrink-0",
                  activeSubRegion === sub
                    ? "bg-primary text-white shadow-2xs"
                    : "bg-white text-slate-600 hover:bg-slate-200/60 border border-slate-200/80"
                )}
              >
                {sub}
              </button>
            ))}
          </div>
        )}

        {/* Content Container */}
        <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
          {/* 1. GLOBAL SEARCH MODE (When typing without a selected city) */}
          {!selectedCity && searchQuery.trim().length > 0 ? (
            <div className="p-2">
              <div className="px-2 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Matching Localities & Sectors ({globalSearchResults.length})
              </div>

              {globalSearchResults.length === 0 ? (
                <div className="py-8 text-center text-sm text-slate-500">
                  <MapPin className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                  <p className="font-medium text-slate-700">No matching sector or locality found</p>
                  <p className="text-xs text-slate-400 mt-0.5">Try searching another sector, area, or metro</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {globalSearchResults.map((item) => {
                    const isSelected = value === item.label || value === item.area;
                    return (
                      <button
                        key={`${item.city}-${item.area}`}
                        onClick={() => handleSelect(item.label)}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-lg flex items-center justify-between text-sm transition-colors",
                          isSelected
                            ? "bg-primary/10 text-primary font-medium"
                            : "hover:bg-slate-100 text-slate-700"
                        )}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <MapPin className={cn("h-4 w-4 shrink-0", isSelected ? "text-primary" : "text-slate-400")} />
                          <div className="truncate">
                            <span className="font-medium text-slate-900">{item.area}</span>
                            {!item.isCityLevel && (
                              <span className="text-xs text-slate-500 ml-1.5 font-normal">
                                • {item.city} {item.subRegion ? `(${item.subRegion})` : ""}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/50">
                            ₹{item.avgPrice.toLocaleString("en-IN")}/sqft
                          </span>
                          {isSelected && <Check className="h-4 w-4 text-primary shrink-0" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : selectedCity ? (
            /* 2. CITY DETAIL MODE: Sector-wise breakdown inside selected city */
            <div className="p-2">
              {/* Back to Cities Header */}
              <div className="flex items-center justify-between px-2 py-1.5 mb-1.5 bg-slate-100/70 rounded-lg">
                <button
                  onClick={() => {
                    setSelectedCity(null);
                    setActiveSubRegion("All");
                    setSearchQuery("");
                  }}
                  className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  All Metro Cities
                </button>
                <span className="text-xs font-semibold text-slate-800">{selectedCity}</span>
              </div>

              {/* Entire City Overview Option */}
              <button
                onClick={() => handleSelect(`${selectedCity}`)}
                className="w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between text-sm bg-primary/5 hover:bg-primary/10 text-primary font-medium mb-2 transition-colors border border-primary/20"
              >
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" />
                  <span>Entire {selectedCity} Overview</span>
                </div>
                <span className="text-xs font-semibold bg-white text-primary px-2 py-0.5 rounded-md border border-primary/20 shadow-2xs">
                  {METRO_CITIES[selectedCity]?.priceDisplay || "Overview"}
                </span>
              </button>

              <div className="px-2 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Sector & Locality Benchmarks ({cityAreas.length})</span>
                {activeSubRegion !== "All" && (
                  <span className="text-[11px] font-normal text-primary">Filtered by {activeSubRegion}</span>
                )}
              </div>

              {cityAreas.length === 0 ? (
                <div className="py-6 text-center text-sm text-slate-400">
                  No areas match your filter.
                </div>
              ) : (
                <div className="space-y-1 mt-1">
                  {cityAreas.map((areaItem) => {
                    const fullLabel = `${areaItem.area}, ${areaItem.city}`;
                    const isSelected = value === fullLabel || value === areaItem.area;

                    return (
                      <button
                        key={areaItem.area}
                        onClick={() => handleSelect(fullLabel)}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-lg flex items-center justify-between text-sm transition-colors",
                          isSelected
                            ? "bg-primary/10 text-primary font-medium"
                            : "hover:bg-slate-100 text-slate-700"
                        )}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Check
                            className={cn(
                              "h-3.5 w-3.5 shrink-0 transition-opacity",
                              isSelected ? "opacity-100 text-primary" : "opacity-0"
                            )}
                          />
                          <div className="truncate">
                            <span className="text-slate-900 font-medium">{areaItem.area}</span>
                            {areaItem.subRegion && (
                              <span className="text-[10px] text-slate-400 ml-2 font-normal hidden sm:inline">
                                • {areaItem.subRegion}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs text-slate-600 font-medium bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/60">
                            ₹{areaItem.basePrice.toLocaleString("en-IN")}/sqft
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* 3. DEFAULT METRO CITIES LIST (10 Metros) */
            <div className="p-2">
              <div className="flex items-center justify-between px-2 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <span>Select Metro City</span>
                <span className="text-[11px] font-normal text-slate-400">Click to view sectors</span>
              </div>

              <div className="space-y-1">
                {Object.entries(METRO_CITIES).map(([cityName, cityMeta]) => {
                  const areaCount = VERIFIED_AREA_DATA.filter((a) => a.city === cityName).length;
                  const isCurrentCity = value.includes(cityName);

                  return (
                    <button
                      key={cityName}
                      onClick={() => {
                        setSelectedCity(cityName);
                        setActiveSubRegion("All");
                        setSearchQuery("");
                      }}
                      className={cn(
                        "w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between transition-all group",
                        isCurrentCity
                          ? "bg-slate-100/90 text-slate-900"
                          : "hover:bg-slate-100 text-slate-700"
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                          <Building2 className="h-4 w-4" />
                        </div>
                        <div className="truncate">
                          <div className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                            {cityName}
                            <span className="text-[11px] font-normal text-slate-400 hidden sm:inline">
                              {cityMeta.state}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 truncate">
                            {areaCount} verified sectors & areas • CAGR: {cityMeta.cagr5y}%
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-semibold text-slate-700 bg-slate-200/70 px-2 py-1 rounded-md">
                          {cityMeta.priceDisplay}
                        </span>
                        <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-primary group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Quick Footer */}
        <div className="bg-slate-50 px-3.5 py-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>Verified 2025–2026 Sector Benchmarks</span>
          </div>
          {selectedCity && (
            <button
              onClick={() => {
                setSelectedCity(null);
                setActiveSubRegion("All");
                setSearchQuery("");
              }}
              className="text-primary font-medium hover:underline"
            >
              ← Back to cities
            </button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
