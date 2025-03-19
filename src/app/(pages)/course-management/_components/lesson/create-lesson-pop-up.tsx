import { createLesson, updateLesson } from "@/app/api/lesson/lesson.api";
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
}

interface CreateLessonPopupProps {
    studyPlanId: number | null,
    fetchLessons: () => Promise<void>,
    setIsDialogOpen: Dispatch<SetStateAction<boolean>>,
    initialData: string | null,
    lessonId: number | null,
}

const LessonPopupForm = ({ studyPlanId, fetchLessons, setIsDialogOpen, initialData, lessonId }: CreateLessonPopupProps) => {
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
    }, [initialData, setValue]);

    const onSubmit: SubmitHandler<CreateLessonForm> = async (data) => {
        startTransition(async () => {
            try {
                let response;
                if (initialData) {
                    // Nếu có initialData, gọi API update
                    response = await updateLesson(data.title, lessonId!);
                } else {
                    // Nếu không có, gọi API create
                    response = await createLesson(data.title, studyPlanId!);
                }

                if (!response || response.success === false) {
                    toast.error(`Failed to ${initialData ? "update" : "create"} lesson!`);
                } else {
                    fetchLessons();
                    toast.success(`Lesson ${initialData ? "updated" : "created"} successfully!`);
                    setIsDialogOpen(false);
                }
            } catch (error) {
                console.error(error);
                toast.error(`An error occurred while ${initialData ? "updating" : "creating"}.`);
            }
        });
    };
    return (
        <>
            <DialogHeader>
                <DialogTitle>{initialData ? "Update" : "Create new"} lesson</DialogTitle>
            </DialogHeader>
            <form
                className="w-full flex flex-col gap-y-5"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="flex flex-col space-y-4">
                    <Label>Title:</Label>
                    <Input
                        className=""
                        disabled={isPending}
                        id="title"
                        placeholder="Enter title here"
                        type="text"
                        {...register("title", {
                            required: "Title is required",
                        })}
                    />
                    {errors.title && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.title.message}
                        </p>
                    )}
                </div>

                <div className="w-full flex justify-end">
                    <Button disabled={isPending} type="submit">
                        {isPending ? (
                            <>
                                <LoaderCircle className="animate-spin" /> {initialData ? "Updating ..." : "Creating ..."}
                            </>
                        ) : (
                            initialData ? "Update" : "Create"
                        )}
                    </Button>
                </div>
            </form>
        </>
    )
}

export default LessonPopupForm
