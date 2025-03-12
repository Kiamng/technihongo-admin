'use client'
import { getStudyPlanById } from "@/app/api/study-plan/study-plan.api";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { StudyPlan } from "@/types/study-plan";

import { CornerDownLeft, PenLine } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import UpdateStudyPlanForm from "../../_components/study-plan/update-study-plan-form";
import CustomBreadCrumb from "@/components/bread-cumb";

interface StudPlanDetailPageProps {
    params: Promise<{ studyPlanId: number }>
}
function StudPlanDetailPage({ params }: StudPlanDetailPageProps) {
    const resolvedParam = use(params);
    const { data: session } = useSession();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [studyPlan, setStudPlan] = useState<StudyPlan>();

    const breadcrumbData = [
        {
            name: studyPlan?.course.title,
            link: `course-management/${studyPlan?.course.courseId}`,
            isPage: false
        },
        {
            name: studyPlan?.title,
            link: ``,
            isPage: true
        }
    ]
    useEffect(() => {
        if (!session?.user?.token) return;
        const fetchStudyPlan = async () => {
            setIsLoading(true);
            try {
                setStudPlan(await getStudyPlanById(session.user.token, resolvedParam.studyPlanId))
            } catch (error) {
                console.error(error);
                toast.error("Failed to load course or study plans.");
            } finally {
                setIsLoading(false);
            }
        }
        fetchStudyPlan()
    }, [session?.user?.token])

    if (isLoading) return <Skeleton className="w-full h-screen" />

    return (
        <div className="w-full space-y-6">
            <Button
                onClick={() => router.back()}
                variant="outline"
            >
                <CornerDownLeft className="w-4 h-4" />
                <span>Quay lại</span>
            </Button>
            <CustomBreadCrumb data={breadcrumbData} />
            <div className="text-4xl font-bold flex items-center">{studyPlan?.title} <PenLine size={28} /></div>
            {studyPlan && <div className="w-1/2">
                <UpdateStudyPlanForm studyPlan={studyPlan} />
            </div>}

        </div>
    )
}

export default StudPlanDetailPage
