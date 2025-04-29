import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface DeleteLessonAlertProps {
    lessonId: number
    disable: boolean
    onOpen: boolean
    onClose: (value: boolean) => void;
    onConfirmDelete: (lessonId: number) => void;
}
const DeleteLessonAlert = ({ lessonId, disable, onOpen, onClose, onConfirmDelete }: DeleteLessonAlertProps) => {
    return (
        <AlertDialog open={onOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Bạn đã chắc chắn chưa ?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Hành động này sẽ không thể hoàn tác và bài học này sẽ bị xóa vĩnh viễn!
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={disable}>Hủy</AlertDialogCancel>
                    <AlertDialogAction disabled={disable} onClick={() => onConfirmDelete(lessonId)}>Xác nhận</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteLessonAlert
