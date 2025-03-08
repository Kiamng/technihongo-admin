import { StudyPlanSchema } from "@/schema/study-plan";
import { StudyPlan } from "@/types/study-plan"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { LoaderCircle } from "lucide-react";
import { useTransition } from "react";
import { updateStudyPlan } from "@/app/api/study-plan/study-plan.api";
import { toast } from "sonner";

interface UpdateStudyPlanFormProps {
    studyPlan: StudyPlan,
}
const UpdateStudyPlanForm = ({ studyPlan }: UpdateStudyPlanFormProps) => {
    const [isPending, startTransition] = useTransition();
    const form = useForm({
        resolver: zodResolver(StudyPlanSchema),
        defaultValues: {
            title: studyPlan.title || "",
            hoursPerDay: studyPlan.hoursPerDay || 0,
            description: studyPlan.description || "",
            isActive: studyPlan.active || false,
            isDefault: studyPlan.default
        },
    });
    const UpdateStudyPlanSubmit = async (values: z.infer<typeof StudyPlanSchema>) => {
        form.setValue("isDefault", studyPlan.default);
        startTransition(async () => {
            try {
                const response = await updateStudyPlan(values, studyPlan.studyPlanId);
                if (!response || response.success === false) {
                    toast.error("Failed to update study plan!");
                } else {
                    toast.success("Study plan updated successfully!");
                }
            } catch (error) {
                console.error(error);
                toast.error("An error occurred while deleting.");
            }
        })
    }
    return (
        < Form {...form}>
            <form onSubmit={form.handleSubmit(UpdateStudyPlanSubmit)} className="space-y-4 w-full">
                <div className="flex flex-col space-y-4">
                    <FormField control={form.control} name="title" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter Title" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <div className="w-full grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="hoursPerDay" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Hours per day:</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="Enter hours per day" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="isActive" render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Active status</FormLabel>
                                <Select value={field.value?.toString()} onValueChange={(value) => field.onChange(value === "true")}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Public" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent >
                                        <SelectItem value="true"><div className="px-4 py-2 bg-[#56D071] w-fit text-[#56D071] rounded-xl bg-opacity-10">ACTIVE</div></SelectItem>
                                        <SelectItem value="false"><div className="px-4 py-2 bg-[#FD5673] w-fit text-[#FD5673] rounded-xl bg-opacity-10">INACTIVE</div></SelectItem>
                                    </SelectContent>
                                </Select>

                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                    <FormField control={form.control} name="description" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description:</FormLabel>
                            <FormControl>
                                <Textarea {...field} rows={3} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>
                <div className="w-full flex justify-end">
                    <Button disabled={isPending} type="submit">
                        {isPending ? (
                            <>
                                <LoaderCircle className="animate-spin" /> Updating ...
                            </>
                        ) : (
                            "Update"
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default UpdateStudyPlanForm
