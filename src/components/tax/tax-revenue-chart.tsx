"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { taxRevenueData } from "@/lib/data/tax";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export function TaxRevenueChart() {
  const chartData = taxRevenueData.map((r) => ({
    year: r.year.toString(),
    total: r.totalRevenue,
    domestic: r.domesticTax,
    customs: r.customsTax,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tax Revenue Trends (2019-2024)</CardTitle>
        <CardDescription>
          Annual tax revenue collection in Ghana (GH¢ Billions)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => `GH¢${value.toFixed(1)}B`}
                labelStyle={{ color: "#000" }}
              />
              <Legend />
              <Bar dataKey="domestic" fill="#ef4444" name="Domestic Tax" />
              <Bar dataKey="customs" fill="#f97316" name="Customs Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
