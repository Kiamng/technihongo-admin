import { StudyPlanSchema } from "@/schema/study-plan";
import { StudyPlan } from "@/types/study-plan"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { LoaderCircle } from "lucide-react";
import { useTransition } from "react";
import { updateStudyPlan } from "@/app/api/study-plan/study-plan.api";
import { toast } from "sonner";

interface UpdateStudyPlanFormProps {
    studyPlan: StudyPlan,
    token: string
}
const UpdateStudyPlanForm = ({ studyPlan, token }: UpdateStudyPlanFormProps) => {
    const [isPending, startTransition] = useTransition();
    const form = useForm({
        resolver: zodResolver(StudyPlanSchema),
        defaultValues: {
            title: studyPlan.title || "",
            hoursPerDay: studyPlan.hoursPerDay || 0,
            description: studyPlan.description || "",
            isDefault: studyPlan.default
        },
    });
    const UpdateStudyPlanSubmit = async (values: z.infer<typeof StudyPlanSchema>) => {
        form.setValue("isDefault", studyPlan.default);
        startTransition(async () => {
            try {
                const response = await updateStudyPlan(token, values, studyPlan.studyPlanId);
                if (!response || response.success === false) {
                    toast.error("Failed to update study plan!");
                } else {
                    toast.success("Cập nhật kế hoạch học tập thành công!");
                }
            } catch (error) {
                console.error(error);
                toast.error("An error occurred while updating.");
            }
        })
    }
    return (
        < Form {...form}>
            <form onSubmit={form.handleSubmit(UpdateStudyPlanSubmit)} className="space-y-4 w-full">
                <div className="flex flex-col space-y-4">
                    <FormField control={form.control} name="title" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tên</FormLabel>
                            <FormControl>
                                <Input disabled={isPending || studyPlan.active} placeholder="Enter Title" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="hoursPerDay" render={({ field }) => (
                        <FormItem>
                            <div className="w-full flex flex-row space-x-4 items-center">
                                <FormLabel className="w-full">Thời gian học mỗi ngày (giờ):</FormLabel>
                                <FormControl>
                                    <Input disabled={isPending || studyPlan.active} type="text" placeholder="giờ" {...field} onChange={(e) => field.onChange(e.target.value)} />
                                </FormControl>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="description" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mô tả:</FormLabel>
                            <FormControl>
                                <Textarea disabled={isPending || studyPlan.active} {...field} rows={3} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>
                <div className="w-full flex justify-end">
                    <Button disabled={isPending || studyPlan.active} type="submit">
                        {isPending ? (
                            <>
                                <LoaderCircle className="animate-spin" /> Đang cập nhật ...
                            </>
                        ) : (
                            "Cập nhật"
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default UpdateStudyPlanForm
