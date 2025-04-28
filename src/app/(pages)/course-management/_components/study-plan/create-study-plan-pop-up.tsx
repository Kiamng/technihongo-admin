import { createStudyPlan } from "@/app/api/study-plan/study-plan.api";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { StudyPlanSchema } from "@/schema/study-plan";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";

interface CreateStudyPlanPopUpProps {
    token: string
    courseId: number,
    setIsDialogOpen: Dispatch<SetStateAction<boolean>>,
    fetchStudyPlan: () => Promise<void>
}

const CreateStudyPlanPopUp = ({ courseId, setIsDialogOpen, fetchStudyPlan, token }: CreateStudyPlanPopUpProps) => {
    const [isPending, setIsPending] = useState<boolean>(false)
    const form = useForm({
        resolver: zodResolver(StudyPlanSchema),
        defaultValues: {
            title: "",
            description: "",
            hoursPerDay: 0,
        },
    });

    const onSubmit = async (values: z.infer<typeof StudyPlanSchema>) => {
        try {
            setIsPending(true);
            const response = await createStudyPlan(values, courseId, token)
            if (response.success === false) {
                toast.error("Failed to create new study plan!!");
            } else {
                toast.success("Tạo mới kế hoạch thành công!!");
                setIsDialogOpen(false);
                fetchStudyPlan();
                form.reset();
            }
            console.log(response);
        }
        catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                toast.error(error?.response.data.message);
            } else {
                toast.error('An error occurred. Please try again later.');
            }
        } finally {
            setIsPending(false);
        }
    }
    return (
        <>
            <DialogHeader>
                <DialogTitle>Tạo mới kế hoạch học tập</DialogTitle>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
                    <FormField control={form.control} name="title" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tên kế hoạch học tập:</FormLabel>
                            <FormControl>
                                <Input placeholder="Tên kế hoạch học tập" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="hoursPerDay" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Số giờ học mỗi ngày:</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="Số giờ học mỗi ngày" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="description" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mô tả:</FormLabel>
                            <FormControl>
                                <Textarea {...field} rows={3} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <div className="w-full flex justify-end">
                        <Button disabled={isPending} type="submit">
                            {isPending ? (
                                <>
                                    <LoaderCircle className="animate-spin" /> Đang tạo ...
                                </>
                            ) : (
                                "Tạo"
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    )
}

export default CreateStudyPlanPopUp
