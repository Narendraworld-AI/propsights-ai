import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Clock, Banknote, CalendarCheck } from "lucide-react";
import { SellerInsight } from "@/lib/mockData";

export function SellerGuide({ insights }: { insights: SellerInsight }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-primary/5 border-primary/20 md:col-span-2">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <p className="text-primary font-medium text-sm mb-1">AI Pricing Advisor</p>
                <h3 className="text-2xl font-bold text-slate-900">{insights.suggestedAction}</h3>
                <p className="text-slate-600 text-sm mt-1 max-w-xl">{insights.reasoning}</p>
              </div>
              <div className="text-right shrink-0">
                <Badge className="bg-primary text-white text-lg px-4 py-1">
                   {insights.marketHeat} Market
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
           <CardHeader className="pb-2">
             <CardTitle className="text-sm font-medium text-slate-500">Estimated Price (1 Year)</CardTitle>
           </CardHeader>
           <CardContent>
             <div className="flex items-center gap-2">
               <Banknote className="h-5 w-5 text-green-600" />
               <span className="text-2xl font-bold text-slate-900">₹{insights.estimatedPriceNextYear.toLocaleString()}</span>
               <span className="text-sm font-normal text-slate-500">/ sq.ft</span>
             </div>
           </CardContent>
        </Card>

        <Card>
           <CardHeader className="pb-2">
             <CardTitle className="text-sm font-medium text-slate-500">Best Time to Sell</CardTitle>
           </CardHeader>
           <CardContent>
             <div className="flex items-center gap-2">
               <CalendarCheck className="h-5 w-5 text-primary" />
               <span className="text-xl font-bold text-slate-900">{insights.bestTimeToSell}</span>
             </div>
             <p className="text-xs text-slate-400 mt-1">Based on seasonal demand trends</p>
           </CardContent>
        </Card>

        <Card className="md:col-span-2">
           <CardHeader>
             <CardTitle className="text-lg">Demand Trend Analysis</CardTitle>
           </CardHeader>
           <CardContent>
              <div className="flex items-center justify-between mb-2 text-sm">
                <span className="text-slate-500">Current Buyer Interest</span>
                <span className={`font-bold ${
                  insights.demandTrend === "Rising" ? "text-green-600" : 
                  insights.demandTrend === "Stable" ? "text-amber-600" : "text-red-600"
                }`}>{insights.demandTrend}</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    insights.demandTrend === "Rising" ? "bg-green-500 w-[80%]" : 
                    insights.demandTrend === "Stable" ? "bg-amber-500 w-[50%]" : "bg-red-500 w-[30%]"
                  }`}
                ></div>
              </div>
              <p className="text-xs text-slate-400 mt-3">
                *High demand indicates multiple bids likely. Low demand suggests longer time on market.
              </p>
           </CardContent>
        </Card>
      </div>
    </div>
  );
}
