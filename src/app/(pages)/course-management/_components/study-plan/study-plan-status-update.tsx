import { Dispatch, SetStateAction, useTransition } from "react"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { StudyPlan } from "@/types/study-plan";
import { updateStudyPlanActiveStatus } from "@/app/api/study-plan/study-plan.api";

interface SetPublicStatusUpdateProps {
    studyPlan: StudyPlan,
    token: string,
    setStudyPlan: Dispatch<SetStateAction<StudyPlan | undefined>>
}

const StudyPlanActiveStatusUpdate = ({ studyPlan, token, setStudyPlan }: SetPublicStatusUpdateProps) => {
    const [isUSPending, startUSTransition] = useTransition();

    const handleChangePublicStatus = async (publicStatus: string) => {
        if (!studyPlan) {
            return;
        }
        startUSTransition(async () => {
            try {
                const response = await updateStudyPlanActiveStatus(
                    token,
                    studyPlan.studyPlanId,
                    publicStatus === 'true',
                );

                if (response.success) {
                    toast.success("Cập nhật trạng thái thành công");

                    setStudyPlan((prevSet) => prevSet ? { ...prevSet, active: publicStatus === 'true' } : prevSet);
                } else {
                    toast.error(response.message || "Cập nhật trạng thái thất bại!");
                }
            } catch (error) {
                console.error("Error updating flashcard set public status:", error);
                toast.error("Cập nhật trạng thái thất bại");
            }
        })
    };

    return (
        <div>
            <Select
                disabled={isUSPending}
                value={studyPlan?.active.toString()}
                onValueChange={(value) => handleChangePublicStatus(value)}>
                <SelectTrigger
                    className={studyPlan?.active
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
        </div>
    )
}

export default StudyPlanActiveStatusUpdate
