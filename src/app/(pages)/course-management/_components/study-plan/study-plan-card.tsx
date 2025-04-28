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
    token: string
    plan: StudyPlan;
    defaultStudyPlanId: number;
    fetchStudyPlan: () => Promise<void>;
}
const StudyPlanCard = ({ token, plan, defaultStudyPlanId, fetchStudyPlan }: StudyPlanCardProps) => {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleDelete = async () => {
        if (plan.default) {
            toast.warning('Không thể xóa kế hoạch học tập mặc định!')
            return
        }
        startTransition(async () => {
            try {
                const response = await deleteStudyPlan(token, plan.studyPlanId);
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
                            Đang hoạt động
                        </div>)
                        :
                        (<div className="px-4 py-2 bg-[#FD5673] w-fit text-[#FD5673] rounded-xl text-xs font-semibold bg-opacity-10">
                            Đang hoạt động
                        </div>
                        )}
                </div>
                <div className="text-base font-medium text-slate-400">Mô tả: {plan.description}</div>
                <div className="text-base font-medium text-slate-400">Ngày tạo: {format(new Date(plan.createdAt), "dd/MM/yy")}</div>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <EllipsisVertical />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <Link href={`/course-management/${plan.course.courseId}/study-plan/${defaultStudyPlanId}/detail/${plan.studyPlanId}`}>
                        <DropdownMenuItem>
                            <Eye /> Xem thêm
                        </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem onClick={() => setConfirmOpen(true)}>
                        <Trash /> Xóa
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Bạn có chắc không?</AlertDialogTitle>
                        <p>Hành động này sẽ không thể hoàn tác, kế hoạch học tập này sẽ bị xóa vĩnh viễn.</p>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setConfirmOpen(false)}>Hủy</AlertDialogCancel>
                        <Button variant={"destructive"} onClick={handleDelete} disabled={isPending} >
                            {isPending ? "Đang xóa..." : <><Trash /> Xóa</>}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}


export default StudyPlanCard
