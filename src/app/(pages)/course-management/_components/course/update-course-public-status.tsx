import { Dispatch, SetStateAction, useTransition } from "react"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Course } from "@/types/course";
import { updateCoursePublicStatus } from "@/app/api/course/course.api";

interface SetPublicStatusUpdateProps {
    course: Course,
    token: string,
    setCourse: Dispatch<SetStateAction<Course | undefined>>
}

const CoursePublicStatusUpdate = ({ course, token, setCourse }: SetPublicStatusUpdateProps) => {
    const [isUSPending, startUSTransition] = useTransition();

    const handleChangePublicStatus = async (publicStatus: string) => {
        if (!course) {
            return;
        }
        startUSTransition(async () => {
            try {
                const response = await updateCoursePublicStatus(
                    token,
                    course.courseId,
                    publicStatus === 'true',
                );

                if (response.success) {
                    toast.success("Cập nhật trạng thái thành công");

                    setCourse((prevSet) => prevSet ? { ...prevSet, publicStatus: publicStatus === 'true' } : prevSet);
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                toast.error("Cập nhật trạng thái thất bại", error.response.data.message);
            }
        })
    };

    return (
        <div>
            <Select
                disabled={isUSPending}
                value={course.publicStatus.toString()}
                onValueChange={(value) => handleChangePublicStatus(value)}>
                <SelectTrigger
                    className={course.publicStatus
                        ? "bg-[#56D071] text-[#56D071] bg-opacity-10"
                        : "bg-[#FD5673] text-[#FD5673] bg-opacity-10"}>
                    <SelectValue
                        placeholder="Public" />
                </SelectTrigger>
                <SelectContent >
                    <SelectItem className="bg-[#56D071] text-[#56D071] bg-opacity-10" value="true">Đang hoạt động</SelectItem>
                    <SelectItem className="bg-[#FD5673] text-[#FD5673] bg-opacity-10" value="false">Không hoạt động</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}

export default CoursePublicStatusUpdate
