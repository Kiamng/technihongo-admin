import { StudyPlan } from "@/types/study-plan";
import StudyPlanCard from "./study-plan-card";

interface StudyPlanListProps {
    StudyPlanList: StudyPlan[];
    fetchStudyPlan: () => Promise<void>;
}

const StudyPlanList = ({ StudyPlanList, fetchStudyPlan }: StudyPlanListProps) => {
    const defaultStudyPlan = StudyPlanList.find(plan => plan.default);
    const otherStudyPlans = StudyPlanList.filter(plan => !plan.default);
    return (
        <div className="w-full space-y-6">
            {defaultStudyPlan && (
                <>
                    <div className="text-xl font-medium">Default study plan:</div>
                    <div className="default width w-1/2">
                        <StudyPlanCard fetchStudyPlan={fetchStudyPlan} plan={defaultStudyPlan} />
                    </div>
                </>
            )}

            {otherStudyPlans.length > 0 && (
                <>
                    <div className="text-xl font-medium">Other study plan:</div>
                    <div className="w-full grid gap-6 grid-cols-3">
                        {otherStudyPlans.map(plan => (
                            <StudyPlanCard fetchStudyPlan={fetchStudyPlan} key={plan.studyPlanId} plan={plan} />
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}
export default StudyPlanList
