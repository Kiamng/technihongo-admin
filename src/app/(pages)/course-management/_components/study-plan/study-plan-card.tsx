import { deleteStudyPlan } from "@/app/api/study-plan/study-plan.api";
import { StudyPlan } from "@/types/study-plan";
import { format } from "date-fns";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EllipsisVertical, Eye, Trash } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";


interface StudyPlanCardProps {
    plan: StudyPlan;
    fetchStudyPlan: () => Promise<void>;
}
const StudyPlanCard = ({ plan, fetchStudyPlan }: StudyPlanCardProps) => {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleDelete = async () => {
        startTransition(async () => {
            try {
                const response = await deleteStudyPlan(plan.studyPlanId);
                if (!response || response.success === false) {
                    toast.error("Failed to delete subscription plan!");
                } else {
                    toast.success("Subscription plan deleted successfully!");
                    fetchStudyPlan();
                }
            } catch (error) {
                console.error(error);
                toast.error("An error occurred while deleting.");
            } finally {
                setConfirmOpen(false);
            }
        });
    };

    return (
        <div className="default study plan w-full flex flex-row justify-between items-center p-5 rounded-[20px] border-[1px]">
            <div className="flex flex-col gap-2">
                <div className="flex flex-row gap-2 items-center">
                    <div className="text-base font-medium">{plan.title}</div>
                    {plan.active ? (
                        <div className="px-4 py-2 bg-[#56D071] w-fit text-[#56D071] rounded-xl text-xs font-semibold bg-opacity-10">
                            ACTIVE
                        </div>)
                        :
                        (<div className="px-4 py-2 bg-[#FD5673] w-fit text-[#FD5673] rounded-xl text-xs font-semibold bg-opacity-10">
                            NON-ACTIVE
                        </div>
                        )}
                </div>
                <div className="text-base font-medium text-slate-400">Description: {plan.description}</div>
                <div className="text-base font-medium text-slate-400">Created date: {format(new Date(plan.createdAt), "dd/MM/yy")}</div>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <EllipsisVertical />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <Link href={`/course-management/${plan.course.courseId}/study-plan/${plan.studyPlanId}`}>
                        <DropdownMenuItem>
                            <Eye /> View more
                        </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem onClick={() => setConfirmOpen(true)}>
                        <Trash /> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <p>This action cannot be undone. This will permanently delete this study plan.</p>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setConfirmOpen(false)}>Cancel</AlertDialogCancel>
                        <Button variant={"destructive"} onClick={handleDelete} disabled={isPending} >
                            {isPending ? "Deleting..." : <><Trash /> Delete</>}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}


export default StudyPlanCard
