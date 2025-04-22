/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, LabelList, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface YearlyRevenue {
  month: string;
  revenue: number;
}

interface YearlyRevenueLineChartProps {
  yearlyRevenue: YearlyRevenue[];
}

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function YearlyRevenueLineChart({ yearlyRevenue }: YearlyRevenueLineChartProps) {
  // Sort yearlyRevenue by month in chronological ascending order
  const sortedRevenue = [...yearlyRevenue].sort((a, b) => {
    const dateA = new Date(a.month);
    const dateB = new Date(b.month);
    return dateA.getTime() - dateB.getTime();
  });

  // Format month for XAxis (e.g., "2024-05" to "May")
  const formatMonthShort = (monthStr: string) => {
    const [year, month] = monthStr.split("-");
    const date = new Date(Number(year), Number(month) - 1);
    return date.toLocaleString("default", { month: "short" });
  };

  // Format month for tooltip (e.g., "2024-05" to "May 2024")
  const formatMonthFull = (monthStr: string) => {
    const [year, month] = monthStr.split("-");
    const date = new Date(Number(year), Number(month) - 1);
    return date.toLocaleString("default", { month: "short", year: "numeric" });
  };

  // Format revenue (e.g., 2000000 to "2.0M")
  const formatRevenue = (value: number) => {
    return `${(value / 1000000).toFixed(1)}M`;
  };

  // Calculate trend (compare last two months)
  const calculateTrend = () => {
    if (sortedRevenue.length < 2) return 0;
    const lastMonth = sortedRevenue[sortedRevenue.length - 1].revenue;
    const prevMonth = sortedRevenue[sortedRevenue.length - 2].revenue;
    if (prevMonth === 0) return lastMonth > 0 ? 100 : 0;
    return ((lastMonth - prevMonth) / prevMonth) * 100;
  };

  const trend = calculateTrend();

  return (
    <Card className="w-full max-w-5xl">
      <CardHeader>
        <CardTitle>Yearly Revenue</CardTitle>
        {/* <CardDescription>i2025</CardDescription> */}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <LineChart
            accessibilityLayer
            data={sortedRevenue}
            margin={{
              top: 20,
              left: 50,
              right: 50,
              bottom: 10, // Giảm bottom margin vì nhãn không xoay
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={10} // Giảm tickMargin vì nhãn không xoay
              tickFormatter={formatMonthShort}
              interval={0}
              fontSize={12}
              width={1100}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={formatRevenue}
              width={60}
              domain={[0, "auto"]}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  formatter={(value) => {
                    const numValue = Number(value);
                    return `${numValue.toLocaleString()} VND`;
                  }}
                  labelFormatter={formatMonthFull}
                />
              }
            />
            <Line
              dataKey="revenue"
              type="monotone"
              stroke="var(--color-revenue)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-revenue)",
              }}
              activeDot={{
                r: 6,
              }}
            >
              <LabelList
                dataKey="revenue"
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
                formatter={formatRevenue}
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {trend > 0
            ? `Trending up by ${trend.toFixed(1)}% this month`
            : trend < 0
            ? `Trending down by ${Math.abs(trend).toFixed(1)}% this month`
            : "No change this month"}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total revenue for the last 12 months
        </div>
      </CardFooter> */}
    </Card>
  );
}