"use client";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { columns } from "./_components/columns";

import { Input } from "@/components/ui/input";

import { DifficultyLevel } from "@/types/difficulty-level";
import { getAllDifficultyLevel } from "@/app/api/difficulty-level/difficulty-level.api";

export default function DifficultyLevelManagementPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [difficultyLevels, setDifficultyLevels] = useState<DifficultyLevel[] | undefined>();
  const [searchValue, setSearchValue] = useState<string>("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  useEffect(() => {
    const fetchDifficultyLevels = async () => {
      try {
        setLoading(true);
        const response = await getAllDifficultyLevel();
        setDifficultyLevels(response);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDifficultyLevels();
  }, []);

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Difficulty Level Management</h1>
      
      </div>

      <div className="w-full flex flex-row justify-between">
        <Input
          className="w-[300px]"
          placeholder="Search difficulty level"
          value={searchValue}
          onChange={handleSearchChange}
        />
      </div>

      <div className="font-medium">Total difficulty levels: {difficultyLevels?.length || 0}</div>
      
      <DataTable
        columns={columns}
        data={difficultyLevels || []}
        isLoading={loading}
      />
    </div>
  );
}