import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoaderCircle, UserCheck } from "lucide-react";
import { toast } from "sonner";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { CreateLearningPathSchema } from "@/schema/learning-path";
import { addLearningPath } from "@/app/api/learning-path/learning-path.api";
import { useSession } from "next-auth/react";

const AddLearningPathPopup = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { data: session } = useSession();
    const form = useForm<z.infer<typeof CreateLearningPathSchema>>({
        resolver: zodResolver(CreateLearningPathSchema),
        defaultValues: {
            title: "",
            description: "",
            domainId: 1, // Changed default to 1 (positive value)
            isPublic: false,
        },
    });

    const onSubmitForm = async (values: z.infer<typeof CreateLearningPathSchema>) => {
        try {
            setIsLoading(true);
            const response = await addLearningPath(values,session?.user.token as string);

            if (!response || response.success === false) {
                toast.error("Failed to add learning path!");
            } else {
                toast.success("Added new learning path successfully!");
                form.reset();
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while adding the learning path.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger className="flex items-center gap-2 py-2 px-4 bg-primary rounded-xl hover:bg-primary/90 text-white">
                <span className="flex items-center gap-2">
                    <UserCheck className="w-5 h-5" /> Add new learning path
                </span>
            </DialogTrigger>

            <DialogContent className="max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="text-center">Create Learning Path</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmitForm)} className="w-full space-y-6">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} rows={3} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <FormField
                            control={form.control}
                            name="domainId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Domain ID</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min="0" // Added min attribute to prevent negative values
                                            {...field}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="w-full flex justify-end">
                            <Button disabled={isLoading} type="submit">
                                {isLoading ? (
                                    <>
                                        <LoaderCircle className="animate-spin mr-2" /> Creating ...
                                    </>
                                ) : (
                                    "Create"
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default AddLearningPathPopup;