import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { METRO_CITIES, VERIFIED_AREA_DATA } from "@/lib/mockData";
import { useLocation, Link } from "wouter";
import { ArrowRight, Building2, TrendingUp, ShieldCheck, BarChart3, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [_, setLocation] = useLocation();

  const handleCityClick = (city: string) => {
    setLocation(`/analysis/${encodeURIComponent(city)}`);
  };

  const handleAreaClick = (area: string, city: string) => {
    setLocation(`/analysis/${encodeURIComponent(`${area}, ${city}`)}`);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 font-sans transition-colors">
      <Navbar />
      <Hero />

      {/* Metro City Intelligence Section */}
      <section className="py-16 px-4 container mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              Verified 2025–2026 Intelligence
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white">
              Explore India's Top Real Estate Metros
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mt-2 max-w-xl">
              Sector-wise benchmark pricing, 5-year historical CAGR, and AI-powered 10-year valuation projections.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(METRO_CITIES).map(([cityName, cityMeta], idx) => {
            const topAreas = VERIFIED_AREA_DATA.filter((a) => a.city === cityName).slice(0, 3);

            return (
              <motion.div
                key={cityName}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-lg hover:border-primary/40 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                          {cityName}
                        </h3>
                        <p className="text-xs text-slate-400 dark:text-slate-500">{cityMeta.state}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-4 bg-slate-50 dark:bg-slate-950/80 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="text-[11px] text-slate-400 font-medium block">Avg Price</span>
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{cityMeta.priceDisplay}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 font-medium block">5Y CAGR</span>
                      <span className="text-sm font-bold text-emerald-600">+{cityMeta.cagr5y}%</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 mb-4">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Prime Localities:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {topAreas.map((area) => (
                        <button
                          key={area.area}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAreaClick(area.area, cityName);
                          }}
                          className="text-xs bg-slate-100/80 dark:bg-slate-800 hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary dark:hover:text-primary text-slate-700 dark:text-slate-200 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                        >
                          {area.area.split(" (")[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleCityClick(cityName)}
                  className="w-full mt-2 py-2 px-3 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-primary hover:text-white dark:hover:bg-primary text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors group-hover:bg-primary group-hover:text-white cursor-pointer"
                >
                  View City Analytics
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-16 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 transition-colors">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white">
              Institutional-Grade Intelligence for Everyone
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mt-2">
              Combining official registration data, verified local transactions, and predictive algorithms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
              <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">12-Year Price History</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Granular price per sqft historical curves tracking market cycles, post-pandemic boom, and infra impacts.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
              <div className="h-12 w-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">10-Year AI Forecasts</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Predictive upper, conservative, and aggressive growth bands modeled on inflation, metro lines, and demand.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
              <div className="h-12 w-12 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Buyer & Seller Playbooks</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Actionable recommendations with risk ratings, market heat index, and optimal transaction timing.
              </p>
            </div>
          </div>

          {/* 10-Year Archive & Documentation Highlight Box */}
          <div className="mt-12 max-w-5xl mx-auto bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 text-white rounded-3xl p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 text-primary-foreground text-xs font-semibold uppercase tracking-wider border border-primary/30">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                Public Registry & Valuation Archive
              </div>
              <h3 className="text-2xl font-bold font-display text-white">
                Looking for 10-Year Historical Data & Official Documentation?
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Inspect year-by-year price trajectories from 2015 to 2026, compare sectors side-by-side, export CSV archives, and access RERA statutory acts and RBI valuation methodologies.
              </p>
            </div>
            <Link
              href="/archive"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-md transition-all shrink-0 hover:translate-x-0.5"
            >
              Open 10-Yr Archive & Docs
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 transition-colors">
        <div className="container px-4 text-center">
          <p className="text-xs font-semibold text-slate-400 mb-6 uppercase tracking-widest">
            Verified Benchmarks & Data Inputs
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 opacity-60">
            {["RERA State Registries", "Knight Frank & Anarock Indices", "RBI Housing Price Index", "Municipal Circles & Sub-Registrars"].map((source) => (
              <span key={source} className="text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 shadow-2xs">
                {source}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
