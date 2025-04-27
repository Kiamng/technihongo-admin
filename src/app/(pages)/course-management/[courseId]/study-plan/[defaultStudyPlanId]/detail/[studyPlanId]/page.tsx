'use client'
import { getStudyPlanById } from "@/app/api/study-plan/study-plan.api";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";


import { StudyPlan } from "@/types/study-plan";

import { CornerDownLeft, PenLine } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import CustomBreadCrumb from "@/components/bread-cumb";
import { useParams } from "next/navigation";
import Link from "next/link";
import UpdateStudyPlanForm from "@/app/(pages)/course-management/_components/study-plan/update-study-plan-form";
import LessonListComponent from "@/app/(pages)/course-management/_components/lesson/lesson-list";

function StudPlanDetailPage() {
    const { defaultStudyPlanId, studyPlanId } = useParams();
    const numericStudyPlanId = studyPlanId ? parseInt(studyPlanId as string, 10) : null;
    const numericDefaultStudyPlanId = defaultStudyPlanId ? parseInt(defaultStudyPlanId as string, 10) : null;
    const { data: session } = useSession();

    console.log("default plan la:", numericDefaultStudyPlanId);
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
        if (!numericStudyPlanId) return;
        try {

            setStudyPlan(await getStudyPlanById(session?.user.token as string, numericStudyPlanId));
        } catch (error) {
            console.error(error);
            toast.error("Tải kế hoạch học tập thất bại");
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
                toast.error("Tải kế hoạch học tập thất bại");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [session?.user?.token]);


    if (isLoading) return <Skeleton className="w-full h-screen" />

    return (
        <div className="w-full space-y-6">
            <Link href={`/course-management/${studyPlan?.course.courseId}`}>
                <Button
                    variant="outline"
                >
                    <CornerDownLeft className="w-4 h-4" />
                    <span>Quay lại</span>
                </Button>
            </Link>
            <CustomBreadCrumb data={breadcrumbData} />
            <div className="text-4xl font-bold flex items-center">{studyPlan?.title} <PenLine size={28} /></div>
            {studyPlan && <div className="w-1/2">
                <UpdateStudyPlanForm token={session?.user?.token as string} studyPlan={studyPlan} />
            </div>}
            <Separator />

            {session?.user?.token && numericStudyPlanId && (
                <LessonListComponent defaultStudyPlanId={numericDefaultStudyPlanId as number} studyPlanId={numericStudyPlanId} token={session.user.token} isDefaultStudyPlan={studyPlan?.default as boolean} />
            )}
        </div>
    )
}

export default StudPlanDetailPage
