/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { useSession } from "next-auth/react";
import { LearningPath } from "@/types/learningPath";
import { getAllLearningPaths } from "@/app/api/learning-path/learning-path.api";
import { columns } from "./_components/columns";
import AddLearningPathPopup from "./_components/addlearning-path";
import { Separator } from "@/components/ui/separator";
import EmptyStateComponent from "@/components/empty-state";

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
  }, [session?.user.token, refreshTrigger]);

  // Hàm để refresh data sau khi có thay đổi
  const handleUpdate = () => {
    console.log("Refreshing data...");
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Các lộ trình học tập</h1>
        <AddLearningPathPopup onUpdate={handleUpdate} />
      </div>
      <Separator />
      <div className="space-y-6">
        <div className="font-medium">Tổng cộng: {learningPaths ? learningPaths.length : 0}</div>
        {learningPaths ?
          <DataTable
            columns={columns(handleUpdate)}
            searchKey="title"
            data={learningPaths}
            isLoading={loading}
          />
          :
          <EmptyStateComponent
            message={"Không tìm thấy lộ trình học tập nào"}
            size={400}
            imgageUrl="https://cdni.iconscout.com/illustration/premium/thumb/no-information-found-illustration-download-in-svg-png-gif-file-formats--zoom-logo-document-user-interface-result-pack-illustrations-8944779.png?f=webp" />
        }

      </div>
    </div>
  );
}