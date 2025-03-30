import { updateQuiz } from "@/app/api/quiz/quiz.api";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { QuizSchema } from "@/schema/quiz";
import { Quiz } from "@/types/quiz";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { DifficultyLevel } from "@/types/difficulty-level";
import { z } from "zod";

interface QuizEditFormProps {
    quiz: Quiz
    token: string
    difficultyLevels: DifficultyLevel[]
    loading: boolean
}

const QuizEditForm = ({ quiz, token, difficultyLevels, loading }: QuizEditFormProps) => {
    const [isPending, startTransition] = useTransition();

    const form = useForm({
        resolver: zodResolver(QuizSchema),
        defaultValues: {
            title: quiz.title ?? "",
            description: quiz.description ?? "",
            difficultyLevelId: quiz.difficultyLevel.levelId ?? 0,
            passingScore: quiz.passingScore * 100,
        },
    });


    const onSubmit = async (values: z.infer<typeof QuizSchema>) => {
        if (quiz.public === true) {
            toast.error("You can not update a public Quiz!");
            return
        }
        startTransition(async () => {
            try {
                const response = await updateQuiz(token, quiz.quizId, values)
                if (response.success === true) {
                    toast.success("Saved learning resource successfully!!");
                } else {
                    toast.error(response.message);
                }
            } catch (error) {
                console.error("Error creating course:", error);
            }
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                <div className="w-1/2 flex flex-col space-y-6">
                    <FormField control={form.control} name="title" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title:</FormLabel>
                            <FormControl>
                                <Input disabled={isPending} placeholder="Enter Title" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="description" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description :</FormLabel>
                            <FormControl>
                                <Textarea
                                    disabled={isPending}
                                    placeholder="Enter description" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <div className="w-full grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="passingScore" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Passing percent(%):</FormLabel>
                                <FormControl>
                                    <Input
                                        className="w-full"
                                        disabled={isPending}
                                        placeholder="Enter passing percent" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="difficultyLevelId" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Level:</FormLabel>
                                <Select
                                    disabled={isPending || loading}
                                    value={field.value?.toString()}
                                    onValueChange={(value) => field.onChange(Number(value))}>
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder={loading ? "loading ..." : "Select a level"} />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {
                                            difficultyLevels?.map((level) => (
                                                <SelectItem key={level.levelId} value={level.levelId.toString()}>
                                                    {level.tag} : {level.name}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>

                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                    <div className="w-full flex justify-end">
                        <Button disabled={isPending} type="submit">
                            {isPending
                                ? <><LoaderCircle className="animate-spin" /> Saving ...</>
                                : "Save changes"}
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    )
}

export default QuizEditForm
