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
import { CornerDownLeft, PenLine, } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';


import CourseUpdateForm from "../_components/course/update-course-component";
import StudyPlanList from "../_components/study-plan/study-plan-list";
import { StudyPlan } from "@/types/study-plan";
import CreateStudyPlanPopUp from "../_components/study-plan/create-study-plan-pop-up";
import EmptyStateComponent from "@/components/empty-state";
import CustomBreadCrumb from "@/components/bread-cumb";
import Link from "next/link";

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
            name: 'Course management',
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
            toast.error("Failed to load study plans.");
        }
    };

    const fetchCourse = async () => {
        if (!numericCourseId) return
        try {
            const courseResponse = await getCourseById(session?.user.token as string, numericCourseId);
            setCourse(courseResponse);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load course details.");
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
                toast.error("Failed to load course or study plans.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [session?.user?.token]);

    const handleSubmit = async (values: z.infer<typeof updateCourseSchema>, selectedFile: File | null) => {
        setIsPending(true);
        let imgUrl: string = "";

        // Kiểm tra nếu thumbnailUrl là string (đã có sẵn)
        if (typeof values.thumbnailUrl === "string") {
            imgUrl = values.thumbnailUrl;
        }

        // Kiểm tra nếu thumbnailUrl là File (có ảnh mới được chọn)
        if (selectedFile instanceof File) {
            const formData = new FormData();
            formData.append('file', selectedFile);
            const uploadedUrl = await uploadImageCloud(formData);
            if (uploadedUrl) {
                imgUrl = uploadedUrl; // Cập nhật với ảnh mới
            }
        }

        // Gửi API patchCourse với dữ liệu đã xử lý
        const finalData = {
            ...values,
            thumbnailUrl: imgUrl, // Chắc chắn là string
        };

        const patchResponse = await patchCourse(finalData, session?.user.token as string, numericCourseId as number);
        if (patchResponse.success === true) {
            toast.success(patchResponse.message);
        } else {
            toast.error(patchResponse.message);
        }
        setIsPending(false);
        console.log(values);

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
            <div className="text-4xl font-bold flex items-center">{course?.title} <PenLine size={28} /></div>
            <CourseUpdateForm course={course} onSubmit={handleSubmit} isPending={isPending} />
            <Separator />
            <div className="w-full flex justify-between">
                <div className="text-4xl font-bold flex items-center">Study plans in course</div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger className="flex items-center gap-2 py-2 px-4 bg-primary rounded-xl hover:bg-primary/90 text-white">
                        Create new study plan
                    </DialogTrigger>
                    <DialogContent width='400px'>
                        <CreateStudyPlanPopUp fetchStudyPlan={fetchStudyPlan} setIsDialogOpen={setIsDialogOpen} courseId={numericCourseId as number} />
                    </DialogContent>
                </Dialog>
            </div>
            {studyPlans ? <StudyPlanList fetchStudyPlan={fetchStudyPlan} StudyPlanList={studyPlans} /> : <EmptyStateComponent imgageUrl="https://allpromoted.co.uk/image/no-data.svg" message="This Course does not have any study plans" size={400} />}

        </div>
    )
}
