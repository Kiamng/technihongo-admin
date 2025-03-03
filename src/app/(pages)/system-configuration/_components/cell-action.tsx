import { deleteDomain } from "@/app/api/system-configuration/system.api";
import { Button } from "@/components/ui/button";
import { Domain } from "@/types/domain";
import { Pencil, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner"; // Hiển thị thông báo
import EditDomainPopup from "./update-domain";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface CellActionProps {
  data: Domain;
  onUpdate: () => void; // Gọi lại sau khi cập nhật / xóa
}

export const CellAction: React.FC<CellActionProps> = ({ data, onUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await deleteDomain(data.domainId);
      if (!response || response.success === false) {
        toast.error("Failed to delete domain!");
      } else {
        toast.success("Domain deleted successfully!");
        onUpdate(); // Gọi lại onUpdate sau khi xóa thành công
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
        {/* Nút Edit */}
        <Button onClick={() => setIsOpen(true)} className="bg-gray-900 text-white hover:bg-gray-700">
          <Pencil className="w-4 h-4" />
        </Button>

        {/* Nút Delete */}
        <Button 
          onClick={() => setConfirmOpen(true)} 
          className="bg-red-500 text-white hover:bg-red-700"
          disabled={isDeleting}
        >
          {isDeleting ? "..." : <Trash className="w-4 h-4" />}
        </Button>
      </div>

      {/* Modal Cập nhật Domain */}
      {isOpen && (
        <EditDomainPopup
          domain={data}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onUpdate={onUpdate} // Gọi lại khi cập nhật thành công
        />
      )}

      {/* Dialog Xác nhận Xóa */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <p>This action cannot be undone. This will permanently delete this domain.</p>
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
