import { useState, useTransition } from "react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BookOpenCheck, Copy, LoaderCircle, Youtube } from "lucide-react";
import { Lesson } from "@/types/lesson";
import { useRouter } from "next/navigation";
import { createLearningResource } from "@/app/api/learning-resource/learning-resource.api";
import { toast } from "sonner";
import { createLessonResource } from "@/app/api/lesson-resource/lesson-resource.api";
import { createQuiz } from "@/app/api/quiz/quiz.api";


interface CreateLessonResourcePopupProps {
    lesson: Lesson;
    closeForm: (open: boolean) => void;
    token: string
}

const CreateLessonResourcePopup = ({ lesson, closeForm, token }: CreateLessonResourcePopupProps) => {
    const [selectedType, setSelectedType] = useState<string>("LearningResource");
    const [isPending, startTransition] = useTransition()
    const router = useRouter();
    const handleSubmit = async () => {
        startTransition(async () => {
            try {
                let draftData;
                let response;
                if (selectedType === "LearningResource") {
                    draftData = {
                        title: "Draft learning resource",
                        description: "This is a draft learning resource",
                        pdfFilename: "",
                        pdfUrl: "",
                        videoFilename: "",
                        videoUrl: "",
                        premium: lesson.studyPlan.course.premium,
                    };
                    response = await createLearningResource(token, draftData);
                    if (response.success) {
                        const lessonResourceResponse = await createLessonResource({ lessonId: lesson.lessonId, resourceId: response.data.resourceId })
                        if (lessonResourceResponse.success) {
                            // If linking resource with lesson was successful, redirect to the edit page
                            router.push(`/course-management/${lesson.studyPlan.course.courseId}/study-plan/${lesson.studyPlan.studyPlanId}/edit-lesson-resource/learning-resource/${response.data.resourceId}`);
                        } else {
                            // Show an error if creating lesson resource fails
                            toast.error(`Failed to associate resource with lesson: ${lessonResourceResponse.message}`);
                        }
                    } else {
                        // If the creation fails, show an error toast
                        toast.error(`Failed to create learning resource: ${response.message}`);
                    }
                }

                if (selectedType === "FlashcardSet") {
                    draftData = {
                        title: "Draft flashcard set",
                        description: "This is a draft flashcard set",
                        flashcards: [],   // Assuming this is a valid field in FlashcardSet schema
                    };
                    // Call your API for FlashcardSet (assuming it exists)
                    router.push(`/course-management/${lesson.studyPlan.course.courseId}/study-plan/${lesson.studyPlan.studyPlanId}/edit-lesson-resource/flashcard-set/2`);
                }

                if (selectedType === "Quiz") {
                    draftData = {
                        title: "Draft quiz",
                        description: "This is a draft quiz",
                        difficultyLevelId: 1,
                        passingScore: 0.5
                    };
                    response = await createQuiz(token, draftData);
                    if (response.success) {
                        const lessonResourceResponse = await createLessonResource({ lessonId: lesson.lessonId, quizId: response.data.quizId })
                        if (lessonResourceResponse.success) {
                            router.push(`/course-management/${lesson.studyPlan.course.courseId}/study-plan/${lesson.studyPlan.studyPlanId}/edit-lesson-resource/quiz/${response.data.quizId}`);
                        } else {
                            toast.error(`Failed to associate quiz with lesson: ${lessonResourceResponse.message}`);
                        }
                    } else {
                        // If the creation fails, show an error toast
                        toast.error(`Failed to create quiz: ${response.message}`);
                    }
                }

            } catch (error) {
                console.error("Failed to create lesson resource", error);
            }
        });
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
