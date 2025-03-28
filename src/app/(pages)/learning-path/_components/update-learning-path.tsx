/* EditLearningPathPopup.tsx */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { LearningPath } from "@/types/learningPath";
import { updateLearningPath, getParentDomains, Domain } from "@/app/api/learning-path/learning-path.api";
import { CreateLearningPathSchema } from "@/schema/learning-path";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";

interface EditLearningPathPopupProps {
  learningPath: LearningPath;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const EditLearningPathPopup: React.FC<EditLearningPathPopupProps> = ({
  learningPath,
  isOpen,
  onClose,
  onUpdate,
}) => {
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
    if (isOpen && learningPath) {
      const isPublicValue = learningPath.public === true ? true : false;
      form.reset({
        title: learningPath.title || "",
        description: learningPath.description || "",
        domainId: learningPath.domain?.domainId,
        isPublic: isPublicValue,
      });
    }
  }, [isOpen, learningPath, form]);

  useEffect(() => {
    const fetchDomains = async () => {
      if (!session?.user?.token || !isOpen) return;

      setIsFetchingDomains(true);
      try {
        const parentDomains = await getParentDomains(session.user.token);
        setDomains(parentDomains);
      } catch (error) {
        console.error("Error fetching domains:", error);
        toast.error("Failed to load domains");
        setDomains([]);
      } finally {
        setIsFetchingDomains(false);
      }
    };

    fetchDomains();
  }, [isOpen, session]);

  const onSubmitForm = async (values: z.infer<typeof CreateLearningPathSchema>) => {
    if (!session?.user?.token) {
      toast.error("Authentication required. Please log in again.");
      return;
    }

    try {
      setIsLoading(true);
      const updateData = {
        title: values.title.trim(),
        description: values.description.trim(),
        domainId: Number(values.domainId),
        isPublic: values.isPublic === true ? true : false,
      };

      const response = await updateLearningPath(
        learningPath.pathId,
        updateData,
        session.user.token
      );

      if (!response || response.success === false) {
        toast.error(response?.message || "Failed to update learning path!");
      } else {
        toast.success("Updated learning path successfully!");
        onClose();
        onUpdate();
      }
    } catch (error: any) {
      console.error("Update error:", error);
      toast.error(error?.response?.data?.message || error?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent width="600" >
        <DialogHeader>
          <DialogTitle className="text-center">Update Learning Path</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitForm)} className="w-full grid grid-cols-1 gap-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Learning Path Title</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
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

            {/* <FormField
              control={form.control}
              name="domainId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Parent Domain</FormLabel>
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
            /> */}
            <FormItem>
              <FormLabel>Domain</FormLabel>
              <FormControl>
                <Input
                  value={learningPath.domain?.name || "No domain assigned"}
                  disabled
                />
              </FormControl>
            </FormItem>

            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormLabel>Public</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value === true}
                      onCheckedChange={(checked) => field.onChange(checked)}
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
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button disabled={isLoading || isFetchingDomains} type="submit">
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