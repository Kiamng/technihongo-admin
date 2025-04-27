/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  LoaderCircle,
  BookPlus,
  Search,
  Globe,
  Clock,
  Calendar,
  BookOpen,
  Award,
  User,
  Info,
  Check,
  X,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import {
  addPathCourse,
  getCoursesByParentDomainId,
  getPathCourseListByLearningPathId,
} from "@/app/api/path-course/path-course.api";
import { Course } from "@/types/path-course";
import { LearningPath } from "@/types/learningPath";

interface AddPathCoursePopupProps {
  pathId: number;
  learningPath: LearningPath;
  onCourseAdded: () => void;
}

const AddPathCoursePopup = ({
  pathId,
  learningPath,
  onCourseAdded,
}: AddPathCoursePopupProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [existingCourseIds, setExistingCourseIds] = useState<number[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isInitialLoadDone, setIsInitialLoadDone] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { data: session } = useSession();

  useEffect(() => {
    if (!isDialogOpen) {
      setSearchTerm("");
      setSelectedCourseId(null);
      setError(null);
    }
  }, [isDialogOpen]);

  const fetchExistingCourses = useCallback(async () => {
    if (!session?.user?.token) return [];

    try {
      const existingCourses = await getPathCourseListByLearningPathId({
        pathId,
        token: session.user.token,
      });

      if (!existingCourses || !Array.isArray(existingCourses)) {
        console.warn("Existing courses response is not an array:", existingCourses);
        return [];
      }

      const existingIds = existingCourses.map((pc: any) => {
        if (pc && pc.course && pc.course.courseId) {
          return pc.course.courseId;
        }
        return null;
      }).filter(id => id !== null) as number[];

      setExistingCourseIds(existingIds);
      return existingIds;
    } catch (error) {
      console.error("Error fetching existing courses:", error);
      toast.error("Failed to load existing courses");
      return [];
    }
  }, [pathId, session]);

  const fetchCoursesByParentDomain = useCallback(async (existingIds: number[] = []) => {
    if (!session?.user?.token) {
      setError("Authentication token is missing");
      return;
    }

    if (!learningPath.domain?.domainId) {
      setError("Learning path does not have a domain ID");
      return;
    }

    try {
      setError(null);
      const parentDomainId = learningPath.domain.domainId;
      const availableCourses = await getCoursesByParentDomainId({
        parentDomainId,
        token: session.user.token,
      });

      if (!availableCourses || !Array.isArray(availableCourses)) {
        console.warn("Available courses response is not an array:", availableCourses);
        setCourses([]);
        return;
      }

      const filteredCourses = availableCourses.filter(
        (course) => !existingIds.includes(course.courseId)
      );

      setCourses(filteredCourses);
    } catch (error) {
      console.error("Error fetching courses by parent domain:", error);
      setError("Failed to load courses. Please try again.");
      toast.error("Failed to load courses");
      setCourses([]);
    }
  }, [session, learningPath.domain]);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (!isDialogOpen || !session?.user?.token || isInitialLoadDone) return;

      setIsLoading(true);
      try {
        const existingIds = await fetchExistingCourses();
        if (isMounted) {
          await fetchCoursesByParentDomain(existingIds);
          setIsInitialLoadDone(true);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error in initial data loading:", err);
          setError("Failed to load data. Please try again.");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadData();

    return () => { isMounted = false; };
  }, [isDialogOpen, session, fetchExistingCourses, fetchCoursesByParentDomain, isInitialLoadDone]);

  useEffect(() => {
    if (!isDialogOpen) {
      setIsInitialLoadDone(false);
    }
  }, [isDialogOpen]);

  const filteredCourses = useMemo(() =>
    courses.filter(
      (course) =>
        searchTerm === "" ||
        (course.title && course.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()))
    ),
    [courses, searchTerm]
  );

  const selectedCourse = useMemo(() => {
    if (!selectedCourseId) return null;
    return courses.find(course => course.courseId === selectedCourseId) || null;
  }, [selectedCourseId, courses]);

  const handleAddCourse = async () => {
    if (!selectedCourseId) {
      toast.error("Please select a course");
      return;
    }

    if (!session?.user?.token) {
      toast.error("Authentication token is missing");
      return;
    }

    setIsLoading(true);

    try {
      const response = await addPathCourse({
        pathId: Number(pathId),
        courseId: Number(selectedCourseId),
        token: session.user.token
      });

      if (response && response.success) {
        toast.success("Course successfully added to learning path");
        onCourseAdded(); // Gọi callback để cập nhật danh sách
        setIsDialogOpen(false);
      } else {
        const errorMessage = response?.message || "Unknown error occurred";
        toast.error(`Failed to add course: ${errorMessage}`);
      }
    } catch (error: any) {
      console.error("Error adding course:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Unknown error";
      toast.error(`Failed to add course: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90">
          <BookPlus className="w-5 h-5" />
          Thêm khóa học
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[800px] h-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-center">
            Thêm khóa học vào: {learningPath.title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex items-center justify-between space-x-2 mb-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm khóa học"
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 flex gap-4 overflow-hidden">
          <div className="w-[55%] overflow-hidden flex flex-col">
            <h3 className="text-lg font-semibold mb-2">
              Danh sách khóa học
              <span className="text-sm text-muted-foreground ml-2">
                ({filteredCourses.length}/{courses.length})
              </span>
            </h3>

            <div className="border rounded-md p-2 flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex justify-center items-center h-[200px]">
                  <LoaderCircle className="animate-spin w-8 h-8" />
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-destructive">
                  <p>{error}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => {
                      setIsInitialLoadDone(false);
                      setError(null);
                      fetchExistingCourses().then(existingIds =>
                        fetchCoursesByParentDomain(existingIds)
                      );
                    }}
                  >
                    Retry
                  </Button>
                </div>
              ) : filteredCourses.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Không tìm thấy khóa học phù hợp nào
                </p>
              ) : (
                <RadioGroup
                  value={selectedCourseId?.toString() || ""}
                  onValueChange={(value) => setSelectedCourseId(Number(value))}
                  className="space-y-2"
                >
                  {filteredCourses.map((course) => (
                    <div
                      key={course.courseId}
                      className={`p-3 border rounded-lg transition-colors ${selectedCourseId === course.courseId
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted/50"
                        }`}
                    >
                      <div className="flex items-start space-x-3">
                        <RadioGroupItem
                          id={`course-${course.courseId}`}
                          value={course.courseId.toString()}
                          className="mt-1"
                        />

                        <div className="flex-grow">
                          <div className="flex justify-between items-start flex-wrap">
                            <label
                              htmlFor={`course-${course.courseId}`}
                              className="font-medium cursor-pointer mr-2"
                            >
                              {course.title || "Untitled Course"}
                            </label>

                            <div className="flex items-center gap-1 flex-wrap mt-1">
                              <Badge variant="outline">{course.domain?.name || "No Domain"}</Badge>
                              <Badge variant="secondary">{course.difficultyLevel?.name || "No Level"}</Badge>
                            </div>
                          </div>

                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {course.description || "No description available"}
                          </p>

                          <div className="flex items-center text-xs text-muted-foreground mt-2">
                            <Clock className="w-3 h-3 mr-1" /> {course.estimatedDuration || "N/A"}
                            <span className="ml-3">ID: {course.courseId}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              )}
            </div>
          </div>

          <div className="w-[45%] overflow-hidden flex flex-col">
            <h3 className="text-lg font-semibold mb-2">Thông tin khóa học</h3>

            <div className="border rounded-md p-4 flex-1 overflow-y-auto bg-muted/10">
              {!selectedCourse ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                  <Info className="w-12 h-12 mb-2 opacity-30" />
                  <p>Chọn 1 khóa học để xem chi tiết</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedCourse.thumbnailUrl && selectedCourse.thumbnailUrl !== "https://" && (
                    <div className="rounded-md overflow-hidden border">
                      <img
                        src={selectedCourse.thumbnailUrl}
                        alt={selectedCourse.title || "Course thumbnail"}
                        className="w-full h-[120px] object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}

                  <div>
                    <h4 className="text-xl font-bold">{selectedCourse.title || "Untitled Course"}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedCourse.description || ""}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="border rounded-md p-2">
                      <div className="flex items-center text-sm font-medium mb-1">
                        <Globe className="w-4 h-4 mr-1" /> Lĩnh vực
                      </div>
                      <div className="text-sm">
                        <Badge variant="outline" className="mt-1">
                          {selectedCourse.domain?.name || ""}
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1">
                          Tag: {selectedCourse.domain?.tag || ""}
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-md p-2">
                      <div className="flex items-center text-sm font-medium mb-1">
                        <Award className="w-4 h-4 mr-1" /> Độ khó
                      </div>
                      <div className="text-sm">
                        <Badge variant="secondary" className="mt-1">
                          {selectedCourse.difficultyLevel?.name || "N/A"}
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1">
                          Tag: {selectedCourse.difficultyLevel?.tag || "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <User className="w-4 h-4 mr-2" />
                      <span className="font-medium">Người tạo:</span>
                      <span className="ml-2">{selectedCourse.creator?.userName || "N/A"}</span>
                    </div>

                    <div className="flex items-center text-sm">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="font-medium">Thời gian ước tính:</span>
                      <span className="ml-2">{selectedCourse.estimatedDuration || "N/A"}</span>
                    </div>

                    <div className="flex items-center text-sm">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="font-medium">Ngày tạo:</span>
                      <span className="ml-2">{formatDate(selectedCourse.createdAt)}</span>
                    </div>

                    <div className="flex items-center text-sm">
                      <BookOpen className="w-4 h-4 mr-2" />
                      <span className="font-medium">Cần gói:</span>
                      <span className="ml-2">{selectedCourse.premium ? <Check /> : <X />}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-3 pt-2 border-t">
          <div className="flex items-center justify-end">

            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setSelectedCourseId(null)} disabled={isLoading || !selectedCourseId}>
                Xóa lựa chọn
              </Button>
              <Button
                onClick={handleAddCourse}
                disabled={!selectedCourseId || isLoading}
                className="bg-primary hover:bg-primary/90"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" /> Đang thêm ...
                  </>
                ) : (
                  "Thêm khóa học"
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddPathCoursePopup;