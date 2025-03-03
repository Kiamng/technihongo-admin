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
import { Domain } from "@/types/domain";
import { updateDomain } from "@/app/api/system-configuration/system.api";
import { addDomainSchema } from "@/schema/domain";

interface EditDomainPopupProps {
  domain: Domain;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void; // 🔥 Gọi lại sau khi cập nhật thành công
}

const EditDomainPopup: React.FC<EditDomainPopupProps> = ({
  domain,
  isOpen,
  onClose,
  onUpdate,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof addDomainSchema>>({
    resolver: zodResolver(addDomainSchema),
    defaultValues: {
      name: "",
      tag: "",
      parentDomainId: undefined,
      description: "",
      isActive: false,
    },
  });

  // 🔥 Cập nhật form khi domain thay đổi
  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: domain.name,
        tag: domain.tag,
        parentDomainId: domain.parentDomainId ?? 0, // 🔥 Fix lỗi undefined
        description: domain.description ?? "",
        isActive: domain.isActive,
      });
    }
  }, [isOpen, domain, form]);

  const onSubmitForm = async (values: z.infer<typeof addDomainSchema>) => {
    try {
      setIsLoading(true);
      const response = await updateDomain(domain.domainId, values);

      if (!response || response.success === false) {
        toast.error("Failed to update domain!");
      } else {
        toast.success("Updated domain successfully!");
        onClose();
        onUpdate(); // 🔥 Gọi lại danh sách sau khi cập nhật
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating the domain.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-center">Update Domain</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitForm)} className="w-full space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Domain Name</FormLabel>
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
              name="parentDomainId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Domain ID</FormLabel>
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
              name="isActive"
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

            <div className="w-full flex justify-end">
              <Button disabled={isLoading} type="submit">
                {isLoading ? (
                  <>
                    <LoaderCircle className="animate-spin" /> Updating...
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

export default EditDomainPopup;
