/* AddLearningPathPopup.tsx */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { LoaderCircle, Plus } from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { CreateLearningPathSchema } from "@/schema/learning-path";
import { addLearningPath, getParentDomains, Domain } from "@/app/api/learning-path/learning-path.api";
import { useSession } from "next-auth/react";

interface AddLearningPathPopupProps {
  onUpdate: () => void;
}

const AddLearningPathPopup: React.FC<AddLearningPathPopupProps> = ({ onUpdate }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [isFetchingDomains, setIsFetchingDomains] = useState(false);
  const { data: session } = useSession();

  const form = useForm<z.infer<typeof CreateLearningPathSchema>>({
    resolver: zodResolver(CreateLearningPathSchema),
    defaultValues: {
      title: "",
      description: "",
      domainId: undefined,
      isPublic: false,
    },
  });

  useEffect(() => {
    const fetchDomains = async () => {
      if (!session?.user?.token || !isOpen) return;

      setIsFetchingDomains(true);
      try {
        const parentDomains = await getParentDomains(session.user.token);
        setDomains(parentDomains);
      } catch (error) {
        console.error("Error fetching domains:", error);
        toast.error("Failed to load parent domains");
        setDomains([]);
      } finally {
        setIsFetchingDomains(false);
      }
    };

    fetchDomains();
  }, [isOpen, session?.user.token]);

  const onSubmitForm = async (values: z.infer<typeof CreateLearningPathSchema>) => {
    if (!session?.user?.token) {
      toast.error("Authentication required. Please log in again.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await addLearningPath(values, session.user.token);

      if (!response || response.success === false) {
        toast.error(response?.message || "Failed to create learning path!");
      } else {
        toast.success("Created learning path successfully!");
        form.reset();
        setIsOpen(false);
        onUpdate();
      }
    } catch (error: any) {
      console.error("Create error:", error);
      toast.error(error?.response?.data?.message || error?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex gap-1">
          <Plus className="h-4 w-4" /> Thêm mới
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Thêm mới một lộ trình học tập</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitForm)} className="w-full space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Nhập tên của lộ trình học tập" {...field} />
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
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Thêm một mô tả"
                      {...field}
                      rows={3}
                    />
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
                  <FormLabel>Chọn lĩnh vực</FormLabel>
                  <FormControl>
                    <div className="max-h-[200px] overflow-y-auto border rounded-md p-2">
                      {isFetchingDomains ? (
                        <div className="flex justify-center items-center py-4">
                          <LoaderCircle className="h-6 w-6 animate-spin" />
                        </div>
                      ) : domains.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4">
                          No parent domains available
                        </p>
                      ) : (
                        domains.map((domain) => (
                          <div key={domain.domainId} className="flex items-center space-x-2 py-1">
                            <Checkbox
                              id={`domain-${domain.domainId}`}
                              checked={field.value === domain.domainId}
                              onCheckedChange={(checked) => {
                                field.onChange(checked ? domain.domainId : undefined);
                              }}
                            />
                            <label
                              htmlFor={`domain-${domain.domainId}`}
                              className="text-sm cursor-pointer"
                            >
                              {domain.name} (ID: {domain.domainId})
                            </label>
                          </div>
                        ))
                      )}
                    </div>
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
                  <FormLabel>Trạng thái</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="w-full flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button disabled={isLoading || isFetchingDomains} type="submit">
                {isLoading ? (
                  <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> Creating...
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

export default AddLearningPathPopup;