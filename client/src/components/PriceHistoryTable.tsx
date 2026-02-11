import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

interface PriceHistoryTableProps {
  history: Array<{ year: number; price: number }>;
}

export function PriceHistoryTable({ history }: PriceHistoryTableProps) {
  // Calculate YoY growth for table display
  const dataWithGrowth = history.map((point, index) => {
    const prevPoint = history[index - 1];
    let growth = 0;
    if (prevPoint) {
      growth = ((point.price - prevPoint.price) / prevPoint.price) * 100;
    }
    return { ...point, growth };
  }).reverse(); // Show newest first

  return (
    <Card className="shadow-soft border-border/50">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-800">Annual Price Data</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[300px] overflow-auto">
          <Table>
            <TableHeader className="bg-slate-50 sticky top-0">
              <TableRow>
                <TableHead className="w-[100px]">Year</TableHead>
                <TableHead>Price / Sq.Ft</TableHead>
                <TableHead className="text-right">Change</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dataWithGrowth.map((row, index) => (
                <TableRow key={row.year}>
                  <TableCell className="font-medium text-slate-700">{row.year}</TableCell>
                  <TableCell>₹{row.price.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <div className={`flex items-center justify-end gap-1 ${
                      row.growth > 0 ? 'text-green-600' : row.growth < 0 ? 'text-red-600' : 'text-slate-400'
                    }`}>
                      {row.growth !== 0 && (
                        Math.abs(row.growth) > 0 ? (
                          row.growth > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />
                        ) : <Minus className="h-3 w-3" />
                      )}
                      {index === dataWithGrowth.length - 1 ? '-' : `${Math.abs(row.growth).toFixed(1)}%`}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
