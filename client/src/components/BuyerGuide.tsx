import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, TrendingUp, TrendingDown, DollarSign, ShieldCheck, MapPin } from "lucide-react";
import { BuyerInsight } from "@/lib/mockData";

export function BuyerGuide({ insights }: { insights: BuyerInsight }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-900 text-white border-none shadow-lg md:col-span-3">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">AI Recommendation</p>
                <h3 className="text-3xl font-bold font-display flex items-center gap-3">
                  {insights.action}
                  <Badge className={`${
                    insights.action === "Buy" ? "bg-green-500" : 
                    insights.action === "Hold" ? "bg-amber-500" : "bg-red-500"
                  } text-white border-none text-sm`}>
                    {insights.riskLevel} Risk
                  </Badge>
                </h3>
              </div>
              <div className="text-right">
                <p className="text-slate-400 text-sm font-medium mb-1">5Y Potential</p>
                <p className="text-2xl font-bold text-green-400">+{insights.projectedAppreciation.toFixed(1)}%</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-700">
               <p className="text-slate-300 text-sm leading-relaxed flex items-start gap-2">
                 <AlertCircle className="h-5 w-5 text-primary shrink-0" />
                 {insights.reasoning}
               </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
           <CardHeader className="pb-2">
             <CardTitle className="text-sm font-medium text-slate-500">Rental Yield</CardTitle>
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold text-slate-900 flex items-center gap-2">
               {insights.rentalYield.toFixed(1)}%
               <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-1 rounded-full">Annual</span>
             </div>
           </CardContent>
        </Card>

        <Card className="shadow-sm">
           <CardHeader className="pb-2">
             <CardTitle className="text-sm font-medium text-slate-500">Valuation</CardTitle>
           </CardHeader>
           <CardContent>
             <div className="flex items-center gap-2">
               {insights.undervalued ? (
                 <span className="flex items-center gap-1 text-green-600 font-bold text-lg">
                   <TrendingUp className="h-5 w-5" /> Undervalued
                 </span>
               ) : (
                 <span className="flex items-center gap-1 text-amber-600 font-bold text-lg">
                   <TrendingDown className="h-5 w-5" /> Overvalued
                 </span>
               )}
             </div>
             <p className="text-xs text-slate-500 mt-1">Compared to city average</p>
           </CardContent>
        </Card>

        <Card className="shadow-sm">
           <CardHeader className="pb-2">
             <CardTitle className="text-sm font-medium text-slate-500">Market Cycle</CardTitle>
           </CardHeader>
           <CardContent>
             <div className="text-lg font-bold text-slate-800">Growth Phase</div>
             <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
               <div className="bg-primary h-full w-[60%]"></div>
             </div>
           </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top Alternative Sectors</CardTitle>
          <CardDescription>Areas with similar growth potential nearby</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.topSectors.map((sector, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-full border border-slate-200">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium text-slate-700">{sector}</span>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                  High Growth
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
