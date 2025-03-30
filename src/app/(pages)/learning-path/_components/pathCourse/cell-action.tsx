/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import { Pencil, Save, X, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  DragDropContext, 
  Droppable, 
  Draggable, 
  DropResult
} from "@hello-pangea/dnd";
import { updatePathCourseOrder, getPathCourseListByLearningPathId } from "@/app/api/path-course/path-course.api";
import { useSession } from 'next-auth/react';

interface Course {
  pathCourseId: number;
  courseId: number;
  title: string;
  order: number;
}

interface CellActionProps {
  data: {
    courseId: number;
    title: string;
    pathId: number;
    courses: Course[];
  };
  onUpdate: () => void;
}

export const CellAction: React.FC<CellActionProps> = ({ data, onUpdate }) => {
  const { data: session } = useSession();
  const [isReorderOpen, setIsReorderOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const fetchPathCourses = async () => {
      if (isReorderOpen && session?.user?.token && data.pathId) {
        try {
          const pathCourses = await getPathCourseListByLearningPathId({
            pathId: data.pathId,
            token: session.user.token,
            pageNo: 0,
            pageSize: 100,
            sortBy: "courseOrder",
            sortDir: "asc"
          });

          const mappedCourses = pathCourses.map((pc: any) => ({
            pathCourseId: pc.pathCourseId,
            courseId: pc.course.courseId,
            title: pc.course.title,
            order: pc.courseOrder
          }));

          setCourses(mappedCourses);
          setHasChanges(false);
        } catch (error) {
          console.error("Error fetching path courses:", error);
          toast.error("Failed to load courses for reordering");
          setCourses([]);
        }
      }
    };

    fetchPathCourses();
  }, [isReorderOpen, data.pathId, session]);

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination || source.index === destination.index) return;

    const newCourses = Array.from(courses);
    const [reorderedItem] = newCourses.splice(source.index, 1);
    newCourses.splice(destination.index, 0, reorderedItem);

    const updatedCourses = newCourses.map((course, index) => ({
      ...course,
      order: index + 1
    }));

    setCourses(updatedCourses);
    setHasChanges(true);
  };

  const handleReorderCourses = async () => {
    if (!hasChanges) {
      setIsReorderOpen(false);
      return;
    }

    if (!session?.user?.token) {
      toast.error("Authentication token is missing");
      return;
    }

    try {
      setIsUpdating(true);

      const newPathCourseOrders = courses.map(course => ({
        pathCourseId: course.pathCourseId,
        courseOrder: course.order
      }));

      await updatePathCourseOrder(data.pathId, { newPathCourseOrders }, session.user.token);

      toast.success("Course order updated successfully!");
      onUpdate(); // Gọi callback để parent component cập nhật
      setIsReorderOpen(false);
      setHasChanges(false);
    } catch (error) {
      console.error("Error updating course order:", error);
      toast.error("Failed to update course order");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      window.location.reload(); // Có thể thay bằng fetch lại dữ liệu nếu cần
    }, 300);
  };

  return (
    <>
      <div className="flex gap-2">
        <Button 
          onClick={() => setIsReorderOpen(true)} 
          className="bg-gray-900 text-white hover:bg-gray-700"
          title="Reorder courses"
        >
          <Pencil className="w-4 h-4" />
        </Button>
        
        <Button 
          onClick={handleRefresh}
          className="bg-blue-600 hover:bg-blue-700 text-white"
          title="Refresh page"
          disabled={isRefreshing}
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <Dialog open={isReorderOpen} onOpenChange={(open) => {
        if (!isUpdating) setIsReorderOpen(open);
      }}>
        <DialogContent className="max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Reorder Courses</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground mb-4">
            Drag and drop courses to change their order. Changes will be saved when you click Save Order.
          </p>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="courses">
              {(provided) => (
                <div 
                  {...provided.droppableProps} 
                  ref={provided.innerRef}
                  className="space-y-2 max-h-[60vh] overflow-y-auto p-1"
                >
                  {courses.map((course, index) => (
                    <Draggable 
                      key={`cell-course-${course.courseId}`} 
                      draggableId={`cell-course-${course.courseId}`} 
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="p-4 bg-white border rounded-lg flex items-center justify-between cursor-grab active:cursor-grabbing hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500 font-medium">{course.order}.</span>
                            <span>{course.title || "Unnamed Course"}</span>
                          </div>
                          <span className="text-muted-foreground text-sm">
                            ID: {course.courseId}
                          </span>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  {courses.length === 0 && (
                    <div className="text-center py-6 text-muted-foreground">
                      No courses found in this learning path
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <div className="flex justify-between gap-2 mt-4">
            <Button
              variant="outline"
              onClick={handleRefresh}
              className="text-blue-600"
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => setIsReorderOpen(false)}
                disabled={isUpdating}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button 
                onClick={handleReorderCourses}
                disabled={isUpdating || !hasChanges}
                className="bg-green-600 hover:bg-green-700"
              >
                {isUpdating ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Order
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};