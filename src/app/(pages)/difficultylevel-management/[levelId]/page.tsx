"use client";
import { useEffect, useState } from "react";

import { DifficultyLevel } from "@/types/difficulty-level";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter, useParams } from "next/navigation";
import { getDifficultyLevelByTag } from "@/app/api/difficulty-level/difficulty-level.api";

export default function DifficultyLevelDetailPage() {
  const [difficultyLevel, setDifficultyLevel] = useState<DifficultyLevel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const fetchDifficultyLevel = async () => {
      try {
        if (params.levelId) {
          const levelId = Array.isArray(params.levelId) ? params.levelId[0] : params.levelId;
          console.log("Fetching difficulty level with ID:", levelId); // Debug log
          const data = await getDifficultyLevelByTag(levelId);
          console.log("Fetched data:", data); // Debug log
          setDifficultyLevel(data);
        }
      } catch (err) {
        console.error("Full error:", err); // Detailed error log
        setError("Failed to fetch difficulty level");
      } finally {
        setLoading(false);
      }
    };

    fetchDifficultyLevel();
  }, [params.levelId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!difficultyLevel) return <div>No difficulty level found</div>;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Difficulty Level Details</h1>
        <Button variant="outline" onClick={() => router.back()}>
          Back to List
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{difficultyLevel.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Level ID</p>
              <p>{difficultyLevel.levelId}</p>
            </div>
            <div>
              <p className="font-semibold">Tag</p>
              <p>{difficultyLevel.tag}</p>
            </div>
          </div>
          
          <div>
            <p className="font-semibold">Description</p>
            <p>{difficultyLevel.description}</p>
          </div>
          
          <div>
            <p className="font-semibold">Created At</p>
            <p>{format(new Date(difficultyLevel.createdAt), "HH:mm, dd/MM/yyyy")}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}