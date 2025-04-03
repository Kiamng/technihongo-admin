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
import { addSubscriptionPlanSchema } from "@/schema/subscriptionplan";
import { updateSubscriptionPlan } from "@/app/api/subscription/subscription.api";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { SubscriptionPlan } from "@/types/subscription";

interface EditSubscriptionPlanPopupProps {
  subscriptionPlan: SubscriptionPlan;
  isOpen: boolean;
  onClose: () => void;
  token: string;
  fetchSubscriptions: () => void;
}

const EditSubscriptionPlanPopup: React.FC<EditSubscriptionPlanPopupProps> = ({
  subscriptionPlan,
  isOpen,
  onClose,
  token,
  fetchSubscriptions
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof addSubscriptionPlanSchema> & { active: boolean }>({
    resolver: zodResolver(addSubscriptionPlanSchema),
    defaultValues: {
      name: subscriptionPlan.name,
      price: subscriptionPlan.price,
      benefits: subscriptionPlan.benefits,
      durationDays: subscriptionPlan.durationDays,
      active: subscriptionPlan.active,
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset(subscriptionPlan);
    }
  }, [isOpen, subscriptionPlan, form]);

  const onSubmitForm = async (values: z.infer<typeof addSubscriptionPlanSchema> & { active: boolean }) => {
    try {
      setIsLoading(true);
      const response = await updateSubscriptionPlan(token, subscriptionPlan.subPlanId, values);

      if (!response || response.success === false) {
        toast.error("Failed to update subscription plan!");
      } else {
        toast.success("Updated subscription plan successfully!");
        fetchSubscriptions()
        onClose(); // Đóng modal khi thành công
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating the subscription plan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-center">Update Subscription Plan</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitForm)} className="w-full space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subscription Name</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="benefits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Benefit</FormLabel>
                  <FormControl>
                    <Textarea disabled={isLoading} {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input disabled={isLoading} type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="durationDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration days</FormLabel>
                    <FormControl>
                      <Input disabled={isLoading} type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormLabel>Active</FormLabel>
                  <FormControl>
                    <Switch disabled={isLoading} checked={field.value} onCheckedChange={field.onChange} />
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

export default EditSubscriptionPlanPopup;
