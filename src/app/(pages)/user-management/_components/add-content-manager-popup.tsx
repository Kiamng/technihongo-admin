import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
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
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { addContentManagerSchema } from "@/schema/user";
import { useState } from "react";
import { addContentManager } from "@/app/api/user/user.api";
import { useSession } from "next-auth/react";

interface AddContentManagerPopupProps {
    onOpen: boolean
    onClose: (value: boolean) => void;
    fetchData: (tab: string, searchTerm: string) => Promise<void>
}
const AddContentManagerPopup = ({ onOpen, onClose, fetchData }: AddContentManagerPopupProps) => {
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
            const response = await addContentManager(session?.user.token as string, values);
            if (response.success === false) {
                toast.error("Failed to add new content manager!!");
                fetchData("contentManager", "")
                onClose(false)
            } else {
                toast.success("Tạo mới content manager thành công!!");
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
        <Dialog open={onOpen} onOpenChange={onClose}>
            <DialogContent width="700px">
                <DialogHeader>
                    <DialogTitle>Thêm mới  content manager</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmitForm)} className="w-full space-y-10">
                        <div className=" grid grid-cols-2 gap-8">
                            <FormField
                                control={form.control}
                                name="userName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tên</FormLabel>
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
                                        <FormLabel>Mật khẩu</FormLabel>
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
                                        <FormLabel>Nhập lại mật khẩu</FormLabel>
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
                                {isLoading ? <><LoaderCircle className="animate-spin" /> Đang tạo ...</> : "Tạo"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default AddContentManagerPopup
