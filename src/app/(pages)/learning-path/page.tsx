/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { useSession } from "next-auth/react";
import { LearningPath } from "@/types/learningPath";
import { getAllLearningPaths } from "@/app/api/learning-path/learning-path.api";
import { columns } from "./_components/columns";
import AddLearningPathPopup from "./_components/addlearning-path";

export default function LearningPathManagementPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(true);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchLearningPaths = async () => {
      if (!session?.user?.token) return;

      try {
        setLoading(true);
        const response = await getAllLearningPaths(session.user.token);
        setLearningPaths(response);
      } catch (err) {
        console.error("Error fetching learning paths:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLearningPaths();
  }, [session, refreshTrigger]);

  // Hàm để refresh data sau khi có thay đổi
  const handleUpdate = () => {
    console.log("Refreshing data...");
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Learning Path Management</h1>
        <AddLearningPathPopup onUpdate={handleUpdate} />
      </div>

      <div className="space-y-6">
        <div className="font-medium">Total learning paths: {learningPaths.length}</div>
        <DataTable
          columns={columns(handleUpdate)}
          searchKey="title"
          data={learningPaths}
          isLoading={loading}
        />
      </div>
    </div>
  );
}