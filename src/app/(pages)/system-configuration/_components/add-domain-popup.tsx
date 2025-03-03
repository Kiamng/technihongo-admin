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
import { addDomainSchema } from "@/schema/domain";
import { addDomain } from "@/app/api/system-configuration/system.api";

interface AddDomainPopupProps {
    onUpdate: () => Promise<void>;
}

const AddDomainPopup: React.FC<AddDomainPopupProps> = ({ onUpdate }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const form = useForm<z.infer<typeof addDomainSchema>>({
        resolver: zodResolver(addDomainSchema),
        defaultValues: {
            tag: "",
            name: "",
            description: "",
            parentDomainId: 0,
            isActive: false,
        },
    });

    const onSubmitForm = async (values: z.infer<typeof addDomainSchema>) => {
        try {
            setIsLoading(true);
            const response = await addDomain(values);

            if (!response || response.success === false) {
                toast.error("Failed to add new domain!");
            } else {
                toast.success("Added new domain successfully!");
                form.reset();
                await onUpdate();
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while adding the domain.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger className="flex items-center gap-2 py-2 px-4 bg-primary rounded-xl hover:bg-primary/90 text-white">
                <span className="flex items-center gap-2">
                    <UserCheck className="w-5 h-5" /> Add new Domain
                </span>
            </DialogTrigger>

            <DialogContent className="max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="text-center">Create Domain</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmitForm)} className="w-full space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Domain name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="tag"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tag</FormLabel>
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
                            name="parentDomainId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Parent Domain ID</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
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
                                        <LoaderCircle className="animate-spin" /> Creating ...
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

export default AddDomainPopup;
