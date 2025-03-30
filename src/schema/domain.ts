import { z } from "zod";

export const addDomainSchema = z.object({
  tag: z.string().min(1, "Tag is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  parentDomainId: z.number().int().nullable().optional(),
  isActive: z.boolean(),
});

