import {
    DialogHeader,
    DialogTitle,
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
import { Textarea } from "@/components/ui/textarea";

import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Dispatch, SetStateAction, useTransition } from "react";

import { addDomainSchema } from "@/schema/domain";

import { addDomain, updateDomain } from "@/app/api/system-configuration/system.api";

import { Domain } from "@/types/domain";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DomainFormPopupProps {
    initialData: Domain | null;
    setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
    parentDomainList?: Domain[];
    fetchParentDomains?: () => Promise<void>
    parentId?: number
    fetchChildrenDomains?: (parentId: number) => Promise<void>
    token: string
}

const DomainFormPopup: React.FC<DomainFormPopupProps> = ({ initialData, setIsDialogOpen, parentDomainList, fetchParentDomains, parentId, fetchChildrenDomains, token }) => {
    const [isPending, startTransition] = useTransition();

    const getDefaultParentDomainId = () => {
        if (initialData) {
            return initialData.parentDomainId;
        } else if (parentId) {
            return parentId;
        }
        return null;
    };

    const form = useForm<z.infer<typeof addDomainSchema>>({
        resolver: zodResolver(addDomainSchema),
        defaultValues: {
            tag: initialData?.tag ?? "",
            name: initialData?.name ?? "",
            description: initialData?.description ?? "",
            parentDomainId: getDefaultParentDomainId(),
            isActive: initialData?.isActive ?? false,
        },
    });

    const onSubmitForm = async (values: z.infer<typeof addDomainSchema>) => {
        startTransition(async () => {
            try {
                let response;
                if (initialData) {
                    response = await updateDomain(token, initialData.domainId, values);
                } else {
                    response = await addDomain(token, values)
                }
                if (!response || response.success === false) {
                    toast.error(`Failed to ${initialData ? "update" : "create new"} domain`);
                } else {
                    if (parentId && fetchChildrenDomains) {
                        fetchChildrenDomains(parentId)
                    }
                    toast.success(`${initialData ? "Update" : "Create new"} domain successfully!`);
                    if (fetchParentDomains) {
                        fetchParentDomains()
                    }
                    setIsDialogOpen(false);
                }
            } catch (error) {
                console.error(error);
                toast.error("An error occurred while adding the domain.");
            }
        })
    };

    return (
        <>
            <DialogHeader>
                <DialogTitle className="text-center">{initialData ? initialData.name : "Create new domain"}</DialogTitle>
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
                    {parentId &&
                        <FormField control={form.control} name="parentDomainId" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Parent domain</FormLabel>
                                <Select
                                    disabled={isPending || !!initialData || !!parentId}
                                    value={field.value ? field.value.toString() : ""}
                                    onValueChange={(value) => {
                                        field.onChange(value === "None" ? null : Number(value));
                                    }}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select parent domain" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="None">
                                            None
                                        </SelectItem>
                                        {
                                            parentDomainList?.map((parent) => (
                                                <SelectItem key={parent.domainId} value={parent.domainId.toString()}>
                                                    {parent.tag}. {parent.name}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>

                                <FormMessage />
                            </FormItem>
                        )} />
                    }
                    <div className="w-full flex justify-end">
                        <Button disabled={isPending} type="submit">
                            {isPending ? (
                                <>
                                    <LoaderCircle className="animate-spin" /> {initialData ? "Updating ..." : "Creating ..."}
                                </>
                            ) : (
                                initialData ? "Update" : "Create"
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    );
};

export default DomainFormPopup;
