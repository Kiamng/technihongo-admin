import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { toast } from "sonner";
import { Dispatch, SetStateAction, useTransition } from "react";

import { Quiz } from "@/types/quiz";

import { updateQuizStatus } from "@/app/api/quiz/quiz.api";

interface QuizUpdateStatusProps {
    quiz: Quiz,
    token: string,
    setQuiz: Dispatch<SetStateAction<Quiz | undefined>>
}
const QuizUpdateStatus = ({ quiz, token, setQuiz }: QuizUpdateStatusProps) => {
    const [isUSPending, startUSTransition] = useTransition();

    const handleChangePublicStatus = async (publicStatus: string) => {
        if (!quiz) {
            return;
        }
        startUSTransition(async () => {
            try {
                const response = await updateQuizStatus(
                    token,
                    quiz.quizId,
                    publicStatus === 'true',
                    quiz?.deleted
                );

                if (response.success) {
                    toast.success("Quiz public status updated successfully!");

                    // Safely update the quiz state
                    setQuiz((prevQuiz) => prevQuiz ? { ...prevQuiz, public: publicStatus === 'true' } : prevQuiz);
                } else {
                    toast.error(response.message || "Failed to update quiz public status.");
                }
            } catch (error) {
                console.error("Error updating quiz public status:", error);
                toast.error("An error occurred while updating quiz public status.");
            }
        })
    };

    return (
        <div>
            <Select
                disabled={isUSPending}
                value={quiz?.public.toString()}
                onValueChange={(value) => handleChangePublicStatus(value)}>
                <SelectTrigger
                    className={quiz?.public
                        ? "bg-[#56D071] text-[#56D071] bg-opacity-10"
                        : "bg-[#FD5673] text-[#FD5673] bg-opacity-10"}>
                    <SelectValue
                        placeholder="Public" />
                </SelectTrigger>
                <SelectContent >
                    <SelectItem className="bg-[#56D071] text-[#56D071] bg-opacity-10" value="true">Đang hoạt động</SelectItem>
                    <SelectItem className="bg-[#FD5673] text-[#FD5673] bg-opacity-10" value="false">không hoạt động</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}

export default QuizUpdateStatus
