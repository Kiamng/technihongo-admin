import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { StudyPlan } from "@/types/study-plan";

import { format } from "date-fns";
import { EllipsisVertical, Eye, Trash } from "lucide-react";
import Link from "next/link";

interface StudyPlanListProps {
    StudyPlanList: StudyPlan[];
}

const StudyPlanList = ({ StudyPlanList }: StudyPlanListProps) => {
    const defaultStudyPlan = StudyPlanList.find(plan => plan.default);
    const otherStudyPlans = StudyPlanList.filter(plan => !plan.default);
    return (
        <div className="w-full space-y-6">
            {defaultStudyPlan && (
                <>
                    <div className="text-xl font-medium">Default study plan:</div>
                    <div className="default width w-1/2">
                        <StudyPlanCard plan={defaultStudyPlan} />
                    </div>
                </>
            )}

            {otherStudyPlans.length > 0 && (
                <>
                    <div className="text-xl font-medium">Other study plan:</div>
                    <div className="w-full grid gap-6 grid-cols-3">
                        {otherStudyPlans.map(plan => (
                            <StudyPlanCard key={plan.studyPlanId} plan={plan} />
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

interface StudyPlanCardProps {
    plan: StudyPlan;
}
const StudyPlanCard = ({ plan }: StudyPlanCardProps) => (
    <div className="default study plan w-full flex flex-row justify-between items-center p-5 rounded-[20px] border-[1px]">
        <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2 items-center">
                <div className="text-base font-medium">{plan.title}</div>
                {plan.default ? (
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
                <Link href={`/study-plans/${plan.studyPlanId}`}>
                    <DropdownMenuItem>
                        <Eye /> View more
                    </DropdownMenuItem>
                </Link>
                <DropdownMenuItem>
                    <Trash /> Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
);

export default StudyPlanList
