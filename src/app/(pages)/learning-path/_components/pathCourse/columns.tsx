/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { updatePathCourseOrder, getPathCourseListByLearningPathId, deletePathCourse } from "@/app/api/path-course/path-course.api";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { GripVertical, ArrowDownUp, LoaderCircle, RefreshCw } from "lucide-react";
import { useSession } from "next-auth/react";

interface PathCoursesTableProps {
  pathId: number;
  initialCourses?: any[];
  isLoading?: boolean;
  onUpdateCourses: () => Promise<void> | void;
}

export function PathCoursesTable({
  pathId,
  initialCourses = [],
  isLoading: externalIsLoading = false,
  onUpdateCourses,
}: PathCoursesTableProps) {
  const [pathCourses, setPathCourses] = useState<any[]>(initialCourses);
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [internalIsLoading, setInternalIsLoading] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [courseToRemove, setCourseToRemove] = useState<number | null>(null);
  const { data: session } = useSession();

  const isLoading = externalIsLoading || internalIsLoading;

  const fetchPathCourses = async () => {
    if (!session?.user?.token) return;

    try {
      setInternalIsLoading(true);
      const response = await getPathCourseListByLearningPathId({
        pathId,
        token: session.user.token,
        pageNo: 0,
        pageSize: 100,
        sortBy: "courseOrder",
        sortDir: "asc",
      });

      if (Array.isArray(response)) {
        setPathCourses(response);
      } else {
        console.error("Unexpected API response format:", response);
        toast.error("Failed to load courses. Unexpected data format.");
        setPathCourses([]);
      }
    } catch (error) {
      console.error("Error fetching path courses:", error);
      toast.error("Không tìm thấy khóa học nào");
      setPathCourses([]);
    } finally {
      setInternalIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialCourses.length > 0) {
      setPathCourses(initialCourses);
      setInternalIsLoading(false);
    } else {
      fetchPathCourses();
    }
  }, [initialCourses]);

  useEffect(() => {
    if (!initialCourses.length) {
      fetchPathCourses();
    }
  }, [pathId, session?.user.token]);

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination || source.index === destination.index) return;

    const newCourses = Array.from(pathCourses);
    const [reorderedItem] = newCourses.splice(source.index, 1);
    newCourses.splice(destination.index, 0, reorderedItem);

    const updatedCourses = newCourses.map((course, index) => ({
      ...course,
      courseOrder: index + 1,
    }));

    setPathCourses(updatedCourses);
    setHasUnsavedChanges(true);
  };

  const saveOrder = async () => {
    if (!hasUnsavedChanges || !session?.user?.token) return;

    try {
      setIsUpdating(true);
      const newPathCourseOrders = pathCourses.map((course, index) => ({
        pathCourseId: course.pathCourseId,
        courseOrder: index + 1,
      }));

      await updatePathCourseOrder(pathId, { newPathCourseOrders }, session.user.token);
      toast.success("Course order updated successfully!");
      setHasUnsavedChanges(false);
      await fetchPathCourses(); // Tự động cập nhật danh sách
      onUpdateCourses();
    } catch (error) {
      console.error("Error updating course order:", error);
      toast.error("Failed to update course order");
      await fetchPathCourses(); // Đồng bộ lại nếu lỗi
    } finally {
      setIsUpdating(false);
    }
  };

  const cancelReorderMode = () => {
    if (hasUnsavedChanges && !window.confirm("You have unsaved changes. Are you sure you want to cancel?")) {
      return;
    }
    fetchPathCourses(); // Đồng bộ lại với server
    setIsReorderMode(false);
    setHasUnsavedChanges(false);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchPathCourses();
    onUpdateCourses();
    setIsRefreshing(false);
  };

  const handleRemoveCourse = async (pathCourseId: number) => {
    if (!session?.user?.token) {
      toast.error("Authentication token is missing");
      return;
    }

    setCourseToRemove(pathCourseId);
    setShowConfirmModal(true);
  };

  const confirmRemoveCourse = async () => {
    if (!courseToRemove || !session?.user?.token) return;

    try {
      setIsUpdating(true);
      await deletePathCourse(courseToRemove, session.user.token);
      toast.success("Course removed successfully!");
      await fetchPathCourses(); // Tự động cập nhật danh sách
      onUpdateCourses();
    } catch (error) {
      toast.error("Failed to remove course");
      console.error("Error removing course:", error);
      await fetchPathCourses(); // Đồng bộ lại nếu lỗi
    } finally {
      setIsUpdating(false);
      setShowConfirmModal(false);
      setCourseToRemove(null);
    }
  };

  const pathCourseColumns: ColumnDef<any>[] = [
    {
      accessorKey: "courseOrder",
      header: "Thứ tự",
      cell: ({ row }) => row.original.courseOrder,
    },
    {
      accessorFn: (row) => row.course?.title,
      id: "courseTitle",
      header: "Tên khóa học",
      cell: ({ row }) => row.original.course?.title || "Trống",
    },
    {
      accessorFn: (row) => row.course?.description,
      id: "courseDescription",
      header: "Mô tả",
      cell: ({ row }) => row.original.course?.description || "Trống",
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleRemoveCourse(row.original.pathCourseId)}
            disabled={isUpdating}
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  const renderRegularTable = () => (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Các khóa học trong lộ trình học tập ({pathCourses.length})</h3>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleRefresh}
            variant="outline"
            className="flex items-center gap-2"
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Tải lại
          </Button>
          <Button
            onClick={() => setIsReorderMode(true)}
            variant="outline"
            className="flex items-center gap-2"
            disabled={pathCourses.length < 2}
          >
            <ArrowDownUp className="h-4 w-4" />
            Sắp xếp thứ tự
          </Button>
        </div>
      </div>
      <DataTable
        columns={pathCourseColumns}
        data={pathCourses}
        isLoading={isLoading}
        searchKey="courseTitle"
      />
    </>
  );

  const renderDraggableTable = () => (
    <div className="relative">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Sắp xếp thứ tự</h3>
        <div className="flex gap-2">
          <Button
            onClick={handleRefresh}
            variant="outline"
            className="flex items-center gap-2"
            disabled={isRefreshing || isUpdating}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button onClick={cancelReorderMode} variant="outline" disabled={isUpdating}>
            Cancel
          </Button>
          <Button
            onClick={saveOrder}
            disabled={!hasUnsavedChanges || isUpdating}
            className={`${isUpdating ? "opacity-70" : ""}`}
          >
            {isUpdating ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Đang lưu...
              </>
            ) : (
              "Lưu thứ tự"
            )}
          </Button>
        </div>
      </div>

      {isUpdating && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-md">
          <div className="text-center">
            <LoaderCircle className="animate-spin h-8 w-8 mx-auto mb-2" />
            <p>Đang cập nhật thứ tự...</p>
          </div>
        </div>
      )}

      <p className="text-sm text-muted-foreground mb-4">
        Kéo thả để thay đổi thứ tự. Bấm lưu để lưu thay đổi
      </p>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="courses">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="border rounded-md overflow-hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="w-10 p-3 text-left"></th>
                    <th className="w-24 p-3 text-left font-medium">Thứ tự</th>
                    {/* <th className="w-24 p-3 text-left font-medium">Course ID</th> */}
                    <th className="p-3 text-left font-medium">Tên khóa học</th>
                    <th className="p-3 text-left font-medium">Mô tả</th>
                    <th className="w-32 p-3 text-left font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {pathCourses.map((course, index) => (
                    <Draggable
                      key={`path-course-${course.pathCourseId}`}
                      draggableId={`path-course-${course.pathCourseId}`}
                      index={index}
                    >
                      {(provided) => (
                        <tr
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="border-t hover:bg-muted/20 transition-colors"
                        >
                          <td className="p-3">
                            <div
                              {...provided.dragHandleProps}
                              className="cursor-grab active:cursor-grabbing flex justify-center"
                            >
                              <GripVertical className="h-5 w-5 text-gray-400" />
                            </div>
                          </td>
                          <td className="p-3">{course.courseOrder}</td>
                          {/* <td className="p-3">{course.course?.courseId}</td> */}
                          <td className="p-3">{course.course?.title || "Trống"}</td>
                          <td className="p-3">{course.course?.description || "Trống"}</td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <Link href={`/courses/${course.course?.courseId}`}>
                                <Button variant="outline" size="sm">View</Button>
                              </Link>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRemoveCourse(course.pathCourseId)}
                                disabled={isUpdating}
                              >
                                Xóa
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  {pathCourses.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-6 text-muted-foreground">
                        Không tìm thấy khóa học nào trong lộ trình học tập này
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );

  return (
    <div className="mt-6">
      {isReorderMode ? renderDraggableTable() : renderRegularTable()}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Removal</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to remove this course from the path?
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowConfirmModal(false)}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmRemoveCourse}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    Removing...
                  </>
                ) : (
                  "Remove"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}