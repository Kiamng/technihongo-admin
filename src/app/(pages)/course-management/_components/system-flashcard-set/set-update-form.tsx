import { updateSysFlashcardSet } from "@/app/api/system-flashcard-set/system-flashcard-set.api";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { SystemFlashcardSetSchema } from "@/schema/system-flashcard-set"

import { SystemFlashcardSet } from "@/types/system-flashcard-set"

import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderCircle } from "lucide-react";
import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner";
import { z } from "zod"

interface SetUpdateFormProps {
    flashcardSet: SystemFlashcardSet
    token: string
    isLoading: boolean
    flashcardSetId: number
}
const SetUpdateForm = ({ flashcardSet, token, isLoading, flashcardSetId }: SetUpdateFormProps) => {
    const [isPending, startTransition] = useTransition();

    const form = useForm({
        resolver: zodResolver(SystemFlashcardSetSchema),
        defaultValues: {
            title: flashcardSet.title ?? "",
            description: flashcardSet.description ?? "",
            difficultyLevel: flashcardSet.difficultyLevel ?? "",
            isPremium: flashcardSet.isPremium,
            isPublic: flashcardSet.isPublic
        },
    });

    const onSubmit = async (values: z.infer<typeof SystemFlashcardSetSchema>) => {
        if (flashcardSet.isPublic === true) {
            toast.error("You can not update a public Quiz!");
            return
        }
        startTransition(async () => {
            try {
                const response = await updateSysFlashcardSet(token, values, flashcardSetId)
                if (response.success === true) {
                    toast.success("Cập nhật thông tin flashcard thành công");
                } else {
                    toast.error(response.message);
                }
            } catch (error) {
                console.error("Error updating flashcard set:", error);
            }
        })

    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                <div className="w-1/2 flex flex-col space-y-6">
                    <FormField control={form.control} name="title" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tên flashcard:</FormLabel>
                            <FormControl>
                                <Input disabled={isPending || isLoading || flashcardSet.isPublic} placeholder="Tên flashcard" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="description" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mô tả:</FormLabel>
                            <FormControl>
                                <Textarea
                                    disabled={isPending || isLoading || flashcardSet.isPublic}
                                    placeholder="Mô tả" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="difficultyLevel" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Độ khó:</FormLabel>
                            <FormControl>
                                <Input
                                    disabled={true}
                                    placeholder="Độ khó" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <div className="w-full flex justify-end">
                        <Button disabled={isPending || flashcardSet.isPublic} type="submit">
                            {isPending
                                ? <><LoaderCircle className="animate-spin" /> Đang lưu ...</>
                                : "Lưu thay đổi"}
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    )
}

export default SetUpdateForm
