

"use client";

import { Star, TrendingUp, InfoIcon } from "lucide-react";
import { Pie, PieChart } from "recharts";
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
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RevenueByPlan, MostPopularPlan } from "@/app/api/subscription/subscription.api";

// Define props
interface RevenuePieChartProps {
  data: RevenueByPlan[];
  title?: string;
  description?: string;
  footerText?: string;
  trendText?: string;
  mostPopularPlan: MostPopularPlan | null;
  formatCurrency?: (value: number) => string;
}

// Utility: abbreviate numbers
const abbreviateNumber = (num: number): string => {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K`;
  return num.toString();
};

// Utility: generate chart config
const generateChartConfig = (data: RevenueByPlan[]): ChartConfig => {
  const config: ChartConfig = {
    totalRevenue: {
      label: "Revenue (VND)",
    },
  };

  data.forEach((item, index) => {
    const sanitized = item.planName.replace(/[^a-zA-Z0-9]/g, "_");
    config[sanitized] = {
      label: item.planName,
      color: `hsl(var(--chart-${(index % 5) + 1}))`,
    };
  });

  return config;
};

// Transform for Recharts
const transformData = (data: RevenueByPlan[], chartConfig: ChartConfig) => {
  return data.map((item) => {
    const sanitized = item.planName.replace(/[^a-zA-Z0-9]/g, "_");
    return {
      planName: item.planName,
      totalRevenue: item.totalRevenue,
      fill: chartConfig[sanitized]?.color || "#000000",
    };
  });
};

// Default formatter
const defaultFormatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);

export function RevenuePieChart({
  data,
  title = "Doanh thu theo gói đăng ký",
  description = "Phân bổ doanh thu năm 2025",
  footerText = "Hiển thị tổng doanh thu theo gói đăng ký cho năm 2025",
  // trendText = "Doanh thu tăng 5.2% trong tháng này",
  mostPopularPlan,
  formatCurrency = defaultFormatCurrency,
}: RevenuePieChartProps) {
  const chartConfig = generateChartConfig(data);
  const chartData = transformData(data, chartConfig);

  // Tổng doanh thu
  const totalRevenue = data.reduce((sum, item) => sum + item.totalRevenue, 0);

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-0">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex text-muted-foreground cursor-help">
                  <InfoIcon className="h-4 w-4" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm font-medium mb-2">Ý nghĩa màu sắc biểu đồ:</p>
                <ul className="text-xs space-y-1">
                  {data.map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{backgroundColor: `hsl(var(--chart-${(index % 5) + 1}))`}} 
                      />
                      <span>{item.planName}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs mt-2">
                  Số liệu trong biểu đồ thể hiện doanh thu (VND) cho từng gói đăng ký
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Most Popular Plan */}
          <div className="w-full md:w-1/4 lg:w-1/5 self-center">
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="flex items-center gap-2 font-medium text-sm mb-2">
                <Star className="w-4 h-4 text-amber-500" />
                <span>Gói phổ biến nhất</span>
              </div>

              {mostPopularPlan ? (
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="font-medium">Tên gói:</span>
                    <span className="text-right">{mostPopularPlan.planName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Số lần mua:</span>
                    <span className="text-right">{mostPopularPlan.purchaseCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Doanh thu:</span>
                    <span className="text-right text-emerald-600 font-medium">
                      {formatCurrency(mostPopularPlan.totalRevenue)}
                    </span>
                  </div>
                  {totalRevenue > 0 && (
                    <div className="flex justify-between">
                      <span className="font-medium">Tỷ lệ:</span>
                      <span className="text-right">
                        {((mostPopularPlan.totalRevenue / totalRevenue) * 100).toFixed(1)}%
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">Đang tải dữ liệu...</p>
              )}
            </div>
            
           
          </div>

          {/* Pie Chart */}
          <div className="w-full md:flex-1">
            <ChartContainer
              config={chartConfig}
              className="mx-auto h-[300px] md:aspect-auto"
            >
              <PieChart
                margin={{ top: 10, right: 10, bottom: 30, left: 10 }}
              >
                <ChartTooltip content={<ChartTooltipContent nameKey="planName" />} />
                <Pie
                  data={chartData}
                  dataKey="totalRevenue"
                  nameKey="planName"
                  labelLine={true}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ payload, ...props }) => {
                    const abbreviated = abbreviateNumber(payload.totalRevenue);
                    return (
                      <text
                        x={props.x}
                        y={props.y}
                        textAnchor={props.textAnchor}
                        dominantBaseline={props.dominantBaseline}
                        fill="hsla(var(--foreground))"
                        fontSize={12}
                      >
                        {abbreviated}
                      </text>
                    );
                  }}
                />
                <ChartLegend
                  content={<ChartLegendContent />}
                  align="center"
                  verticalAlign="bottom"
                  layout="horizontal"
                  className="mt-4"
                />
              </PieChart>
            </ChartContainer>
            
            {/* Total Revenue Summary */}
            <div className="text-center mt-2">
              <p className="text-sm font-medium">Tổng doanh thu: <span className="text-emerald-600">{formatCurrency(totalRevenue)}</span></p>
             
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col md:flex-row justify-between items-center text-sm mt-2 gap-2">
        <div className="leading-none text-muted-foreground">{footerText}</div>
        <div className="flex items-center gap-2 font-medium leading-none text-emerald-600">
       
          <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  );
}