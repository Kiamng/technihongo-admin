import { StudyPlan } from "@/types/study-plan";
import StudyPlanCard from "./study-plan-card";

interface StudyPlanListProps {
    token: string
    StudyPlanList: StudyPlan[];
    fetchStudyPlan: () => Promise<void>;
}

const StudyPlanList = ({ token, StudyPlanList, fetchStudyPlan }: StudyPlanListProps) => {
    const defaultStudyPlan = StudyPlanList.find(plan => plan.default);
    const otherStudyPlans = StudyPlanList.filter(plan => !plan.default);
    return (
        <div className="w-full space-y-6">
            {defaultStudyPlan && (
                <>
                    <div className="text-xl font-medium">Kế hoạch học tập mặc định:</div>
                    <div className="default width w-1/2">
                        <StudyPlanCard token={token} defaultStudyPlanId={defaultStudyPlan.studyPlanId} fetchStudyPlan={fetchStudyPlan} plan={defaultStudyPlan} />
                    </div>
                </>
            )}

            {otherStudyPlans.length > 0 && (
                <>
                    <div className="text-xl font-medium">Các kế hoạch học tập khác:</div>
                    <div className="w-full grid gap-6 grid-cols-3">
                        {otherStudyPlans.map(plan => (
                            <StudyPlanCard token={token} defaultStudyPlanId={defaultStudyPlan?.studyPlanId as number} fetchStudyPlan={fetchStudyPlan} key={plan.studyPlanId} plan={plan} />
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}
export default StudyPlanList
