import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { LoaderCircle, UserCheck } from "lucide-react";
import { toast } from "sonner";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { addContentManagerSchema } from "@/schema/user";
import { useState } from "react";
import { addContentManager } from "@/app/api/user/user.api";
import { useSession } from "next-auth/react";

const AddContentManagerPopup = () => {
    const { data: session } = useSession();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const form = useForm<z.infer<typeof addContentManagerSchema>>({
        resolver: zodResolver(addContentManagerSchema),
        defaultValues: {
            userName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    const onSubmitForm = async (values: z.infer<typeof addContentManagerSchema>) => {
        try {
            setIsLoading(true)
            const response = await addContentManager(session?.user.token as string, session?.user.id as number, values);
            if (response.success === false) {
                toast.error("Failed to add new content manager!!");
            } else {
                toast.success("Add new content manager successfully!!");
            }
        }
        catch (error) {
            console.log(error);

        }
        finally {
            setIsLoading(false)
        }
    }
    return (
        <Dialog>
            <DialogTrigger className="flex items-center gap-2 py-2 px-4 bg-primary rounded-xl hover:bg-primary/90 text-white">
                <UserCheck className="w-5 h-5" /> Add new content manager</DialogTrigger>
            <DialogContent width="700px">
                <DialogHeader>
                    <DialogTitle>Add new content manager</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmitForm)} className="w-full space-y-10">
                        <div className=" grid grid-cols-2 gap-8">
                            <FormField
                                control={form.control}
                                name="userName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input disabled={isLoading}  {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input disabled={isLoading}  {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input disabled={isLoading} type="password"  {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm password</FormLabel>
                                        <FormControl>
                                            <Input disabled={isLoading} type="password"  {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="w-full flex justify-end">

                            <Button disabled={isLoading} type="submit">
                                {isLoading ? <><LoaderCircle className="animate-spin" /> Creating ...</> : "Create"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default AddContentManagerPopup
