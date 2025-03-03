"use client";
import { useEffect, useState } from "react";
import AddDomainPopup from "./_components/add-domain-popup";
import { DataTable } from "@/components/data-table";
import { Pagination } from "./_components/Pagination";
import { getAllDomain } from "@/app/api/system-configuration/system.api";
import { columns } from "./_components/columns"; // Gọi columns dưới dạng hàm
import React from "react";
import { Domain } from "@/types/domain";
import DomainPieChart from "./_components/piechart-domain";

export default function DomainManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [domains, setDomains] = useState<Domain[]>([]);
  
  const itemsPerPage = 5;
  const totalPages = Math.ceil(domains.length / itemsPerPage);
  const paginatedDomain = domains.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // 🛠️ Thêm hàm fetchDomains để gọi API và cập nhật state
  const fetchDomains = async () => {
    try {
      setLoading(true);
      console.log("Fetching domains...");

      const response = await getAllDomain();
      setDomains(response);
      console.log(response);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDomains();
  }, []);

  return (
    <div className="p-6">
      {/* Tiêu đề trang */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Domain</h1>
        <AddDomainPopup onUpdate={fetchDomains} />
      </div>
      <DomainPieChart />

      {/* Bảng dữ liệu + Phân trang */}
      <DataTable columns={columns(fetchDomains)} searchKey="name" data={paginatedDomain} isLoading={loading} />
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
}
