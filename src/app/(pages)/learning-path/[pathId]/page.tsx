// app/learning-paths/[pathId]/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { LearningPath } from '@/types/learningPath';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  AlertCircle, 
  Book, 
  Globe, 
  Calendar, 
  Tag 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getLearningPathById } from '@/app/api/learning-path/learning-path.api';

export default function LearningPathDetailPage() {
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { pathId } = useParams();
  const { data: session } = useSession(); // Sử dụng NextAuth session

  useEffect(() => {
    async function fetchLearningPath() {
      try {
        // Kiểm tra xem session và token có tồn tại không
        if (!session?.user?.token) {
          setError('Authentication required');
          setLoading(false);
          return;
        }

        const pathIdNumber = Number(pathId);
        if (isNaN(pathIdNumber)) {
          setError('Invalid learning path ID');
          setLoading(false);
          return;
        }

        const fetchedLearningPath = await getLearningPathById(pathIdNumber, session.user.token);
        setLearningPath(fetchedLearningPath);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch learning path');
        setLoading(false);
      }
    }

    // Chỉ gọi API khi session thay đổi
    fetchLearningPath();
  }, [pathId, session]);

  // Nếu chưa đăng nhập
  if (!session) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Vui lòng đăng nhập để xem chi tiết học trình</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading learning path details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle className="flex items-center text-red-500">
              <AlertCircle className="mr-2" /> Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!learningPath) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>No learning path found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{learningPath.title}</CardTitle>
            <Badge variant={learningPath.public ? "default" : "secondary"}>
              {learningPath.public ? "Public" : "Private"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold flex items-center mb-4">
                <Book className="mr-2 h-5 w-5" /> Description
              </h3>
              <p>{learningPath.description || "No description available"}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold flex items-center mb-4">
                <Globe className="mr-2 h-5 w-5" /> Domain
              </h3>
              <div className="space-y-2">
                <p className="flex items-center">
                  <Tag className="mr-2 h-4 w-4" />
                  <span>{learningPath.domain?.name || "No domain"}</span>
                </p>
                <p className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>
                    Created: {new Date(learningPath.createdAt).toLocaleDateString()}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">
              Courses in this Learning Path
            </h3>
            {learningPath.totalCourses > 0 ? (
              <p>Total Courses: {learningPath.totalCourses}</p>
              // TODO: Add course list component when available
            ) : (
              <p className="text-muted-foreground">No courses in this learning path yet.</p>
            )}
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <Link href="/learning-path">
              <Button variant="outline">Back to List</Button>
            </Link>
            {/* Add edit button if user has permission */}
            {/* <Button>Edit Learning Path</Button> */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}