import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { LearningPath } from "@/types/learningPath";
import { updateLearningPath } from "@/app/api/learning-path/learning-path.api";
import { CreateLearningPathSchema } from "@/schema/learning-path";
import { useRouter } from "next/navigation";

interface EditLearningPathPopupProps {
  learningPath: LearningPath;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void; // 🔥 Gọi lại sau khi cập nhật thành công
}

const EditLearningPathPopup: React.FC<EditLearningPathPopupProps> = ({
  learningPath,
  isOpen,
  onClose,
  onUpdate,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  // Điều chỉnh schema để không yêu cầu người dùng phải thay đổi isPublic
  const EditLearningPathSchema = CreateLearningPathSchema;

  const form = useForm<z.infer<typeof EditLearningPathSchema>>({
    resolver: zodResolver(EditLearningPathSchema),
    defaultValues: {
      title: "",
      description: "",
      domainId: undefined,
      isPublic: false,
    },
  });

  // 🔥 Cập nhật form khi learning path thay đổi
  useEffect(() => {
    if (isOpen && learningPath) {
      form.reset({
        title: learningPath.title,
        description: learningPath.description ?? "",
        domainId: learningPath.domain?.domainId,
        isPublic: learningPath.public, // Đảm bảo là boolean
      });
    }
  }, [isOpen, learningPath, form]);

   
  const onSubmitForm = async (values: z.infer<typeof EditLearningPathSchema>) => {
    try {
      setIsLoading(true);
      
      const updateData = {
        title: values.title,
        description: values.description,
        domainId: Number(values.domainId),
        isPublic: values.isPublic,
      };
      
      console.log('Updating with data:', updateData);
      
      const response = await updateLearningPath(learningPath.pathId, updateData);

      if (!response || response.success === false) {
        toast.error("Failed to update learning path!");
      } else {
        toast.success("Updated learning path successfully!");
        onClose();
        onUpdate(); // Gọi callback update từ component cha
        router.refresh(); // Refresh trang để lấy dữ liệu mới nhất
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("An error occurred while updating the learning path.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-center">Update Learning Path</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitForm)} className="w-full space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Learning Path Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="domainId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Domain ID</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(Number(e.target.value) || undefined)}
                    />
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
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormLabel>Active</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="w-full flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button disabled={isLoading} type="submit">
                {isLoading ? (
                  <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> Updating...
                  </>
                ) : (
                  "Update"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditLearningPathPopup;