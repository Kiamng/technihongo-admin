import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { toast } from "sonner";
import { Dispatch, SetStateAction, useTransition } from "react";

import { LearningResource } from "@/types/learning-resource";
import { updateLearningResourceStatus } from "@/app/api/learning-resource/learning-resource.api";

interface LearningResourceUpdatePublicStatusProps {
    learningResource: LearningResource,
    token: string,
    setLearningResource: Dispatch<SetStateAction<LearningResource | undefined>>
}
const LearningResourceUpdatePublicStatus = ({ learningResource, token, setLearningResource }: LearningResourceUpdatePublicStatusProps) => {
    const [isUSPending, startUSTransition] = useTransition();

    const handleChangePublicStatus = async (publicStatus: string) => {
        if (!learningResource) {
            return;
        }
        startUSTransition(async () => {
            try {
                const response = await updateLearningResourceStatus(
                    token,
                    learningResource.resourceId,
                    publicStatus === 'true',
                );

                if (response.success) {
                    toast.success("Cập nhật trạng thái thành công");

                    setLearningResource((prevQuiz) => prevQuiz ? { ...prevQuiz, public: publicStatus === 'true' } : prevQuiz);
                } else {
                    toast.error(response.message || "Cập nhật trạng thái thất bại");
                }
            } catch (error) {
                console.error("Error updating Learning resource public status:", error);
                toast.error("Cập nhật trạng thái thất bại.");
            }
        })
    };

    return (
        <div>
            <Select
                disabled={isUSPending}
                value={learningResource?.public.toString()}
                onValueChange={(value) => handleChangePublicStatus(value)}>
                <SelectTrigger
                    className={learningResource?.public
                        ? "bg-[#56D071] text-[#56D071] bg-opacity-10"
                        : "bg-[#FD5673] text-[#FD5673] bg-opacity-10"}>
                    <SelectValue
                        placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent >
                    <SelectItem className="bg-[#56D071] text-[#56D071] bg-opacity-10" value="true">Đang hoạt động</SelectItem>
                    <SelectItem className="bg-[#FD5673] text-[#FD5673] bg-opacity-10" value="false">Không hoạt động</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}

export default LearningResourceUpdatePublicStatus
