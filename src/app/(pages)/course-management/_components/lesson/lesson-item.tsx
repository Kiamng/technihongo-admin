import { Dispatch, SetStateAction, useState, useTransition } from "react";
import { ChevronDown, ChevronRight, LoaderCircle, Plus, SquarePen, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LessonResource } from "@/types/lesson-resource";
import LessonPopupForm from "../lesson/create-lesson-pop-up";
import { Skeleton } from "@/components/ui/skeleton";
import LessonResourceItem from "./lesson-resource-list";
import CreateLessonResourcePopup from "../lesson-resource/create-lesson-resource-popup";
import { Lesson } from "@/types/lesson";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { updateLessonResourceOrder } from "@/app/api/lesson-resource/lesson-resource.api";
import { toast } from "sonner";
import AddExistingLessonResourcePopup from "../lesson-resource/add-existing-lesson-resource-popup";
import DeleteLessonAlert from "./delete-alert";
import { deleteLesson } from "@/app/api/lesson/lesson.api";

interface LessonItemProps {
    lesson: Lesson;
    lessonResources: Record<number, LessonResource[]>;
    expandedLessonId: number | null;
    isLoadingLR: boolean;
    toggleLessonResource: (lessonId: number) => void;
    fetchLessons: () => Promise<void>;
    isDefaultStudyPlan: boolean;
    token: string;
    updateLessonResources: (lessonId: number, resourceId: number) => void;
    setLessonResources: Dispatch<SetStateAction<Record<number, LessonResource[]>>>;
    studyPlanId: number
    defaultStudyPlanId: number
    isActive: boolean
}

const LessonItem = ({
    lesson,
    lessonResources,
    expandedLessonId,
    isLoadingLR,
    toggleLessonResource,
    fetchLessons,
    isDefaultStudyPlan,
    token,
    updateLessonResources,
    setLessonResources,
    studyPlanId,
    defaultStudyPlanId,
    isActive
}: LessonItemProps) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedDeleteLessonId, setSelectedDeleteLessonId] = useState<number | null>(null);
    const [selectedLesson, setSelectedLesson] = useState<{ lessonId: number; title: string } | null>(null);
    const [openCreateResourceForm, setOpenCreateResourceForm] = useState(false);
    const [openAddResourceForm, setOpenAddResourceForm] = useState(false);
    const [isOrderUpdated, setIsOrderUpdated] = useState(false);
    const [isUpdatingOrder, startTransition] = useTransition();
    const handleUpdateOrder = async (lessonId: number, newOrder: number[]) => {
        startTransition(async () => {
            try {
                const response = await updateLessonResourceOrder(lessonId, newOrder, token);
                if (response.success === true) {
                    toast.success("Cập nhật thứ tự thành công");
                    setIsOrderUpdated(false);
                }
            } catch (error) {
                console.error("Failed to update new order", error);
                toast.error("Cập nhật thứ tự thất bại");
            }
        })
    };

    const handleDragEnd = (result: DropResult, lessonId: number) => {
        const { destination, source } = result;

        if (!destination || destination.index === source.index) {
            return;
        }

        const newResources = Array.from(lessonResources[lessonId]);
        const [removed] = newResources.splice(source.index, 1);
        newResources.splice(destination.index, 0, removed);

        setLessonResources(prevState => ({
            ...prevState,
            [lessonId]: newResources,
        }));

        setIsOrderUpdated(true);
    };

    const handleDeleteLesson = async (lessonId: number) => {
        try {
            setIsDeleting(true);
            await deleteLesson(token, lessonId);
            toast.success("Xóa bài học thành công!");
            setSelectedDeleteLessonId(null);
            fetchLessons();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast.error(error.response.data.message);
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <div className="lesson bg-white rounded-2xl space-y-4 px-5 py-4">
            <div className="w-full flex flex-row justify-between items-center">
                <div className="space-x-5 text-base font-bold">
                    <span>{lesson.lessonOrder}.</span>
                    <span>{lesson.title}</span>
                </div>
                <div className="flex flex-row space-x-4">
                    {/* Nút Edit */}
                    {!isActive &&
                        <>
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
                                        studyPlanId={studyPlanId}
                                        lessonId={lesson.lessonId}
                                        initialOrder={lesson.lessonOrder}
                                        token={token}
                                    />
                                </DialogContent>
                            </Dialog>

                            <Button
                                size={"icon"}
                                variant={"ghost"}
                                onClick={() => setSelectedDeleteLessonId(lesson.lessonId)}
                            >
                                <Trash />
                            </Button>
                        </>}
                    {<DeleteLessonAlert
                        disable={isDeleting}
                        onOpen={selectedDeleteLessonId === lesson.lessonId}
                        onClose={() => setSelectedDeleteLessonId(null)}
                        lessonId={lesson.lessonId}
                        onConfirmDelete={handleDeleteLesson}
                    />}

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
                    {lessonResources[lesson.lessonId]?.length > 0 && isOrderUpdated && (
                        <div className="w-full flex justify-end">
                            <Button
                                disabled={isUpdatingOrder}
                                variant={"outline"}
                                onClick={() => handleUpdateOrder(lesson.lessonId, lessonResources[lesson.lessonId].map(resource => resource.typeOrder))}
                            >
                                {isUpdatingOrder ? <LoaderCircle className="animate-spin" /> : "Update new order"}
                            </Button>
                        </div>
                    )}
                    {isLoadingLR ? (
                        <Skeleton className="w-full h-[100px]" />
                    ) : (
                        <>
                            {lessonResources[lesson.lessonId]?.length ? (
                                <DragDropContext onDragEnd={(result) => handleDragEnd(result, lesson.lessonId)}>
                                    <Droppable droppableId={`lesson-${lesson.lessonId}`} type="lessonResource">
                                        {(provided) => (
                                            <div
                                                className="w-full"
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                            >
                                                {lessonResources[lesson.lessonId].map((resource, index) => (
                                                    <Draggable
                                                        key={resource.lessonResourceId}
                                                        draggableId={`${resource.lessonResourceId}`}
                                                        index={index}
                                                        isDragDisabled={isUpdatingOrder}>
                                                        {(provided) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                            >
                                                                <LessonResourceItem
                                                                    lessonId={lesson.lessonId}
                                                                    updateLessonResources={updateLessonResources}
                                                                    studyPlanId={lesson.studyPlan.studyPlanId}
                                                                    key={resource.lessonResourceId}
                                                                    lessonResource={resource}
                                                                    token={token}
                                                                    isActive={isActive}
                                                                />
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                            ) : (
                                <p className="text-gray-500">Không tìm thấy tài nguyên</p>
                            )}
                        </>
                    )}
                    <Separator />
                    {isDefaultStudyPlan
                        ? (!isActive &&
                            <Dialog open={openCreateResourceForm} onOpenChange={setOpenCreateResourceForm}>
                                <DialogTrigger className="mx-auto flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90">
                                    <Plus size={18} />
                                    Tạo mới một tài nguyên
                                </DialogTrigger>
                                <DialogContent width='500px'>
                                    <CreateLessonResourcePopup
                                        defaultStudyPlanId={defaultStudyPlanId}
                                        lesson={lesson}
                                        closeForm={setOpenCreateResourceForm}
                                        token={token}
                                    />
                                </DialogContent>
                            </Dialog>
                        )
                        : (!isActive && <Dialog open={openAddResourceForm} onOpenChange={setOpenAddResourceForm}>
                            <DialogTrigger className="mx-auto flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90">
                                <Plus size={18} />
                                Thêm tài nguyên có sẵn
                            </DialogTrigger>
                            <DialogContent width='500px'>
                                <AddExistingLessonResourcePopup
                                    defaultStudyPlanId={defaultStudyPlanId}
                                    lessonId={lesson.lessonId}
                                    closeForm={setOpenAddResourceForm}
                                    setLessonResources={setLessonResources}
                                    token={token}
                                />
                            </DialogContent>
                        </Dialog>
                        )
                    }
                </div>
            )}
        </div>
    );
}

export default LessonItem;
