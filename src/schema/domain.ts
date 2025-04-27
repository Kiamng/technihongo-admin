import { z } from "zod";

export const addDomainSchema = z.object({
  tag: z.string().min(1, "Hãy điền tag"),
  name: z.string().min(1, "Hãy điền tên lĩnh vực"),
  description: z.string().min(1, "Hãy thêm một mô tả"),
  parentDomainId: z.number().int().nullable().optional(),
  isActive: z.boolean(),
});

