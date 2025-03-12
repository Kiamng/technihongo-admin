import { z } from "zod";

export const CreateLearningPathSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  domainId: z.number({required_error: "domainID is required"})
    .int("Domain ID must be an integer")
    .nonnegative("Domain ID cannot be negative"),
  isPublic: z.boolean()
});