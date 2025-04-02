import { z } from "zod";

export const SystemFlashcardSetSchema = z.object({
  title: z.string().min(1,"Title is required"),
  description: z.string().min(1, "Description is required"),
  difficultyLevel: z.string().min(1, "Level is required"),
  isPremium: z.boolean().optional(),
  isPublic: z.boolean().optional(),
});