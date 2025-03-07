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

interface CreateStudyPlanPopUpProps {
    courseId: number,
    setIsDialogOpen: Dispatch<SetStateAction<boolean>>,
    fetchStudyPlan: () => Promise<void>
}

const CreateStudyPlanPopUp = ({ courseId, setIsDialogOpen, fetchStudyPlan }: CreateStudyPlanPopUpProps) => {
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
            const response = await createStudyPlan(values, courseId)
            if (response.success === false) {
                toast.error("Failed to create new course!!");
            } else {
                toast.success("Create new course successfully!!");
                setIsDialogOpen(false);
                fetchStudyPlan();
                form.reset();
            }
            console.log(response);
        }
        catch (error) {
            console.log(error);
        } finally {
            setIsPending(false);
        }
    }
    return (
        <>
            <DialogHeader>
                <DialogTitle>Create new study plan</DialogTitle>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
                    <FormField control={form.control} name="title" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title:</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter Title" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="hoursPerDay" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Hours per day:</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="Enter hours per day" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="description" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description:</FormLabel>
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
                                    <LoaderCircle className="animate-spin" /> Creating ...
                                </>
                            ) : (
                                "Create"
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    )
}

export default CreateStudyPlanPopUp
