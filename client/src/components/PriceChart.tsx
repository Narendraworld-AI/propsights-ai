import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar, Cell } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface PriceChartProps {
  data: Array<{ year: number; price: number }>;
}

export function PriceChart({ data }: PriceChartProps) {
  if (!data || data.length === 0) return (
    <div className="h-[300px] w-full flex items-center justify-center text-slate-400 bg-slate-50 rounded-xl">
      No historical data available
    </div>
  );

  return (
    <Card className="shadow-soft border-border/50">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-800">Historical Price Trend (10 Years)</CardTitle>
        <CardDescription>Yearly average price per sq. ft.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(221 83% 53%)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(221 83% 53%)" stopOpacity={0}/>
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
                domain={['dataMin - 1000', 'auto']}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.1)' }}
                formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Avg. Price/sq.ft']}
                labelFormatter={(label) => `Year: ${label}`}
              />
              <Area 
                type="monotone" 
                dataKey="price" 
                stroke="hsl(221 83% 53%)" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorPrice)" 
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
