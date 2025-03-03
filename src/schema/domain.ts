import { z } from "zod";

export const addDomainSchema = z.object({
  tag: z.string().min(1, "Tag is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"), // Bắt buộc phải có giá trị
  parentDomainId: z.number().int().min(1, "Parent Domain ID is required"), // Bắt buộc nhập số
  isActive: z.boolean(),
});

