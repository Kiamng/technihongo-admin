"use client";
import { getAllDifficultyLevel } from "@/app/api/difficulty-level/difficulty-level.api";
import { getQuizById } from "@/app/api/quiz/quiz.api";
import { getQuizQuestionByQuizId } from "@/app/api/quiz-question/quiz-question.api";
import { getAnswersByQuestionId } from "@/app/api/quiz-answer-option/quiz-answer-option.api";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { DifficultyLevel } from "@/types/difficulty-level";

import { BookOpenCheck, CornerDownLeft, LoaderCircle } from "lucide-react";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Quiz } from "@/types/quiz";
import QuizEditForm from "@/app/(pages)/course-management/_components/quiz/quiz-edit-form";
import QuizUpdateStatus from "@/app/(pages)/course-management/_components/quiz/quiz-update-status";
import { Separator } from "@/components/ui/separator";
import QuestionInQuizList from "@/app/(pages)/course-management/_components/quiz/question-in-quiz-list";
export default function EditQuizPage() {
    const params = useParams();
    const { data: session } = useSession()
    const { courseId, defaultStudyPlanId, studyPlanId, quizId } = params;

    const [quiz, setQuiz] = useState<Quiz>();
    const [difficultyLevels, setDifficultyLevels] = useState<DifficultyLevel[]>([])
    const [customQuizQuestions, setCustomQuizQuestions] = useState<{
        quizQuestionId: number;
        questionOrder: number;
        questionId: number;
        questionType: "Single_choice" | "Multiple_choice";
        questionText: string;
        explanation: string;
        url: string;
        answers: { optionText: string; isCorrect: boolean }[] | [];
    }[]>([]);


    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isQuizQuestionsLoading, setIsQuizQuestionsLoading] = useState<boolean>(false);



    const fetchQuizQuestion = async () => {
        setIsQuizQuestionsLoading(true);
        try {
            const response = await getQuizQuestionByQuizId(parseInt(quizId as string, 10));

            const updatedQuizQuestions = await Promise.all(
                response.map(async (quizQuestion) => {
                    const answers = await fetchQuizAnswer(quizQuestion.question.questionId);

                    return {
                        quizQuestionId: quizQuestion.quizQuestionId,
                        questionOrder: quizQuestion.questionOrder,
                        questionId: quizQuestion.question.questionId,
                        questionType: quizQuestion.question.questionType,
                        questionText: quizQuestion.question.questionText,
                        explanation: quizQuestion.question.explanation,
                        url: quizQuestion.question.url,
                        answers: answers ? answers.map((answer) => ({
                            optionText: answer.optionText,
                            isCorrect: answer.correct,
                        })) : [],
                    };
                })
            );

            setCustomQuizQuestions(updatedQuizQuestions);
        } catch (error) {
            console.log(error);
        } finally {
            setIsQuizQuestionsLoading(false);
        }
    };


    const fetchQuizAnswer = async (questionId: number) => {
        try {
            const response = await getAnswersByQuestionId(questionId);
            return response;
        } catch (error) {
            console.log(error);
        }
    };

    const fetchDifficultyLevel = async () => {
        try {
            const response = await getAllDifficultyLevel(session?.user.token as string);
            setDifficultyLevels(response);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchQuiz = async () => {
        try {
            const response = await getQuizById(session?.user.token as string, parseInt(quizId as string, 10))
            setQuiz(response)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (!session?.user?.token) return;

        const fetchData = async () => {
            setIsLoading(true);
            try {
                await fetchQuiz();
                await Promise.all([fetchQuizQuestion(), fetchDifficultyLevel()]);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load quiz.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [quizId, session?.user.token]);

    const loading = isLoading || !difficultyLevels


    return (
        <div className="w-full flex flex-col space-y-6">
            <Link href={`/course-management/${courseId}/study-plan/${defaultStudyPlanId}/detail/${studyPlanId}`}>
                <Button variant="outline">
                    <CornerDownLeft className="w-4 h-4" />
                    <span>Back</span>
                </Button>
            </Link>
            <div className=" flex flex-row space-x-6 items-center">
                <div className="flex flex-row space-x-4 items-center">
                    <div className="rounded-full p-2 bg-[#FFB600] bg-opacity-10">
                        <BookOpenCheck className="text-[#FFB600]" size={28} />
                    </div>
                    <span className="text-4xl font-bold ">Edit Quiz Details</span>
                </div>
                {quiz ?
                    <QuizUpdateStatus quiz={quiz} setQuiz={setQuiz} token={session?.user.token as string} />
                    :
                    <LoaderCircle className="animate-spin" />
                }
            </div>
            {quiz ?
                <QuizEditForm
                    difficultyLevels={difficultyLevels}
                    loading={loading}
                    quiz={quiz}
                    token={session?.user.token as string} />
                : <Skeleton className="w-full h-[500px]" />
            }
            <Separator />
            {quiz &&
                <QuestionInQuizList
                    token={session?.user.token as string}
                    fetchQuizQuestion={fetchQuizQuestion}
                    quiz={quiz}
                    isQuizQuestionsLoading={isQuizQuestionsLoading}
                    initialData={customQuizQuestions} />
            }

        </div>
    )
}