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
import CourseUpdateForm from "../_components/update-course-component";
import { Button } from "@/components/ui/button";
import { CornerDownLeft, EllipsisVertical, Eye, PenLine, Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link";
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
    const [isPending, setIsPending] = useState<boolean>(false);

    useEffect(() => {
        if (!session?.user?.token) return;

        const fetchCourse = async () => {
            setIsLoading(true);
            try {
                const courseResponse = await getCourseById(session.user.token, resolvedParam.courseId);
                setCourse(courseResponse);
                setDomains(await getAllDomain());
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourse();
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
            <Separator />
            <CourseUpdateForm course={course} domains={domains} onSubmit={handleSubmit} isPending={isPending} />
            <Separator />
            <div className="text-4xl font-bold flex items-center">Study plans in course</div>
            <div className="text-sm font-bold">Default study plan :</div>
            <div className="default study plan w-full flex flex-row justify-between items-center p-5 rounded-[20px] shadow-xl">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-row gap-2 items-center">
                        <div className="text-sm font-bold">Study plan</div>
                        <div className="px-4 py-2 bg-[#56D071] w-fit text-[#56D071] rounded-xl text-xs font-semibold bg-opacity-10">ACTIVE</div>
                    </div>
                    <div className="text-xs font-medium">description</div>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger><EllipsisVertical /></DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <Link href={``} >
                            <DropdownMenuItem><Eye />View more</DropdownMenuItem>
                        </Link>

                        <DropdownMenuItem><Trash /> Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}
