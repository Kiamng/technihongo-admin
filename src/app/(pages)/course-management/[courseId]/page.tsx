'use client'
import { getCourseById, patchCourse } from "@/app/api/course/course.api";
import { getAllDomain } from "@/app/api/system-configuration/system.api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { Course } from "@/types/course";
import { Domain } from "@/types/domain";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { z } from "zod";
import { updateCourseSchema } from "@/schema/course";
import { uploadImageCloud } from "@/app/api/image/image.api";
import { Button } from "@/components/ui/button";
import { CornerDownLeft, PenLine, } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';


import { getStudyPlanByCourseId } from "@/app/api/study-plan/study-plan.api";
import CourseUpdateForm from "../_components/course/update-course-component";
import StudyPlanList from "../_components/study-plan/study-plan-list";
import { StudyPlan } from "@/types/study-plan";
import EmptyStudyPlan from "../_components/study-plan/empty-study-plan";
import CreateStudyPlanPopUp from "../_components/study-plan/create-study-plan-pop-up";
interface CourseDetailPageProps {
    params: Promise<{ courseId: number }>;
}

export default function CourseDetailPage({ params }: CourseDetailPageProps) {
    const resolvedParam = use(params);
    const router = useRouter();
    const { data: session } = useSession();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [course, setCourse] = useState<Course>();
    const [domains, setDomains] = useState<Domain[]>([]);
    const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([])
    const [isPending, setIsPending] = useState<boolean>(false);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    const fetchStudyPlan = async () => {
        try {
            const studyPlansData = await getStudyPlanByCourseId(resolvedParam.courseId, session?.user.token as string);
            setStudyPlans(studyPlansData);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load study plans.");
        }
    };

    const fetchCourse = async () => {
        try {
            const courseResponse = await getCourseById(session?.user.token as string, resolvedParam.courseId);
            const domainData = await getAllDomain();
            setCourse(courseResponse);
            setDomains(domainData);
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

        const patchResponse = await patchCourse(finalData, session?.user.token as string, resolvedParam.courseId);
        if (patchResponse.success === true) {
            toast.success(patchResponse.message);
        } else {
            toast.error(patchResponse.message);
        }
        setIsPending(false);
    };

    if (isLoading) return <Skeleton className="w-full h-screen" />;

    return (
        <div className="w-full space-y-6">
            <Button
                onClick={() => router.back()}
                variant="outline"
            >
                <CornerDownLeft className="w-4 h-4" />
                <span>Quay lại</span>
            </Button>
            <div className="text-4xl font-bold flex items-center">{course?.title} <PenLine size={28} /></div>
            <CourseUpdateForm course={course} domains={domains} onSubmit={handleSubmit} isPending={isPending} />
            <Separator />
            <div className="w-full flex justify-between">
                <div className="text-4xl font-bold flex items-center">Study plans in course</div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger className="flex items-center gap-2 py-2 px-4 bg-primary rounded-xl hover:bg-primary/90 text-white">
                        Create new study plan
                    </DialogTrigger>
                    <DialogContent width='400px'>
                        <CreateStudyPlanPopUp fetchStudyPlan={fetchStudyPlan} setIsDialogOpen={setIsDialogOpen} courseId={resolvedParam.courseId} />
                    </DialogContent>
                </Dialog>
            </div>
            {studyPlans ? <StudyPlanList StudyPlanList={studyPlans} /> : <EmptyStudyPlan />}

        </div>
    )
}
