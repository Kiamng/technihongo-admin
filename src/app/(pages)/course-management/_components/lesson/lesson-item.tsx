import { useState } from "react";
import { ChevronDown, ChevronRight, SquarePen, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LessonResource } from "@/types/lesson-resource";
import LessonPopupForm from "../lesson/create-lesson-pop-up";
import { Skeleton } from "@/components/ui/skeleton";
import LessonResourceItem from "./lesson-resource-list";

interface LessonItemProps {
    lesson: {
        lessonId: number;
        lessonOrder: number;
        title: string;
    };
    lessonResources: Record<number, LessonResource[]>;
    expandedLessonId: number | null;
    isLoadingLR: boolean;
    toggleLessonResource: (lessonId: number) => void;
    fetchLessons: () => Promise<void>;
    isDefaultStudyPlan: boolean;
}

const LessonItem = ({
    lesson,
    lessonResources,
    expandedLessonId,
    isLoadingLR,
    toggleLessonResource,
    fetchLessons,
    isDefaultStudyPlan
}: LessonItemProps) => {
    const [editLesson, setEditLesson] = useState<{ lessonId: number; title: string } | null>(null);
    const [isCreateResourceOpen, setIsCreateResourceOpen] = useState<boolean>(false);
    return (
        <div className="lesson bg-white rounded-2xl space-y-4 px-5 py-4">
            <div className="w-full flex flex-row justify-between items-center">
                <div className="space-x-5 text-base font-bold">
                    <span>{lesson.lessonOrder}.</span>
                    <span>{lesson.title}</span>
                </div>
                <div className="flex flex-row space-x-4">
                    {/* Nút Edit */}
                    <Dialog open={editLesson?.lessonId === lesson.lessonId} onOpenChange={(isOpen) => {
                        if (!isOpen) setEditLesson(null);
                    }}>
                        <DialogTrigger
                            className="flex items-center gap-2 py-2 px-2 bg-primary rounded-lg hover:bg-primary/90 text-white"
                            onClick={() => setEditLesson({ lessonId: lesson.lessonId, title: lesson.title })}
                        >
                            <SquarePen size={18} />
                        </DialogTrigger>
                        <DialogContent width='400px'>
                            <LessonPopupForm
                                initialData={lesson.title}
                                setIsDialogOpen={() => setEditLesson(null)}
                                fetchLessons={fetchLessons}
                                studyPlanId={null}
                                lessonId={lesson.lessonId}
                            />
                        </DialogContent>
                    </Dialog>

                    {/* Nút Delete */}
                    <Button size={"icon"} variant={"destructive"}>
                        <Trash2 />
                    </Button>

                    {/* Toggle lesson resource */}
                    <Button
                        size={"icon"}
                        variant={"ghost"}
                        onClick={() => toggleLessonResource(lesson.lessonId)}
                    >
                        {expandedLessonId === lesson.lessonId ? <ChevronDown /> : <ChevronRight />}
                    </Button>
                </div>
            </div>

            {/* Hiển thị danh sách resource nếu lesson được mở */}
            {expandedLessonId === lesson.lessonId && (
                <div className="flex flex-col space-y-4">
                    <Separator />
                    {isLoadingLR ? (
                        <Skeleton className="w-full h-[100px]" />
                    ) : (
                        <>
                            {lessonResources[lesson.lessonId]?.length ? (
                                lessonResources[lesson.lessonId].map((resource) => (
                                    <LessonResourceItem key={resource.lessonResourceId} lessonResource={resource} />
                                ))
                            ) : (
                                <p className="text-gray-500">No resources found</p>
                            )}
                        </>
                    )}
                    <Separator />
                    {isDefaultStudyPlan
                        ? <Button className="mx-auto">Create new lesson resource</Button>
                        : <Button className="mx-auto">Add existing lesson resource</Button>
                    }
                </div>
            )}
        </div>
    )
}

export default LessonItem
