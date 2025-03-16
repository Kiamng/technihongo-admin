import { useState } from "react";
import { ChevronDown, ChevronRight, Plus, SquarePen, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LessonResource } from "@/types/lesson-resource";
import LessonPopupForm from "../lesson/create-lesson-pop-up";
import { Skeleton } from "@/components/ui/skeleton";
import LessonResourceItem from "./lesson-resource-list";
import CreateLessonResourcePopup from "../lesson-resource/create-lesson-resource-popup";
import { Lesson } from "@/types/lesson";

interface LessonItemProps {
    lesson: Lesson
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
    const [selectedLesson, setSelectedLesson] = useState<{ lessonId: number; title: string } | null>(null);

    const [openCreateResourceForm, setOpenCreateResourceForm] = useState(false);
    const [openAddResourceForm, setOpenAddResourceForm] = useState(false);

    return (
        <div className="lesson bg-white rounded-2xl space-y-4 px-5 py-4">
            <div className="w-full flex flex-row justify-between items-center">
                <div className="space-x-5 text-base font-bold">
                    <span>{lesson.lessonOrder}.</span>
                    <span>{lesson.title}</span>
                </div>
                <div className="flex flex-row space-x-4">
                    {/* Nút Edit */}
                    <Dialog open={selectedLesson?.lessonId === lesson.lessonId} onOpenChange={(isOpen) => {
                        if (!isOpen) setSelectedLesson(null);
                    }}>
                        <DialogTrigger
                            className="flex items-center gap-2 py-2 px-2 bg-primary rounded-lg hover:bg-primary/90 text-white"
                            onClick={() => setSelectedLesson({ lessonId: lesson.lessonId, title: lesson.title })}
                        >
                            <SquarePen size={18} />
                        </DialogTrigger>
                        <DialogContent width='400px'>
                            <LessonPopupForm
                                initialData={lesson.title}
                                setIsDialogOpen={() => setSelectedLesson(null)}
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
                        ? <Dialog open={openCreateResourceForm} onOpenChange={setOpenCreateResourceForm}>
                            <DialogTrigger className="mx-auto flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90">
                                <Plus size={18} />
                                Create new lesson resource
                            </DialogTrigger>
                            <DialogContent width='500px'>
                                <CreateLessonResourcePopup
                                    lesson={lesson}
                                    closeForm={setOpenCreateResourceForm}
                                    fetchLessons={fetchLessons}
                                />
                            </DialogContent>
                        </Dialog>
                        : <Dialog open={openAddResourceForm} onOpenChange={setOpenAddResourceForm}>
                            <DialogTrigger className="mx-auto flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90">
                                <Plus size={18} />
                                Add existing lesson resource
                            </DialogTrigger>
                            <DialogContent width='500px'>
                                {/* <AddExistingLessonResourcePopup
                                    lessonId={lesson.lessonId}
                                    closeForm={() => setOpenAddResourceForm(false)}
                                    fetchLessons={fetchLessons}
                                /> */}
                            </DialogContent>
                        </Dialog>
                    }
                </div>
            )}
        </div>
    )
}

export default LessonItem
