"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { addDomainSchema } from "@/schema/domain";

type AddDomainFormValues = z.infer<typeof addDomainSchema>;

export default function AddDomainForm() {
  const form = useForm<AddDomainFormValues>({
    resolver: zodResolver(addDomainSchema),
    defaultValues: {
      tag: "",
      name: "",
      description: "",
      parentDomainId: undefined,
      isActive: true,
    },
  });

  const onSubmit = async (data: AddDomainFormValues) => {
    console.log("Form submitted:", data);
    // Gọi API để thêm domain vào database
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        
        {/* Dòng 1: Tag + Name */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="tag"
            render={({ field }) => (
              <FormItem>
                <Label>Tag</Label>
                <FormControl>
                  <Input placeholder="Enter tag" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <Label>Name</Label>
                <FormControl>
                  <Input placeholder="Enter name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Dòng 2: Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <Label>Description</Label>
              <FormControl>
                <Textarea placeholder="Enter description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Dòng 3: Parent Domain ID */}
        <FormField
          control={form.control}
          name="parentDomainId"
          render={({ field }) => (
            <FormItem>
              <Label>Parent Domain ID</Label>
              <FormControl>
                <Input type="number" placeholder="Enter parent domain ID" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit">Add Domain</Button>
      </form>
    </Form>
  );
}
