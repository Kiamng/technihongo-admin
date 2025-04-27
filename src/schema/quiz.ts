import { z } from "zod";

export const QuizSchema = z.object({
    title: z.string().min(1, "Hãy nhập tên bài kiểm tra"),
    description: z.string().min(1, "hãy thêm một mô tả"),
    difficultyLevelId: z.number().int().min(1, "Hãy chọn độ khó"),
    passingScore: z.coerce.number()
        .min(5, "Điểm đạt không thể < 5")
        .max(10, "Điểm đạt không thể > 10")
        .int("Hãy nhập số")
        .transform((val) => val / 10),
    timeLimit: z.coerce.number()
        .int("Giới hạn phải là một số")
        .min(10, "Ít nhất là 10 phút")
        .max(120, "Nhiều nhất là 120 phút"),
    isPremium: z.boolean().optional(),
});

