'use client'
import { getCourseById, patchCourse } from "@/app/api/course/course.api";
import { uploadImageCloud } from "@/app/api/image/image.api";
import { getStudyPlanByCourseId } from "@/app/api/study-plan/study-plan.api";


import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";


import { Course } from "@/types/course";
import { updateCourseSchema } from "@/schema/course";


import { Skeleton } from "@/components/ui/skeleton";

import { Button } from "@/components/ui/button";
import { CornerDownLeft, LoaderCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';


import CourseUpdateForm from "../_components/course/update-course-component";
import StudyPlanList from "../_components/study-plan/study-plan-list";
import { StudyPlan } from "@/types/study-plan";
import CreateStudyPlanPopUp from "../_components/study-plan/create-study-plan-pop-up";
import EmptyStateComponent from "@/components/empty-state";
import CustomBreadCrumb from "@/components/bread-cumb";
import Link from "next/link";
import CoursePublicStatusUpdate from "../_components/course/update-course-public-status";

export default function CourseDetailPage() {
    const { courseId } = useParams();
    const numericCourseId = courseId ? parseInt(courseId as string, 10) : null;
    const { data: session } = useSession();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [course, setCourse] = useState<Course>();
    const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([])
    const [isPending, setIsPending] = useState<boolean>(false);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    const breadcrumbData = useMemo(() => [
        {
            name: 'Khóa học',
            link: `course-management`,
            isPage: false
        },
        {
            name: course?.title,
            link: ``,
            isPage: true
        }
    ], [course]);

    const fetchStudyPlan = async () => {
        if (!numericCourseId) return
        try {
            const studyPlansData = await getStudyPlanByCourseId(numericCourseId, session?.user.token as string);
            setStudyPlans(studyPlansData);
        } catch (error) {
            console.error(error);
            toast.error("Tải kế hoạch học tập thất bại");
        }
    };

    const fetchCourse = async () => {
        if (!numericCourseId) return
        try {
            const courseResponse = await getCourseById(session?.user.token as string, numericCourseId);
            setCourse(courseResponse);
        } catch (error) {
            console.error(error);
            toast.error("Tải thông tin khóa học thất bại");
        }
    };


    useEffect(() => {
        if (!session?.user?.token) return;

        const fetchData = async () => {
            setIsLoading(true);
            try {
                await Promise.all([fetchCourse(), fetchStudyPlan()]);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [session?.user?.token]);

    const handleSubmit = async (values: z.infer<typeof updateCourseSchema>, selectedFile: File | null) => {
        setIsPending(true);
        let imgUrl: string = "";

        try {
            if (typeof values.thumbnailUrl === "string") {
                imgUrl = values.thumbnailUrl;
            }

            if (selectedFile instanceof File) {
                const formData = new FormData();
                formData.append('file', selectedFile);
                const uploadedUrl = await uploadImageCloud(formData);
                if (uploadedUrl) {
                    imgUrl = uploadedUrl;
                }
            }

            const finalData = {
                ...values,
                thumbnailUrl: imgUrl,
            };

            const patchResponse = await patchCourse(finalData, session?.user.token as string, numericCourseId as number);

            if (patchResponse.success === true) {
                toast.success(patchResponse.message);
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast.error(error?.response.data.message);
        } finally {
            setIsPending(false);
        }
    };


    if (isLoading) return <Skeleton className="w-full h-screen" />;

    return (
        <div className="w-full space-y-6">
            <Link href={`/course-management`}>
                <Button
                    variant="outline"
                >
                    <CornerDownLeft className="w-4 h-4" />
                    <span>Quay lại</span>
                </Button>
            </Link>

            <CustomBreadCrumb data={breadcrumbData} />
            <div className="w-full flex flex-row space-x-4">
                <div className="text-4xl font-bold items-center">{course?.title}</div>
                {course
                    ? <CoursePublicStatusUpdate
                        course={course}
                        setCourse={setCourse}
                        token={session?.user.token as string} />
                    : <LoaderCircle className="animate-spin" />}
            </div>
            <CourseUpdateForm token={session?.user.token as string} course={course} onSubmit={handleSubmit} isPending={isPending} />
            <Separator />
            <div className="w-full flex justify-between">
                <div className="text-4xl font-bold flex items-center">Kế hoạch học tập:</div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger className="flex items-center gap-2 py-2 px-4 bg-primary rounded-xl hover:bg-primary/90 text-white">
                        Thêm mới kế hoạch
                    </DialogTrigger>
                    <DialogContent width='400px'>
                        <CreateStudyPlanPopUp
                            fetchStudyPlan={fetchStudyPlan}
                            setIsDialogOpen={setIsDialogOpen}
                            courseId={numericCourseId as number}
                            token={session?.user.token as string} />
                    </DialogContent>
                </Dialog>
            </div>
            {studyPlans ?
                <StudyPlanList
                    token={session?.user.token as string}
                    fetchStudyPlan={fetchStudyPlan}
                    StudyPlanList={studyPlans} />
                : <EmptyStateComponent imgageUrl="https://allpromoted.co.uk/image/no-data.svg" message="Không tìm thấy kế hoạch học tập nào" size={400} />}

        </div>
    )
}
