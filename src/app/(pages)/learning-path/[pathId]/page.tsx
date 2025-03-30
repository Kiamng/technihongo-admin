/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { LearningPath } from "@/types/learningPath";
import { AlertCircle, Book, Globe, Calendar, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { getLearningPathById, updateLearningPath } from "@/app/api/learning-path/learning-path.api";
import { getPathCourseListByLearningPathId } from "@/app/api/path-course/path-course.api";
import { toast } from "sonner";
import { PathCoursesTable } from "../_components/pathCourse/columns";
import AddPathCoursePopup from "../_components/pathCourse/createPathCourse";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CreateLearningPathSchema } from "@/schema/learning-path";
import { LoaderCircle } from "lucide-react";

export default function LearningPathDetailPage() {
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [pathCourses, setPathCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { pathId } = useParams();
  const pathIdNumber = Number(pathId);
  const { data: session, status } = useSession();

  const form = useForm<z.infer<typeof CreateLearningPathSchema>>({
    resolver: zodResolver(CreateLearningPathSchema),
    defaultValues: {
      title: "",
      description: "",
      domainId: undefined,
      isPublic: false,
    },
  });

  const fetchLearningPath = async () => {
    try {
      if (!session?.user?.token) {
        setError("Authentication required");
        return;
      }

      if (isNaN(pathIdNumber)) {
        setError("Invalid learning path ID");
        return;
      }

      const fetchedLearningPath = await getLearningPathById(
        pathIdNumber,
        session.user.token
      );
      setLearningPath(fetchedLearningPath);
      form.reset({
        title: fetchedLearningPath.title || "",
        description: fetchedLearningPath.description || "",
        domainId: fetchedLearningPath.domain?.domainId,
        isPublic: fetchedLearningPath.public === true,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch learning path"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchPathCourses = async () => {
    try {
      setLoadingCourses(true);
      if (!session?.user?.token) {
        console.error("No authentication token available");
        setPathCourses([]);
        return;
      }

      const courses = await getPathCourseListByLearningPathId({
        pathId: pathIdNumber,
        token: session.user.token,
        pageNo: 0,
        pageSize: 100,
        sortBy: "courseOrder",
        sortDir: "asc",
      });

      if (Array.isArray(courses)) {
        const sortedCourses = [...courses].sort(
          (a, b) => (a.courseOrder ?? 0) - (b.courseOrder ?? 0)
        );
        setPathCourses(sortedCourses);
      } else {
        setPathCourses([]);
      }
    } catch (error) {
      console.error("Error fetching path courses:", error);
      toast.error("Failed to fetch path courses");
      setPathCourses([]);
    } finally {
      setLoadingCourses(false);
    }
  };

  useEffect(() => {
    async function loadInitialData() {
      if (!session) return;

      setLoading(true);
      await fetchLearningPath();
      await fetchPathCourses();
    }

    loadInitialData();
  }, [pathId, session]);

  const onSubmit = async (values: z.infer<typeof CreateLearningPathSchema>) => {
    if (!session?.user?.token) {
      toast.error("Authentication required. Please log in again.");
      return;
    }

    try {
      setIsSaving(true);
      const updateData = {
        title: values.title.trim(),
        description: values.description.trim(),
        domainId: Number(values.domainId),
        isPublic: values.isPublic === true,
      };

      const response = await updateLearningPath(
        pathIdNumber,
        updateData,
        session.user.token
      );

      if (!response || response.success === false) {
        toast.error(response?.message || "Failed to update learning path!");
      } else {
        toast.success("Learning path updated successfully!");
        await fetchLearningPath(); // Làm mới dữ liệu sau khi lưu
      }
    } catch (error: any) {
      console.error("Update error:", error);
      toast.error(error?.response?.data?.message || error?.message || "An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Đang kiểm tra thông tin đăng nhập...
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Vui lòng đăng nhập để xem chi tiết học trình
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading learning path details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-[400px] p-6 border rounded-lg">
          <h2 className="flex items-center text-red-500">
            <AlertCircle className="mr-2" /> Error
          </h2>
          <p className="text-destructive mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (!learningPath) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        No learning path found.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="border rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-6">Edit Learning Path</h1>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Book className="inline mr-2 h-5 w-5" /> Title
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Book className="inline mr-2 h-5 w-5" /> Description
                      </FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={4} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-4">
                <FormItem>
                  <FormLabel>
                    <Globe className="inline mr-2 h-5 w-5" /> Domain
                  </FormLabel>
                  <FormControl>
                    <Input
                      value={learningPath.domain?.name || "No domain assigned"}
                      disabled
                    />
                  </FormControl>
                </FormItem>
                <FormItem>
                  <FormLabel>
                    <Calendar className="inline mr-2 h-5 w-5" /> Created Date
                  </FormLabel>
                  <FormControl>
                    <Input
                      value={new Date(learningPath.createdAt).toLocaleDateString()}
                      disabled
                    />
                  </FormControl>
                </FormItem>
                <FormField
                  control={form.control}
                  name="isPublic"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormLabel>Public</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <Link href="/learning-path">
                <Button variant="outline" type="button" disabled={isSaving}>
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>

      <div className="flex justify-end">
        <AddPathCoursePopup
          pathId={pathIdNumber}
          learningPath={learningPath}
          onCourseAdded={fetchPathCourses}
        />
      </div>

      <PathCoursesTable
        pathId={pathIdNumber}
        initialCourses={pathCourses}
        isLoading={loadingCourses}
        onUpdateCourses={fetchPathCourses}
      />
    </div>
  );
}