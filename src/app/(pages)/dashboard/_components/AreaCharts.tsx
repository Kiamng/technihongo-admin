"use client";

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
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { RevenueByPeriod } from "@/app/api/subscription/subscription.api";

interface RevenueAreaChartProps {
  data: RevenueByPeriod[];
  title?: string;
  description?: string;
  footerText?: string;
  className?: string;
}

const formatMonthLabel = (period: string): string => {
  const monthNum = period.split("-M")[1];
  const months = [
    "Th1", "Th2", "Th3", "Th4", "Th5", "Th6",
    "Th7", "Th8", "Th9", "Th10", "Th11", "Th12",
  ];
  return months[parseInt(monthNum) - 1] || period;
};

const abbreviateNumber = (num: number): string => {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K`;
  return num.toString();
};

const chartConfig: ChartConfig = {
  totalRevenue: {
    label: "Doanh thu (VND)",
    color: "hsl(var(--chart-1))",
  },
};

export function RevenueAreaChart({
  data,
  title = "Doanh thu hàng năm",
  description = "Xu hướng doanh thu năm 2025",
  footerText = "Hiển thị tổng doanh thu theo tháng cho năm 2025",
  className,
}: RevenueAreaChartProps) {
  const chartData = data.map((item) => ({
    period: formatMonthLabel(item.period),
    totalRevenue: item.totalRevenue,
  }));

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] sm:h-[350px] md:h-[400px] w-full">
          <ChartContainer config={chartConfig} className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                accessibilityLayer
                data={chartData}
                margin={{ top: 12, right: 12, left: 12, bottom: 12 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="period"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  fontSize={12}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={abbreviateNumber}
                  fontSize={12}
                  width={40}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  dataKey="totalRevenue"
                  type="monotone"
                  fill="var(--color-totalRevenue)"
                  fillOpacity={0.4}
                  stroke="var(--color-totalRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
      <CardFooter className="text-sm pt-0">
        <div className="leading-none text-muted-foreground">{footerText}</div>
      </CardFooter>
    </Card>
  );
}
