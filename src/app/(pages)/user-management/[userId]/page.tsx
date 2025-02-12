"use client";

import { Button } from "@/components/ui/button";
import { CornerDownLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { use } from "react"; // Import use hook từ React

interface UserDetailPageProps {
  params: Promise<{ userId: string }>; // params là một Promise
}

export default function UserDetailPage({ params }: UserDetailPageProps) {
  const router = useRouter();

  // Giải nén (unwrap) params bằng React.use
  const resolvedParams = use(params); // Dùng React.use() để giải nén promise

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="w-full">
      <Button onClick={handleGoBack} className="space-x-2">
        <CornerDownLeft /> <span>Go back</span>
      </Button>
      {resolvedParams.userId} {/* Truy cập userId sau khi giải nén */}
    </div>
  );
}
