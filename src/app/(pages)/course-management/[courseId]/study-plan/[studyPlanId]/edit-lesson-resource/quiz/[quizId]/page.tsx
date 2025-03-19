"use client";

import { getQuizById } from "@/app/api/quiz/quiz.api";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Quiz } from "@/types/quiz";

import { CornerDownLeft } from "lucide-react";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditQuizPage() {
    const params = useParams();
    const { data: session } = useSession()
    const { courseId, studyPlanId, quizId } = params;

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [quiz, setQuiz] = useState<Quiz>();



    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                setIsLoading(true)
                const response = await getQuizById(session?.user.token as string, parseInt(quizId as string, 10))
                setQuiz(response)
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false)
            }
        }
        fetchQuiz()
    }, [quizId])

    if (isLoading) return (
        <Skeleton className="w-full h-screen" />
    )

    return (
        <div className="w-full space-y-6">
            <Link href={`/course-management/${courseId}/study-plan/${studyPlanId}`}>
                <Button
                    variant="outline"
                >
                    <CornerDownLeft className="w-4 h-4" />
                    <span>Quay lại</span>
                </Button>
            </Link>
            {quiz?.title}
        </div>
    )
}
