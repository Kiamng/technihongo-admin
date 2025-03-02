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

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { addSubscriptionPlanSchema } from "@/schema/subscriptionplan";
import { addSubscriptionPlan } from "@/app/api/subscription/subscription.api";
import { Textarea } from "@/components/ui/textarea";

const AddSubscriptionPlanPopup = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const form = useForm<z.infer<typeof addSubscriptionPlanSchema>>({
        resolver: zodResolver(addSubscriptionPlanSchema),
        defaultValues: {
            name: "",
            price: 0,
            benefits: "",
            durationDays: 0,
            active: false,
        },
    });

    const onSubmitForm = async (values: z.infer<typeof addSubscriptionPlanSchema>) => {
        try {
            setIsLoading(true);
            const response = await addSubscriptionPlan(values);

            if (!response || response.success === false) {
                toast.error("Failed to add new subscription plan!");
            } else {
                toast.success("Added new subscription plan successfully!");
                form.reset(); 
                
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while adding the subscription plan.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger className="flex items-center gap-2 py-2 px-4 bg-primary rounded-xl hover:bg-primary/90 text-white">
                <span className="flex items-center gap-2">
                    <UserCheck className="w-5 h-5" /> Add new Subscription Plan
                </span>
            </DialogTrigger>

            <DialogContent className="max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="text-center">Create subscription plan</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmitForm)} className="w-full space-y-6">
                        {/* Subscription Name */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Subscription name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Benefit */}
                        <FormField
                            control={form.control}
                            name="benefits"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Benefit</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} rows={3} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Price & Duration */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price</FormLabel>
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
                            <FormField
                                control={form.control}
                                name="durationDays"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Duration days</FormLabel>
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
                        </div>

                        {/* Submit Button */}
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


export default AddSubscriptionPlanPopup;
