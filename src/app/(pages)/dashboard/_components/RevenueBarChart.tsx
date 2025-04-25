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
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { RevenueByPeriod } from "@/app/api/subscription/subscription.api";

interface RevenueBarChartProps {
  data: RevenueByPeriod[];
  periodType: "weekly" | "monthly" | "quarterly" | "yearly";
  title?: string;
  description?: string;
  footerText?: string;
  className?: string;
}

const formatPeriodLabel = (
  period: string,
  periodType: "weekly" | "monthly" | "quarterly" | "yearly"
): string => {
  if (periodType === "weekly") {
    return `T${period.split("-W")[1]}`;
  } else if (periodType === "monthly") {
    return `T${period.split("-M")[1]}`;
  } else if (periodType === "quarterly") {
    return `Q${period.split("-Q")[1]}`;
  } else {
    return period;
  }
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

export function RevenueBarChart({
  data,
  periodType,
  title = "Doanh thu theo kỳ",
  description = "Xu hướng doanh thu năm 2025",
  footerText = "Hiển thị tổng doanh thu theo kỳ cho năm 2025",
  className,
}: RevenueBarChartProps) {
  const chartData = data.map((item) => ({
    period: formatPeriodLabel(item.period, periodType),
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
              <BarChart
                accessibilityLayer
                data={chartData}
                margin={{ top: 12, right: 12, left: 0, bottom: 12 }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
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
                <Bar
                  dataKey="totalRevenue"
                  fill="var(--color-totalRevenue)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={60}
                />
              </BarChart>
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
