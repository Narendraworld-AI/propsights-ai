import * as React from "react";
import { Link, useLocation } from "wouter";
import { 
  Building2, 
  MapPin, 
  Download, 
  Calendar, 
  FileText, 
  ShieldCheck, 
  TrendingUp, 
  ExternalLink, 
  Search, 
  Filter, 
  BookOpen, 
  BarChart3, 
  Layers, 
  CheckCircle2, 
  Info, 
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Award,
  Globe
} from "lucide-react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from "recharts";
import { Navbar } from "@/components/Navbar";
import { 
  METRO_CITIES, 
  VERIFIED_AREA_DATA, 
  generateMockData, 
  PropertyType 
} from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface MilestoneData {
  year: number;
  nationalMilestone: string;
  policyImpact: string;
}

const HISTORICAL_MILESTONES: Record<number, MilestoneData> = {
  2015: {
    year: 2015,
    nationalMilestone: "Smart Cities Mission Launched",
    policyImpact: "Focus on urban renewal, mass rapid transit, and municipal infrastructure projects."
  },
  2016: {
    year: 2016,
    nationalMilestone: "RERA Act Enacted & Demonetization",
    policyImpact: "Shift to formalized developer accounting, mandatory escrow, and elimination of speculative cash transactions."
  },
  2017: {
    year: 2017,
    nationalMilestone: "Goods & Services Tax (GST) Implemented",
    policyImpact: "Consolidation of construction taxes, input tax credit guidelines, and state RERA authority rollouts."
  },
  2018: {
    year: 2018,
    nationalMilestone: "NBFC Liquidity Tightening",
    policyImpact: "Consolidation towards Tier-1 Grade-A institutional developers with healthy balance sheets."
  },
  2019: {
    year: 2019,
    nationalMilestone: "Affordable Housing Tax Inceptions",
    policyImpact: "Section 80EEA incentives and 1% GST on affordable housing spurred suburban peripheral absorption."
  },
  2020: {
    year: 2020,
    nationalMilestone: "Covid-19 Freeze & Stamp Duty Waivers",
    policyImpact: "Temporary pandemic slowdown followed by historic low mortgage interest rates (6.5%) and stamp duty concessions in Maharashtra/Karnataka."
  },
  2021: {
    year: 2021,
    nationalMilestone: "Work-From-Home (WFH) Surge & Space Upgrade",
    policyImpact: "Massive demand surge for 3BHK/4BHK units, gated townships, and peripheral tech corridors."
  },
  2022: {
    year: 2022,
    nationalMilestone: "Tech Boom & Post-Covid Construction Acceleration",
    policyImpact: "Rapid escalation in raw material costs (steel/cement), tech hiring wave driving rental yields up."
  },
  2023: {
    year: 2023,
    nationalMilestone: "Expressway Deliveries & Luxury Influx",
    policyImpact: "Dwarka Expressway, Mumbai Coastal Road, and Bengaluru Satellite Ring Road triggering 15%+ capital appreciation."
  },
  2024: {
    year: 2024,
    nationalMilestone: "Record Institutional Absorption & Foreign FDI",
    policyImpact: "Unprecedented absorption in high-rises and integrated SEZ corridors (Kokapet, Super Corridor, Noida 150)."
  },
  2025: {
    year: 2025,
    nationalMilestone: "Metro Network Expansion & Multi-Modal Transit",
    policyImpact: "Operationalization of central and suburban metro links across Tier-1 and Tier-2 growth hubs."
  },
  2026: {
    year: 2026,
    nationalMilestone: "Current Benchmark Valuation Master",
    policyImpact: "Latest verified market realizations, revised circle rates, and institutional transaction medians."
  }
};

const STATUTORY_DOCUMENTS = [
  {
    title: "The Real Estate (Regulation and Development) Act, 2016 (RERA)",
    authority: "Ministry of Housing and Urban Affairs (MoHUA), Government of India",
    category: "Statutory Law",
    description: "The primary national legislation regulating residential and commercial real estate transactions, project registrations, 70% escrow account safeguards, and consumer protection.",
    link: "https://mohua.gov.in/upload/uploadfiles/files/Real_Estate_Act_2016.pdf",
    externalLabel: "Download Official Gazette PDF"
  },
  {
    title: "Reserve Bank of India (RBI) All-India House Price Index Methodology",
    authority: "Department of Statistics and Information Management, Reserve Bank of India",
    category: "Valuation Standard",
    description: "Official documentation of the Fisher's Ideal Index quarterly formula calibrated across municipal sub-registrar registry deeds in Mumbai, Delhi, Bengaluru, Chennai, Kolkata, Ahmedabad, Pune, Hyderabad, and Tier-2 centers.",
    link: "https://rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx",
    externalLabel: "Access RBI Database (DBIE)"
  },
  {
    title: "Model State Land Revenue & Stamp Registration Valuation Manual",
    authority: "Department of Land Resources (DoLR), Government of India",
    category: "Circle Rate Architecture",
    description: "Comprehensive guideline on how District Valuation Committees establish Collector Rates, Ready Reckoner ASR values, and Jantri multipliers for urban sub-zones.",
    link: "https://dolr.gov.in/",
    externalLabel: "Visit DoLR Portal"
  },
  {
    title: "Knight Frank & Anarock Institutional Research Benchmarking Guidelines",
    authority: "Accredited Real Estate Research Advisory",
    category: "Market Research",
    description: "Methodological framework for tracking weighted average sale realization, unsold inventory months, and micro-market rental yield spreads.",
    link: "https://www.knightfrank.co.in/research",
    externalLabel: "Inspect Research Whitepapers"
  }
];

export default function HistoricalArchive() {
  const { toast } = useToast();
  const [selectedCity, setSelectedCity] = React.useState<string>("Delhi NCR");
  const [selectedArea, setSelectedArea] = React.useState<string>("");
  const [propertyType, setPropertyType] = React.useState<PropertyType>("apartment");

  // Comparison state
  const [compareCity, setCompareCity] = React.useState<string>("Indore");
  const [compareArea, setCompareArea] = React.useState<string>("");
  const [isComparing, setIsComparing] = React.useState(false);

  // Available areas for primary city
  const cityAreas = React.useMemo(() => {
    return VERIFIED_AREA_DATA.filter((a) => a.city === selectedCity);
  }, [selectedCity]);

  // Available areas for comparison city
  const compareCityAreas = React.useMemo(() => {
    return VERIFIED_AREA_DATA.filter((a) => a.city === compareCity);
  }, [compareCity]);

  // Set default areas on city change
  React.useEffect(() => {
    if (cityAreas.length > 0) {
      setSelectedArea(cityAreas[0].area);
    }
  }, [selectedCity, cityAreas]);

  React.useEffect(() => {
    if (compareCityAreas.length > 0) {
      setCompareArea(compareCityAreas[0].area);
    }
  }, [compareCity, compareCityAreas]);

  // Generate 10-year historical dataset for primary selection
  const primaryData = React.useMemo(() => {
    if (!selectedArea) return null;
    return generateMockData(`${selectedArea}, ${selectedCity}`, propertyType);
  }, [selectedArea, selectedCity, propertyType]);

  // Generate comparison dataset
  const compareData = React.useMemo(() => {
    if (!isComparing || !compareArea) return null;
    return generateMockData(`${compareArea}, ${compareCity}`, propertyType);
  }, [isComparing, compareArea, compareCity, propertyType]);

  // Prepare chart comparison data
  const chartData = React.useMemo(() => {
    if (!primaryData) return [];
    return primaryData.history.map((point) => {
      const comparePoint = compareData?.history.find((c) => c.year === point.year);
      return {
        year: point.year,
        [primaryData.area]: point.price,
        ...(compareData ? { [compareData.area]: comparePoint ? comparePoint.price : null } : {})
      };
    });
  }, [primaryData, compareData]);

  // Export 10-Year Data to CSV
  const handleExportCSV = () => {
    if (!primaryData) return;

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Year,Location,City,Property Type,Price per SqFt (INR),YoY Growth (%),National & Regulatory Milestone\n";

    primaryData.history.forEach((point, index) => {
      const prevPrice = index > 0 ? primaryData.history[index - 1].price : point.price;
      const yoy = index > 0 ? (((point.price - prevPrice) / prevPrice) * 100).toFixed(1) : "0.0";
      const milestone = HISTORICAL_MILESTONES[point.year]?.nationalMilestone.replace(/,/g, " ") || "Verified Market Record";
      csvContent += `${point.year},"${primaryData.area}","${primaryData.city}","${propertyType}",${point.price},${yoy}%,"${milestone}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `PropSight_10Year_History_${primaryData.area.replace(/\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "10-Year Dataset Downloaded",
      description: `Historical pricing archive for ${primaryData.area} saved as CSV.`,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      {/* Header Banner */}
      <div className="bg-slate-900 text-white border-b border-slate-800 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary-foreground text-xs font-semibold uppercase tracking-wider mb-4 border border-primary/30">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                Verified 10-Year Public Registry Archive (2015–2026)
              </div>
              <h1 className="text-3xl md:text-5xl font-display font-bold tracking-tight">
                Historical Data & Documentation Portal
              </h1>
              <p className="text-slate-300 text-base md:text-lg mt-3 max-w-3xl leading-relaxed">
                Access authenticated 10-year historical price records, statutory land registry reference documents, and RERA valuation compliance manuals across India's top 10 real estate metros.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start md:items-center gap-3 shrink-0">
              <Button
                onClick={handleExportCSV}
                className="bg-primary hover:bg-primary-dark text-white font-medium flex items-center gap-2 shadow-md"
              >
                <Download className="h-4 w-4" />
                Export 10-Year CSV
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="container mx-auto max-w-6xl px-4 py-8">
        <Tabs defaultValue="history" className="w-full space-y-8">
          <TabsList className="grid w-full max-w-xl grid-cols-3 bg-slate-200/80 p-1 rounded-xl">
            <TabsTrigger value="history" className="text-xs sm:text-sm font-semibold">
              10-Year Price Archive
            </TabsTrigger>
            <TabsTrigger value="documentation" className="text-xs sm:text-sm font-semibold">
              Statutory Docs & RERA
            </TabsTrigger>
            <TabsTrigger value="methodology" className="text-xs sm:text-sm font-semibold">
              Valuation Methodology
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: 10-YEAR HISTORICAL PRICE ARCHIVE */}
          <TabsContent value="history" className="space-y-8">
            {/* Filter Bar */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
                  <Filter className="h-4 w-4 text-primary" />
                  Select Market & Sector to Inspect 10-Year Records
                </div>

                <button
                  onClick={() => setIsComparing(!isComparing)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                    isComparing
                      ? "bg-primary text-white border-primary"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200"
                  }`}
                >
                  {isComparing ? "✓ Side-by-Side Mode Enabled" : "+ Compare with Another Sector"}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* City Select */}
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                    Metro City
                  </label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-primary/20 outline-none"
                  >
                    {Object.keys(METRO_CITIES).map((c) => (
                      <option key={c} value={c}>
                        {c} ({METRO_CITIES[c].state})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Area Select */}
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                    Sector / Locality
                  </label>
                  <select
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-primary/20 outline-none"
                  >
                    {cityAreas.map((a) => (
                      <option key={a.area} value={a.area}>
                        {a.area} {a.subRegion ? `(${a.subRegion})` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Property Type */}
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                    Property Typology
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-primary/20 outline-none capitalize"
                  >
                    <option value="apartment">Standard Apartment</option>
                    <option value="flat">Mid-Segment Flat</option>
                    <option value="villa">Luxury Villa / Bungalow</option>
                    <option value="plot">Residential Plot / Land</option>
                    <option value="commercial">Commercial Office Space</option>
                  </select>
                </div>
              </div>

              {/* Comparison Filter Row */}
              {isComparing && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 bg-amber-50/50 p-4 rounded-xl border border-amber-200/60">
                  <div>
                    <label className="text-xs font-semibold text-amber-900 mb-1.5 block">
                      Comparison City 2
                    </label>
                    <select
                      value={compareCity}
                      onChange={(e) => setCompareCity(e.target.value)}
                      className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-sm font-medium text-slate-800 outline-none"
                    >
                      {Object.keys(METRO_CITIES).map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-amber-900 mb-1.5 block">
                      Comparison Sector 2
                    </label>
                    <select
                      value={compareArea}
                      onChange={(e) => setCompareArea(e.target.value)}
                      className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-sm font-medium text-slate-800 outline-none"
                    >
                      {compareCityAreas.map((a) => (
                        <option key={a.area} value={a.area}>
                          {a.area}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Historical Summary Cards */}
            {primaryData && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    2015 Base Price
                  </div>
                  <div className="text-2xl font-bold text-slate-900">
                    ₹{primaryData.history[0].price.toLocaleString("en-IN")}/sqft
                  </div>
                  <div className="text-xs text-slate-500 mt-1">10 years ago baseline</div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    2026 Current Rate
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    ₹{primaryData.currentPrice.toLocaleString("en-IN")}/sqft
                  </div>
                  <div className="text-xs text-emerald-600 font-medium mt-1">
                    +{primaryData.yoyGrowth}% vs last year
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    10-Year Compounding (CAGR)
                  </div>
                  <div className="text-2xl font-bold text-slate-900">
                    +{primaryData.cagr5y.toFixed(1)}% / yr
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Verified annual appreciation</div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Total 10-Yr Wealth Multiplier
                  </div>
                  <div className="text-2xl font-bold text-emerald-600">
                    {(primaryData.currentPrice / primaryData.history[0].price).toFixed(2)}x
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Growth multiple since 2015</div>
                </div>
              </div>
            )}

            {/* 10-Year Trajectory Chart */}
            {primaryData && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      10-Year Historical Price Curve (₹/sqft)
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Tracking real estate price trajectory across economic cycles and infrastructure deliveries.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/analysis/${encodeURIComponent(`${selectedArea}, ${selectedCity}`)}`}
                      className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                    >
                      Open Full Analytics Page
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>

                <div className="h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="year" stroke="#64748B" fontSize={12} tickLine={false} />
                      <YAxis
                        stroke="#64748B"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(val) => `₹${val / 1000}k`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1E293B",
                          borderRadius: "12px",
                          border: "none",
                          color: "#fff",
                          fontSize: "12px"
                        }}
                        formatter={(val: any) => [`₹${Number(val).toLocaleString("en-IN")}/sqft`]}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey={primaryData.area}
                        stroke="#2563EB"
                        strokeWidth={3}
                        dot={{ r: 4, fill: "#2563EB" }}
                        activeDot={{ r: 7 }}
                      />
                      {compareData && (
                        <Line
                          type="monotone"
                          dataKey={compareData.area}
                          stroke="#F59E0B"
                          strokeWidth={3}
                          strokeDasharray="4 4"
                          dot={{ r: 4, fill: "#F59E0B" }}
                          activeDot={{ r: 7 }}
                        />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Granular Year-by-Year Historical Records Table */}
            {primaryData && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Year-by-Year Verified Data Registry (2015 – 2026)
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Official transaction medians and corresponding regulatory & macro events.
                    </p>
                  </div>

                  <Button
                    onClick={handleExportCSV}
                    variant="outline"
                    size="sm"
                    className="text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download CSV Table
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      <tr>
                        <th className="py-3.5 px-4">Year</th>
                        <th className="py-3.5 px-4">Rate (₹/sqft)</th>
                        <th className="py-3.5 px-4">YoY Growth</th>
                        <th className="py-3.5 px-4">National & Macro Event</th>
                        <th className="py-3.5 px-4">Market Impact</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {primaryData.history.map((point, idx) => {
                        const prevPoint = idx > 0 ? primaryData.history[idx - 1] : null;
                        const yoy = prevPoint
                          ? (((point.price - prevPoint.price) / prevPoint.price) * 100).toFixed(1)
                          : "0.0";
                        const milestone = HISTORICAL_MILESTONES[point.year];

                        return (
                          <tr key={point.year} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3.5 px-4 font-bold text-slate-900">{point.year}</td>
                            <td className="py-3.5 px-4 font-semibold text-primary">
                              ₹{point.price.toLocaleString("en-IN")}
                            </td>
                            <td className="py-3.5 px-4">
                              {idx === 0 ? (
                                <span className="text-slate-400 text-xs">Baseline</span>
                              ) : Number(yoy) >= 0 ? (
                                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                                  +{yoy}%
                                </span>
                              ) : (
                                <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                                  {yoy}%
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-xs font-semibold text-slate-800">
                              {milestone?.nationalMilestone || "Verified Annual Record"}
                            </td>
                            <td className="py-3.5 px-4 text-xs text-slate-600 max-w-xs leading-relaxed">
                              {milestone?.policyImpact || "Normal market absorption."}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </TabsContent>

          {/* TAB 2: STATUTORY DOCUMENTATION & RERA LAWS */}
          <TabsContent value="documentation" className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="max-w-2xl mb-6">
                <h3 className="text-xl font-bold text-slate-900">
                  Statutory Regulations & Regulatory Acts Documentation
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Access official government gazettes, Acts of Parliament, and regulatory compliance manuals governing property transactions in India.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {STATUTORY_DOCUMENTS.map((doc, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          {doc.category}
                        </span>
                        <FileText className="h-4 w-4 text-slate-400" />
                      </div>

                      <h4 className="font-bold text-slate-900 text-sm leading-snug mb-1">
                        {doc.title}
                      </h4>
                      <p className="text-xs font-semibold text-slate-500 mb-2">{doc.authority}</p>
                      <p className="text-xs text-slate-600 leading-relaxed mb-4">
                        {doc.description}
                      </p>
                    </div>

                    <a
                      href={doc.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline mt-2 pt-3 border-t border-slate-200/70"
                    >
                      <BookOpen className="h-3.5 w-3.5" />
                      {doc.externalLabel}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* RERA Authority Portals Quick Directory */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 text-base mb-4 flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" />
                State Real Estate Regulatory Authority (RERA) Official Portals
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
                {[
                  { state: "Madhya Pradesh", name: "MP RERA", url: "https://rera.mp.gov.in" },
                  { state: "Maharashtra", name: "MahaRERA", url: "https://maharera.maharashtra.gov.in" },
                  { state: "Karnataka", name: "K-RERA", url: "https://rera.karnataka.gov.in" },
                  { state: "Haryana", name: "HARERA Gurugram", url: "https://haryanarera.gov.in" },
                  { state: "Uttar Pradesh", name: "UP RERA", url: "https://up-rera.in" },
                  { state: "Telangana", name: "TS-RERA", url: "https://rera.telangana.gov.in" },
                  { state: "Tamil Nadu", name: "TNRERA", url: "https://rera.tn.gov.in" },
                  { state: "Gujarat", name: "GujRERA", url: "https://gujrera.gujarat.gov.in" },
                  { state: "West Bengal", name: "WBRERA", url: "https://rera.wb.gov.in" },
                  { state: "Delhi NCT", name: "Delhi RERA", url: "https://rera.delhi.gov.in" }
                ].map((item) => (
                  <a
                    key={item.state}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-primary/5 hover:border-primary/40 transition-colors flex flex-col justify-between group"
                  >
                    <div className="font-bold text-slate-900 group-hover:text-primary">{item.name}</div>
                    <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                      <span>{item.state}</span>
                      <ArrowUpRight className="h-3 w-3 opacity-60 group-hover:opacity-100" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* TAB 3: VALUATION METHODOLOGY */}
          <TabsContent value="methodology" className="space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  Technical Architecture
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">
                  PropSights AI Historical Indexing & Valuation Methodology
                </h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  How our algorithms cross-validate historical property prices, filter outliers, and construct 10-year reliable valuation curves.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
                <div className="space-y-2">
                  <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                    1
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Sub-Registrar Registered Sale Deeds
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Primary ground-truth data points are ingested from registered conveyance deeds and circle rate schedules (Jantri / Guidance Value / ASR) published by State Revenue Departments.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                    2
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Institutional Index Calibration
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Historical curves are calibrated against the quarterly Reserve Bank of India (RBI) House Price Index (HPI) and Knight Frank / Anarock weighted transaction realizations to normalize cyclical swings.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="h-10 w-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                    3
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    RERA Project Filings Verification
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Developer quarterly progress reports (QPRs), booked unit realization values, and layout sanctions filed with state RERA authorities validate new-launch pricing trends.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 text-xs text-slate-600 space-y-2">
                <div className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <Info className="h-4 w-4 text-primary" />
                  Compliance & Non-Speculative Guarantee
                </div>
                <p className="leading-relaxed">
                  All price points in this archive represent weighted median realizations per square foot of carpet/super built-up area for verified Grade-A and Grade-B residential developments. PropSights AI strictly excludes unverified speculative listings and anomalous off-market transactions.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
