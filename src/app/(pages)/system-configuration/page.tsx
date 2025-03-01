/*"use client"

import * as React from "react"
import { TrendingUp, Pencil, Trash } from "lucide-react"
import { Label, Pie, PieChart, Cell, Tooltip } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"

const chartData = [
  { name: "Domain 1", value: 12, color: "#0088FE" },
  { name: "Domain 2", value: 22, color: "#00C49F" },
  { name: "Domain 3", value: 12, color: "#FFBB28" },
  { name: "Domain 4", value: 12, color: "#FF8042" },
  { name: "Domain 5", value: 7, color: "#AF19FF" },
  { name: "Domain 6", value: 7, color: "#FF4F4F" },
]

const domainData = [
  { name: "IT", description: "description 1", code: "CODE01" },
  { name: "Kaiwa", description: "description 1", code: "CODE01" },
]

export default function SystemConfigurationPage() {
  const totalValue = chartData.reduce((acc, curr) => acc + curr.value, 0)

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Domain</h2>
      <Card>
        <CardHeader className="items-center pb-0">
          <CardTitle>Pie Chart - Donut with Text</CardTitle>
          <CardDescription>January - June 2024</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <PieChart width={300} height={300}>
            <Tooltip />
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={5}
              nameKey="name"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalValue}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total Value
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
          <div className="space-y-2">
            {chartData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm font-medium">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 font-medium leading-none">
            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Showing total value for the last 6 months
          </div>
        </CardFooter>
      </Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>DOMAIN NAME</TableHead>
            <TableHead>DESCRIPTION</TableHead>
            <TableHead>CODE</TableHead>
            <TableHead>ACTION</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {domainData.map((domain, index) => (
            <TableRow key={index}>
              <TableCell>{domain.name}</TableCell>
              <TableCell>{domain.description}</TableCell>
              <TableCell>{domain.code}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button size="icon" variant="outline">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="destructive">
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
*/