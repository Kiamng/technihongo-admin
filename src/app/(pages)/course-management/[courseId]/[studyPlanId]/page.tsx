'use client'
import { getStudyPlanById } from "@/app/api/study-plan/study-plan.api";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";


import { StudyPlan } from "@/types/study-plan";

import { CornerDownLeft, PenLine } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { use, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import UpdateStudyPlanForm from "../../_components/study-plan/update-study-plan-form";
import CustomBreadCrumb from "@/components/bread-cumb";
import LessonListComponent from "../../_components/lesson/lesson-list";

interface StudPlanDetailPageProps {
    params: Promise<{ studyPlanId: number }>
}
function StudPlanDetailPage({ params }: Readonly<StudPlanDetailPageProps>) {
    const resolvedParam = use(params);
    const { data: session } = useSession();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [studyPlan, setStudyPlan] = useState<StudyPlan>();

    const breadcrumbData = useMemo(() => [
        {
            name: 'Course management',
            link: `course-management`,
            isPage: false
        },
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
    ], [studyPlan]);

    const fetchStudyPlan = async () => {
        try {
            setStudyPlan(await getStudyPlanById(session?.user.token as string, resolvedParam.studyPlanId));
        } catch (error) {
            console.error(error);
            toast.error("Failed to load study plan.");
        }
    };

    useEffect(() => {
        if (!session?.user?.token || studyPlan) return;
        const fetchData = async () => {
            setIsLoading(true);
            try {
                await fetchStudyPlan();
            } catch (error) {
                console.error(error);
                toast.error("Failed to load study plan.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [session?.user?.token]);


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
            <Separator />

            {session?.user?.token && (
                <LessonListComponent studyPlanId={resolvedParam.studyPlanId} token={session.user.token} isDefaultStudyPlan={studyPlan?.default as boolean} />
            )}
        </div>
    )
}

export default StudPlanDetailPage
