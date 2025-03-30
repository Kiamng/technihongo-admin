import { deleteLessonResourceById } from "@/app/api/lesson-resource/lesson-resource.api";
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

interface LessonResourceListProps {
    lessonResource: LessonResource;
    studyPlanId: number;
    updateLessonResources: (lessonId: number, resourceId: number) => void
    lessonId: number
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

const LessonResourceItem = ({ lessonResource, studyPlanId, updateLessonResources, lessonId }: LessonResourceListProps) => {
    const resource = resourceTypeConfig[lessonResource.type];
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    if (!resource) {
        console.error(`Unsupported lesson resource type: ${lessonResource.type}`);
        return null;
    }

    const { color, icon: Icon, getTitle, editLink } = resource;
    const title = getTitle(lessonResource) || "Untitled";

    const handleDeleteClick = () => {
        if (lessonResource.active) {
            // Show toast notification if resource is active
            toast.error("You cannot delete an active lesson resource.");
        } else {
            // Open confirmation dialog if resource is not active
            setConfirmOpen(true);
        }
    };

    const handleDelete = async () => {
        if (lessonResource.lessonResourceId) {
            startTransition(async () => {
                try {
                    const response = await deleteLessonResourceById(lessonResource.lessonResourceId);
                    if (response && response.success) {
                        toast.success("Lesson resource deleted successfully!");
                        updateLessonResources(lessonId, lessonResource.lessonResourceId);
                    } else {
                        toast.error("Failed to delete lesson resource!");
                    }
                } catch (error) {
                    toast.error("An error occurred while deleting the lesson resource.");
                    console.error("Failed to delete lesson resource", error);
                } finally {
                    setConfirmOpen(false); // Close the confirmation dialog after deletion attempt
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
                        {lessonResource.active ? "ACTIVE" : "INACTIVE"}
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
                                <SelectItem className="bg-[#56D071] text-[#56D071] bg-opacity-10" value="true">ACTIVE</SelectItem>
                                <SelectItem className="bg-[#FD5673] text-[#FD5673] bg-opacity-10" value="false">INACTIVE</SelectItem>
                            </SelectContent>
                        </Select>
                    </div> */}
                </div>
                <div className="flex space-x-2">
                    <Link href={editLink(lessonResource, studyPlanId)}>
                        <Button size="icon" variant="ghost"><SquarePen /></Button>
                    </Link>
                    <Button onClick={handleDeleteClick} size="icon" variant="ghost"><Trash2 /></Button>
                </div>
            </div>

            {/* Confirmation dialog */}
            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <p>This action cannot be undone. This will permanently delete this lesson resource.</p>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={cancelDelete}>Cancel</AlertDialogCancel>
                        <Button variant={"destructive"} onClick={handleDelete} disabled={isPending}>
                            {isPending ? "Deleting..." : "Delete"}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default LessonResourceItem;
