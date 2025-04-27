import { deleteDomain } from "@/app/api/system-configuration/system.api";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogFooter,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import { Domain } from "@/types/domain";

import { useTransition } from "react";
import { toast } from "sonner";

interface DeleteAlertProps {
    domain: Domain;
    fetchParentDomains?: () => Promise<void>;
    fetchChildrenDomains?: (parentId: number) => Promise<void>;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    token: string
}

const DeleteAlert = ({ domain, fetchParentDomains, fetchChildrenDomains, open, onOpenChange, token }: DeleteAlertProps) => {
    const [isPending, startTransition] = useTransition();

    const handleDelete = async () => {
        startTransition(async () => {
            try {
                const response = await deleteDomain(token, domain.domainId);
                if (response?.success) {
                    toast.success("Domain deleted successfully!");
                    onOpenChange(false);
                    if (domain.parentDomainId === null && fetchParentDomains) {
                        await fetchParentDomains();
                    } else if (domain.parentDomainId && fetchChildrenDomains) {
                        await fetchChildrenDomains(domain.parentDomainId);
                    }
                } else {
                    toast.error(response.message);
                }
            } catch (error) {
                console.error(error);
                toast.error("An error occurred while deleting the domain.");
            }
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Bạn có chắc chắn không?</AlertDialogTitle>
                    <p>Hành động này sẽ không thể hoàn tác và vĩnh viễn xóa lĩnh vực này</p>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                    <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
                        {isPending ? "Deleting..." : "Delete"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteAlert;
