"use client";

import React, { useEffect, useState } from "react";
import { PieChart, Pie, Label, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllDomain } from "@/app/api/system-configuration/system.api";
import { Domain } from "@/types/domain";

// Màu sắc cho PieChart
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF4081", "#7B1FA2"];

export default function DomainPieChart() {
  const [domains, setDomains] = useState<Domain[]>([]);
  
  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const response = await getAllDomain();
        setDomains(response);
      } catch (error) {
        console.error("Error fetching domains:", error);
      }
    };

    fetchDomains();
  }, []);

  // Tổng số domain
  const totalDomains = domains.length;

  // Nhóm domain theo ParentDomainId
  const groupedByParent = domains.reduce((acc, domain) => {
    if (domain.parentDomainId) {
      acc[domain.parentDomainId] = (acc[domain.parentDomainId] || 0) + 1;
    }
    return acc;
  }, {} as Record<number, number>);

  // Chỉ lấy 6 ParentDomainId có nhiều domain con nhất
  const sortedParentDomains = Object.entries(groupedByParent)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, 6)
    .map(([parentDomainId, count], index) => ({
      parentDomainId: parseInt(parentDomainId),
      count,
      percentage: ((count / totalDomains) * 100).toFixed(1),
      fill: COLORS[index % COLORS.length], // Chọn màu từ danh sách
    }));

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Domain Distribution</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row items-center">
        {/* Pie Chart */}
        <div className="relative">
          <PieChart width={250} height={250}>
            <Pie
              data={sortedParentDomains}
              dataKey="count"
              nameKey="parentDomainId"
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={5}
              strokeWidth={3}
            >
              {sortedParentDomains.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
              <Label
                value={totalDomains}
                position="center"
                className="fill-foreground text-3xl font-bold"
              />
            </Pie>
          </PieChart>
          <div className="absolute inset-0 flex items-center justify-center text-xl font-bold">
            {totalDomains}
          </div>
        </div>

        {/* Bảng thông tin ParentDomainId */}
        <div className="ml-6">
          <h2 className="text-lg font-semibold mb-2">Top Parent Domains</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Name</th>
                <th className="text-right p-2">Total domain</th>
                <th className="text-right p-2">%</th>
              </tr>
            </thead>
            <tbody>
              {sortedParentDomains.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2 flex items-center">
                    <span className="w-3 h-3 mr-2 rounded-full" style={{ backgroundColor: item.fill }}></span>
                    Parent {item.parentDomainId}
                  </td>
                  <td className="p-2 text-right">{item.count}</td>
                  <td className="p-2 text-right">{item.percentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
