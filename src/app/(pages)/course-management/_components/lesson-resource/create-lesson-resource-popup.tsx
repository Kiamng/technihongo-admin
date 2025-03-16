import { useState, useTransition } from "react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BookOpenCheck, Copy, LoaderCircle, Youtube } from "lucide-react";
import { Lesson } from "@/types/lesson";
import { useRouter } from "next/navigation";

interface CreateLessonResourcePopupProps {
    lesson: Lesson;
    closeForm: (open: boolean) => void;
    fetchLessons: () => Promise<void>;
}

const CreateLessonResourcePopup = ({ lesson, fetchLessons, closeForm }: CreateLessonResourcePopupProps) => {
    const [selectedType, setSelectedType] = useState<string>("LearningResource");
    const [isPending, startTransition] = useTransition()
    const router = useRouter();
    const handleSubmit = async () => {
        if (selectedType === "LearningResource") {
            router.push(`/course-management/${lesson.studyPlan.course.courseId}/study-plan/${lesson.studyPlan.studyPlanId}/edit-lesson-resource/learning-resource/1`)
        }
        // startTransition(async () => {
        //     try {
        //         // Giả lập API call để tạo lesson resource
        //         console.log(`Creating lesson resource: ${selectedType} for lessonId: ${lessonId}`);

        //         // TODO: Gửi `selectedType` lên server qua API POST
        //         await new Promise((resolve) => setTimeout(resolve, 1000)); // Giả lập delay API

        //         // Cập nhật danh sách tài nguyên sau khi tạo thành công
        //         // await fetchLessons();

        //         // Đóng popup sau khi submit
        //         closeForm(false);
        //     } catch (error) {
        //         console.error("Failed to create lesson resource", error);
        //     }
        // })
    };

    return (
        <>
            <DialogHeader>
                <DialogTitle>Choose a type of lesson resource:</DialogTitle>
            </DialogHeader>

            <RadioGroup value={selectedType} onValueChange={setSelectedType} className="space-y-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-base">
                        <div className="p-[6px] rounded-full bg-[#FD5673] bg-opacity-10 text-[#FD5673]">
                            <Youtube size={20} />
                        </div>
                        <span>Learning resource</span>
                    </div>
                    <RadioGroupItem value="LearningResource" id="learning-resource" />
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-base">
                        <div className="p-[6px] rounded-full bg-[#3AC6C6] bg-opacity-10 text-[#3AC6C6]">
                            <Copy size={20} />
                        </div>
                        <span>Flashcard set</span>
                    </div>
                    <RadioGroupItem value="FlashcardSet" id="flashcard-set" />
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-base">
                        <div className="p-[6px] rounded-full bg-[#FFB600] bg-opacity-10 text-[#FFB600]">
                            <BookOpenCheck size={20} />
                        </div>
                        <span>Quiz</span>
                    </div>
                    <RadioGroupItem value="Quiz" id="quiz" />
                </div>
            </RadioGroup>

            <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => closeForm(false)}>Cancel</Button>
                <Button disabled={isPending} onClick={handleSubmit}>
                    {isPending ? <><LoaderCircle className="animate-spin" /> Processing ...</> : "Continue"}
                </Button>
            </div>
        </>
    );
};

export default CreateLessonResourcePopup;
