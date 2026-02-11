import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      <Hero />
      
      {/* Trust Section */}
      <section className="py-20 border-t border-slate-100 bg-white">
        <div className="container px-4 text-center">
          <p className="text-sm font-medium text-slate-400 mb-8 uppercase tracking-widest">Trusted Data Sources</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {['Government Registry', 'RERA India', 'Market Analytics', 'Top Brokers'].map((source) => (
              <div key={source} className="text-xl font-display font-bold text-slate-800 flex items-center gap-2">
                <div className="h-8 w-8 bg-slate-200 rounded-full"></div>
                {source}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
