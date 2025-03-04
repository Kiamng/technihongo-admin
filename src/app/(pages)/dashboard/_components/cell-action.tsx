import { Button } from "@/components/ui/button";
import { SubscriptionPlan } from "@/types/subscription";
import { Edit, Trash } from "lucide-react";
import { useState } from "react";
import EditSubscriptionPlanPopup from "./update-subscription-plan";
import { deleteSubscriptionPlan } from "@/app/api/subscription/subscription.api";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";


interface CellActionProps {
  data: SubscriptionPlan;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await deleteSubscriptionPlan(data.subPlanId);
      if (!response || response.success === false) {
        toast.error("Failed to delete subscription plan!");
      } else {
        toast.success("Subscription plan deleted successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while deleting.");
    } finally {
      setIsDeleting(false);
      setConfirmOpen(false);
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <Button onClick={() => setIsOpen(true)} >
          <Edit className="w-4 h-4" /> Update
        </Button>

        <Button onClick={() => setConfirmOpen(true)} className="bg-red-500 hover:bg-red-600 text-white">
          <Trash className="w-4 h-4" /> Delete
        </Button>
      </div>

      {/* Modal Update Subscription Plan */}
      {isOpen && (
        <EditSubscriptionPlanPopup
          subscriptionPlan={data}
          isOpen={isOpen}
          onClose={handleClose}
        />
      )}

      {/* Dialog Xác nhận Xóa */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <p>This action cannot be undone. This will permanently delete this subscription plan.</p>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
