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

interface CellActionProps {
  data: LearningPath;
  onUpdate: () => void;
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

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      
      // Sử dụng try-catch để bắt tất cả các lỗi nhưng không hiển thị lỗi HTTP
      try {
        const response = await deleteLearningPath(data.pathId);
        
        if (response && response.success === true) {
          toast.success("Learning path deleted successfully!");
          onUpdate();
        } else {
          // Kiểm tra thông báo lỗi liên quan đến active learning path
          if (response?.message?.toLowerCase().includes('active') || 
              response?.message?.toLowerCase().includes('cannot delete')) {
            toast.error("Không thể xóa học trình đang hoạt động. Vui lòng hủy kích hoạt trước.");
          } else {
            toast.error(response?.message || "Failed to delete learning path!");
          }
        }
      } catch (error) {
        // Bắt mọi lỗi từ API call nhưng xử lý nội bộ, không hiển thị lỗi HTTP
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<ApiResponse>;
          const errorMessage = axiosError.response?.data?.message || "Failed to delete learning path";
          
          // Kiểm tra nếu là lỗi active learning path
          if (errorMessage.toLowerCase().includes('active') || 
              errorMessage.toLowerCase().includes('cannot delete')) {
            toast.error("Không thể xóa học trình đang hoạt động. Vui lòng hủy kích hoạt trước.");
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
          onClick={() => setIsOpen(true)} 
          className="bg-gray-900 text-white hover:bg-gray-700"
        >
          <Pencil className="w-4 h-4" />
        </Button>

        {/* Delete Button */}
        <Button 
          onClick={() => setConfirmOpen(true)} 
          className="bg-red-500 text-white hover:bg-red-700"
          disabled={isDeleting}
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
          onUpdate={onUpdate}
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
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <p>This action cannot be undone. This will permanently delete this learning path.</p>
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