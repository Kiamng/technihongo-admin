import { createLesson, updateLesson, updateLessonOrder } from "@/app/api/lesson/lesson.api";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoaderCircle } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

interface CreateLessonForm {
    title: string,
    order: number
}

interface CreateLessonPopupProps {
    studyPlanId: number | null,
    fetchLessons: () => Promise<void>,
    setIsDialogOpen: Dispatch<SetStateAction<boolean>>,
    initialData: string | null,
    lessonId: number | null,
    initialOrder: number | null,
    token: string
}

const LessonPopupForm = ({ studyPlanId, fetchLessons, setIsDialogOpen, initialData, lessonId, initialOrder, token }: CreateLessonPopupProps) => {
    const [isPending, startTransition] = useTransition();
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<CreateLessonForm>();

    useEffect(() => {
        if (initialData) {
            setValue("title", initialData);
        }
        if (initialOrder !== null) {
            setValue("order", initialOrder);
        }
    }, [initialData, initialOrder, setValue]);

    const onSubmit: SubmitHandler<CreateLessonForm> = async (data) => {
        startTransition(async () => {
            try {
                let didChange = false;

                if (initialData && data.title !== initialData) {
                    const response = await updateLesson(token, data.title, lessonId!);
                    if (!response || response.success === false) {
                        toast.error("Failed to update lesson!");
                    } else {
                        didChange = true;
                        toast.success("Lesson title updated successfully!");
                    }
                } else if (!initialData) {
                    const response = await createLesson(token, data.title, studyPlanId!);
                    if (!response || response.success === false) {
                        toast.error("Failed to create lesson!");
                        return;
                    } else {
                        didChange = true;
                        toast.success("Lesson created successfully!");
                    }
                }

                if (data.order !== initialOrder && lessonId) {
                    const orderResponse = await updateLessonOrder(token, studyPlanId!, lessonId, data.order);
                    if (!orderResponse || orderResponse.success === false) {
                        toast.error("Failed to update lesson order!");
                    } else {
                        didChange = true;
                        toast.success("Lesson order updated successfully!");
                    }
                }

                if (didChange) {
                    await fetchLessons();
                    setIsDialogOpen(false);
                }

            } catch (error) {
                console.error(error);
                toast.error(`An error occurred while ${initialData ? "updating" : "creating"} the lesson.`);
            }
        });
    };

    return (
        <>
            <DialogHeader>
                <DialogTitle>{initialData ? "Cập nhật thông tin" : "Thêm mới"} bài học</DialogTitle>
            </DialogHeader>
            <form
                className="w-full flex flex-col gap-y-5"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="flex flex-col space-y-4">
                    <Label>Tên:</Label>
                    <Input
                        className=""
                        disabled={isPending}
                        id="title"
                        placeholder="Nhập tên bài học"
                        type="text"
                        {...register("title", {
                            required: "Tên bài học không được để trống",
                        })}
                    />
                    {errors.title && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.title.message}
                        </p>
                    )}
                </div>
                {initialOrder &&
                    <div className="flex flex-col space-y-4">
                        <Label>Order:</Label>
                        <Input
                            className=""
                            disabled={isPending}
                            id="title"
                            placeholder="Nhập thứ tự mới"
                            type="text"
                            {...register("order", {
                                required: "Thứ tự không được để trống",
                            })}
                        />
                        {errors.title && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.title.message}
                            </p>
                        )}
                    </div>
                }

                <div className="w-full flex justify-end">
                    <Button disabled={isPending} type="submit">
                        {isPending ? (
                            <>
                                <LoaderCircle className="animate-spin" /> {initialData ? "Đang cập nhật ..." : "Đang thêm ..."}
                            </>
                        ) : (
                            initialData ? "Cập nhật" : "Thêm"
                        )}
                    </Button>
                </div>
            </form>
        </>
    )
}

export default LessonPopupForm
