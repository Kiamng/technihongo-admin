import { z } from "zod";

export const SystemFlashcardSetSchema = z.object({
  title: z.string().min(1,"Tên bộ flashcard không được để trống"),
  description: z.string().min(1, "Hãy thêm một mô tả"),
  difficultyLevel: z.string().min(1, "Hãy chọn độ khó"),
  isPremium: z.boolean().optional(),
  isPublic: z.boolean().optional(),
});