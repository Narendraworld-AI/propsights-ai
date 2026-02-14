import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend, ComposedChart, Line } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import { memo } from "react";

interface ForecastChartProps {
  data: Array<{ 
    year: number; 
    price: number; 
    lowerBound: number; 
    upperBound: number;
    conservative: number;
    aggressive: number; 
  }>;
}

const ForecastChart = memo(({ data }: ForecastChartProps) => {
  if (!data || data.length === 0) return (
    <div className="h-[300px] w-full flex items-center justify-center text-slate-400 bg-slate-50 rounded-xl">
      No forecast data available
    </div>
  );

  return (
    <Card className="shadow-soft border-border/50 relative overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-800">10-Year Price Forecast</CardTitle>
            <CardDescription>AI-driven projection with conservative & aggressive scenarios</CardDescription>
          </div>
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 gap-1">
            <AlertCircle className="h-3 w-3" />
            Estimate
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(172 66% 50%)" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="hsl(172 66% 50%)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(220 13% 91%)" />
              <XAxis 
                dataKey="year" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: 'hsl(215 16% 47%)' }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: 'hsl(215 16% 47%)' }} 
                tickFormatter={(value) => `₹${(value/1000).toFixed(0)}k`}
                domain={['dataMin - 2000', 'auto']}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.1)' }}
                formatter={(value: number, name: string) => {
                  if (name === "price") return [`₹${value.toLocaleString()}`, 'Projected (Moderate)'];
                  if (name === "conservative") return [`₹${value.toLocaleString()}`, 'Conservative'];
                  if (name === "aggressive") return [`₹${value.toLocaleString()}`, 'Aggressive'];
                  return [null, null];
                }}
                labelFormatter={(label) => `Year: ${label}`}
              />
              <Legend verticalAlign="top" height={36}/>
              
              {/* Range Band (Optional visual aid) */}
              <Area 
                dataKey="upperBound" 
                stroke="none" 
                fill="hsl(172 66% 50%)" 
                fillOpacity={0.05} 
                name="Confidence Band"
              />
              <Area 
                dataKey="lowerBound" 
                stroke="none" 
                fill="white" 
                fillOpacity={1} 
              />
              
              {/* Trend Lines */}
              <Line 
                name="aggressive"
                type="monotone" 
                dataKey="aggressive" 
                stroke="hsl(172 66% 40%)" 
                strokeWidth={1}
                strokeDasharray="3 3"
                dot={false}
              />
              <Line 
                name="price"
                type="monotone" 
                dataKey="price" 
                stroke="hsl(172 66% 50%)" 
                strokeWidth={3}
                dot={{ r: 3, fill: "hsl(172 66% 50%)", strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                name="conservative"
                type="monotone" 
                dataKey="conservative" 
                stroke="hsl(172 66% 40%)" 
                strokeWidth={1}
                strokeDasharray="3 3"
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-4 text-xs text-slate-400 text-center">
          *Projections based on inflation, infrastructure growth, and historical cycles.
        </p>
      </CardContent>
    </Card>
  );
});

export { ForecastChart };
