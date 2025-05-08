import { Button } from "@/components/ui/button";
import { LearningPath } from "@/types/learningPath";
import { Pencil, Trash } from "lucide-react";
import { useState } from "react";
import EditLearningPathPopup from "./update-learning-path";
import { deleteLearningPath } from "@/app/api/learning-path/learning-path.api";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";

interface CellActionProps {
  data: LearningPath;
  onUpdate: () => void; // Callback để refresh dữ liệu
}

// Định nghĩa interface phù hợp với API response
interface ApiResponse {
  success: boolean;
  message?: string;
  data: unknown;
}

export const CellAction: React.FC<CellActionProps> = ({ data, onUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { data: session } = useSession();

  const handleDelete = async () => {
    // Kiểm tra token
    if (data.public) {
      toast.error("Bạn không thể xóa 1 lộ trình học tập đang hoạt động");
      return;
    }
    if (!session?.user?.token) {
      toast.error("Authentication required. Please log in again.");
      setConfirmOpen(false);
      return;
    }
    try {
      setIsDeleting(true);
      // Sử dụng try-catch để bắt tất cả các lỗi nhưng không hiển thị lỗi HTTP
      try {
        const response = await deleteLearningPath(data.pathId, session.user.token);

        if (response && response.success === true) {
          toast.success("Learning path deleted successfully!");

          // Gọi callback để refresh dữ liệu
          onUpdate();
        } else {
          // Kiểm tra thông báo lỗi liên quan đến active learning path
          if (response?.message?.toLowerCase().includes('active') ||
            response?.message?.toLowerCase().includes('cannot delete')) {
            toast.error("Cannot delete an active learning path. Please deactivate it first.");
          } else {
            toast.error(response?.message || "Failed to delete learning path!");
          }
        }
      } catch (error) {
        // Bắt mọi lỗi từ API call nhưng xử lý nội bộ, không hiển thị lỗi HTTP
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<ApiResponse>;
          const errorMessage = axiosError.response?.data?.message || "Failed to delete learning path";
          console.error("Delete error details:", {
            status: axiosError.response?.status,
            data: axiosError.response?.data
          });

          // Kiểm tra nếu là lỗi active learning path
          if (errorMessage.toLowerCase().includes('active') ||
            errorMessage.toLowerCase().includes('cannot delete')) {
            toast.error("Cannot delete an active learning path. Please deactivate it first.");
          } else {
            toast.error("Failed to delete learning path. Please try again later.");
          }
        } else {
          toast.error("An error occurred. Please try again later.");
        }
      }

      // Luôn đóng dialog bất kể kết quả
      setConfirmOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="flex gap-2">
        {/* Edit Button */}
        <Button
          size="icon"
          onClick={() => setIsOpen(true)}
        >
          <Pencil className="w-4 h-4" />
        </Button>

        {/* Delete Button */}
        <Button
          size="icon"
          onClick={() => setConfirmOpen(true)}
          variant={"destructive"}
          disabled={isDeleting || data.public}
        >
          {isDeleting ? "..." : <Trash className="w-4 h-4" />}
        </Button>
      </div>

      {/* Learning Path Update Modal */}
      {isOpen && (
        <EditLearningPathPopup
          learningPath={data}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onUpdate={onUpdate} // Truyền callback để refresh dữ liệu
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={confirmOpen}
        onOpenChange={(open) => {
          if (!isDeleting) {
            setConfirmOpen(open);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn đã chắc chắn?</AlertDialogTitle>
            <p>Hành động này không thể hoàn tác và lộ trình học tập này sẽ bị xóa vĩnh viễn</p>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};