import { deleteLessonResourceById, updateLessonResourceActiveStatus } from "@/app/api/lesson-resource/lesson-resource.api";
import { Button } from "@/components/ui/button";
import { LessonResource } from "@/types/lesson-resource";
import { Youtube, BookOpenCheck, Copy, SquarePen, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogFooter,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useParams } from "next/navigation";

interface LessonResourceListProps {
    lessonResource: LessonResource;
    studyPlanId: number;
    updateLessonResources: (lessonId: number, resourceId: number) => void
    lessonId: number
    token: string
    isActive: boolean
}

// Mapping giữa type và thuộc tính tương ứng
const resourceTypeConfig = {
    LearningResource: {
        color: "#FD5673", icon: Youtube,
        getTitle: (res: LessonResource) => res.learningResource?.title,
        editLink: (res: LessonResource, studyPlanId: number) => `${studyPlanId}/edit-lesson-resource/learning-resource/${res.learningResource?.resourceId}`
    },
    Quiz: {
        color: "#FFB600", icon: BookOpenCheck,
        getTitle: (res: LessonResource) => res.quiz?.title,
        editLink: (res: LessonResource, studyPlanId: number) => `${studyPlanId}/edit-lesson-resource/quiz/${res.quiz?.quizId}`
    },

    FlashcardSet: {
        color: "#3AC6C6", icon: Copy,
        getTitle: (res: LessonResource) => res.systemFlashCardSet?.title,
        editLink: (res: LessonResource, studyPlanId: number) => `${studyPlanId}/edit-lesson-resource/flashcard-set/${res.systemFlashCardSet?.systemSetId}`
    }
};

const LessonResourceItem = ({ lessonResource, studyPlanId, updateLessonResources, lessonId, token, isActive }: LessonResourceListProps) => {
    const resource = resourceTypeConfig[lessonResource.type];
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const { defaultStudyPlanId } = useParams();

    if (!resource) {
        console.error(`Unsupported lesson resource type: ${lessonResource.type}`);
        return null;
    }

    const { color, icon: Icon, getTitle, editLink } = resource;
    const title = getTitle(lessonResource) || "Untitled";

    const handleDeleteClick = () => {
        if (lessonResource.active && Number(defaultStudyPlanId) === studyPlanId) {
            toast.error("You cannot delete an active lesson resource.");
        } else {
            setConfirmOpen(true);
        }
    };
    const handleDelete = async () => {
        if (lessonResource.lessonResourceId) {
            startTransition(async () => {
                try {
                    if (Number(defaultStudyPlanId) !== studyPlanId && lessonResource.active) {
                        await updateLessonResourceActiveStatus(lessonResource.lessonResourceId, false, token)
                    }
                    const response = await deleteLessonResourceById(lessonResource.lessonResourceId, token);
                    if (response && response.success) {
                        toast.success("Xóa tài nguyên thành công!");
                        updateLessonResources(lessonId, lessonResource.lessonResourceId);
                    } else {
                        toast.error("Xóa tài nguyên thất bại!");
                    }
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } catch (error: any) {
                    toast.error(error.response.data.message);
                    console.error("Failed to delete lesson resource", error);
                } finally {
                    setConfirmOpen(false);
                }
            });
        }
    };

    const cancelDelete = () => {
        setConfirmOpen(false); // Close the confirmation dialog without deleting
    };

    // const handleUpdateStatus = async (status: string) => {
    //     startTransition(async () => {
    //         try {
    //             const response = await updateLessonResourceStatus(lessonResource.lessonResourceId, status === 'true');
    //             if (response && response.success) {
    //                 toast.success("Lesson resource status updated successfully!");
    //                 updateLessonResources(lessonId, lessonResource.lessonResourceId);
    //             } else {
    //                 toast.error("Failed to update lesson resource active status!");
    //             }
    //         } catch (error) {
    //             toast.error("An error occurred while updating the lesson resource active status.");
    //             console.error("Failed to update lesson resource active status!", error);
    //         }
    //     });
    // }

    return (
        <>
            <div className="p-3 flex justify-between items-center hover:bg-slate-50 rounded-2xl">
                <div className="flex items-center space-x-3 text-base">
                    <span>{lessonResource.typeOrder}</span>
                    <div className="p-[6px] rounded-full" style={{ backgroundColor: `${color}1A`, color }}>
                        <Icon size={20} />
                    </div>
                    <span>{title}</span>
                    <div className={`bg-opacity-10 px-3 py-[6px] text-base rounded-lg ${lessonResource.active ? "bg-[#56D071] text-[#56D071]" : "bg-[#FD5673] text-[#FD5673]"}`}>
                        {lessonResource.active ? "Đang hoạt động" : "Không hoạt động"}
                    </div>
                    {/* <div>
                        <Select
                            disabled={isPending}
                            value={lessonResource?.active.toString()}
                            onValueChange={(value) => handleUpdateStatus(value)}>
                            <SelectTrigger
                                className={lessonResource?.active
                                    ? "bg-[#56D071] text-[#56D071] bg-opacity-10"
                                    : "bg-[#FD5673] text-[#FD5673] bg-opacity-10"}>
                                <SelectValue
                                    placeholder="Public" />
                            </SelectTrigger>
                            <SelectContent >
                                <SelectItem className="bg-[#56D071] text-[#56D071] bg-opacity-10" value="true">Đang hoạt động</SelectItem>
                                <SelectItem className="bg-[#FD5673] text-[#FD5673] bg-opacity-10" value="false">Không hoạt động</SelectItem>
                            </SelectContent>
                        </Select>
                    </div> */}
                </div>
                <div className="flex space-x-2">
                    <Link href={editLink(lessonResource, studyPlanId)}>
                        <Button size="icon" variant="ghost"><SquarePen /></Button>
                    </Link >
                    {!isActive &&
                        <Button onClick={handleDeleteClick} size="icon" variant="ghost"><Trash2 /></Button>
                    }
                </div >
            </div>

            {/* Confirmation dialog */}
            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Bạn đã chắc chắn chưa?</AlertDialogTitle>
                        <p>Hành động này sẽ không thể hoàn tác và tài nguyên này sẽ bị xóa vĩnh viễn</p>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={cancelDelete}>Hủy</AlertDialogCancel>
                        <Button variant={"destructive"} onClick={handleDelete} disabled={isPending}>
                            {isPending ? "Đang xóa..." : "Xóa"}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default LessonResourceItem;
