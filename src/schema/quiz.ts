import { z } from "zod";

export const QuizSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    difficultyLevelId: z.number().int().min(1, "Difficulty level is required"),
    passingScore: z.number()
        .min(0, "Passing percent cannot be less than 0")
        .max(100, "Passing percent cannot be greater than 100%")
        .int("Passing score must be an integer")
        .transform((val) => val / 100),  // Chuyển giá trị từ phần trăm sang thập phân
});

