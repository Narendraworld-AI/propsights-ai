import { TrendingUp, TrendingDown, Building2, IndianRupee, BarChart3, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: string;
  trend?: number;
  icon: React.ElementType;
  trendLabel?: string;
}

function StatCard({ label, value, trend, icon: Icon, trendLabel }: StatCardProps) {
  const isPositive = trend && trend > 0;
  
  return (
    <Card className="shadow-sm border-border/50 hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2 rounded-lg ${isPositive ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-600'}`}>
            <Icon className="h-5 w-5" />
          </div>
          {trend !== undefined && (
            <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-accent' : 'text-destructive'}`}>
              {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              <span>{Math.abs(trend).toFixed(1)}%</span>
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
          <h3 className="text-2xl font-bold font-display text-slate-900">{value}</h3>
          {trendLabel && <p className="text-xs text-slate-400 mt-1">{trendLabel}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

export function StatsGrid({ 
  currentPrice, 
  yoyGrowth, 
  cagr5y,
  projectedGrowth10y 
}: { 
  currentPrice: number; 
  yoyGrowth: number; 
  cagr5y: number; 
  projectedGrowth10y: number; 
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard 
        label="Current Price / Sq.Ft" 
        value={`₹${currentPrice.toLocaleString()}`}
        trend={yoyGrowth}
        icon={IndianRupee}
        trendLabel="vs. last year"
      />
      <StatCard 
        label="Annual Growth (YoY)" 
        value={`${yoyGrowth.toFixed(1)}%`}
        trend={yoyGrowth}
        icon={BarChart3}
        trendLabel="Last 12 months"
      />
      <StatCard 
        label="5-Year CAGR" 
        value={`${cagr5y.toFixed(1)}%`}
        trend={cagr5y}
        icon={Building2}
        trendLabel="Compounded annual growth"
      />
      <StatCard 
        label="10-Year Projection" 
        value={`+${projectedGrowth10y.toFixed(0)}%`}
        trend={projectedGrowth10y}
        icon={ArrowUpRight}
        trendLabel="Forecasted appreciation"
      />
    </div>
  );
}
