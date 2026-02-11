import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";

interface ForecastChartProps {
  data: Array<{ date: string; price: number; lowerBound: number; upperBound: number }>;
}

export function ForecastChart({ data }: ForecastChartProps) {
  return (
    <Card className="shadow-soft border-border/50 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 100C0 44.7715 44.7715 0 100 0C155.228 0 200 44.7715 200 100C200 155.228 155.228 200 100 200C44.7715 200 0 155.228 0 100Z" fill="currentColor" className="text-primary"/>
        </svg>
      </div>
      
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-800">10-Year Price Forecast</CardTitle>
            <CardDescription>AI-powered projection with confidence intervals</CardDescription>
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
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(172 66% 50%)" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="hsl(172 66% 50%)" stopOpacity={0}/>
                </linearGradient>
                <pattern id="stripe-pattern" patternUnits="userSpaceOnUse" width="4" height="4">
                  <path d="M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2" style={{ stroke: 'hsl(172 66% 50%)', strokeWidth: 1, opacity: 0.2 }} />
                </pattern>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(220 13% 91%)" />
              <XAxis 
                dataKey="date" 
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
                domain={['auto', 'auto']}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.1)' }}
                formatter={(value: number, name: string) => {
                  if (name === "price") return [`₹${value.toLocaleString()}`, 'Projected Price'];
                  if (name === "upperBound") return [`₹${value.toLocaleString()}`, 'Upper Bound'];
                  if (name === "lowerBound") return [`₹${value.toLocaleString()}`, 'Lower Bound'];
                  return [value, name];
                }}
              />
              <Legend verticalAlign="top" height={36}/>
              
              {/* Confidence Interval Area */}
              <Area 
                dataKey="upperBound" 
                stroke="none" 
                fill="hsl(172 66% 50%)" 
                fillOpacity={0.1} 
              />
              <Area 
                dataKey="lowerBound" 
                stroke="none" 
                fill="white" 
                fillOpacity={1} 
              />
              
              {/* Main Trend Line */}
              <Area 
                name="price"
                type="monotone" 
                dataKey="price" 
                stroke="hsl(172 66% 50%)" 
                strokeWidth={3}
                strokeDasharray="5 5"
                fill="url(#colorForecast)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-4 text-xs text-slate-400 text-center">
          *Projections are based on historical data and market trends. Actual prices may vary.
        </p>
      </CardContent>
    </Card>
  );
}
