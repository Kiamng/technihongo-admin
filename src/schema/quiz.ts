import { z } from "zod";

export const QuizSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    difficultyLevelId: z.number().int().min(1, "Difficulty level is required"),
    passingScore: z.coerce.number()
        .min(5, "Passing score cannot be less than 5")
        .max(10, "Passing score cannot be greater than 10")
        .int("Passing score must be an integer")
        .transform((val) => val / 10),
    timeLimit: z.coerce.number()
        .int("Time limit must be an integer")
        .min(10, "Time limit must be at least 10 minutes")
        .max(120, "Time limit cannot exceed 120 minutes"),
    isPremium: z.boolean().optional(),
});

