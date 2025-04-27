import { z } from "zod";

export const OptionSchema = z.object({
  optionText: z.string().min(1, "Đáp án không được để trống"), 
  isCorrect: z.boolean(),     
});

export const QuestionSchema = z.object({
  quizQuestionId: z.number().nullable(),
  questionId: z.number().nullable(),
  questionText: z.string().min(1, "Hãy nhập câu hỏi"),
  explanation: z.string(),
  url: z.string().nullable(),
  initialIndex: z.number().nullable(),
  questionType: z.enum(["Single_choice", "Multiple_choice"]),
  options: z.array(OptionSchema)
}).superRefine((data, context) => {
  const correctOptionsCount = data.options.filter(option => option.isCorrect).length;

  if (correctOptionsCount === 0) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Phải có ít nhất một đáp án đúng.",
      path: ["options"]
    });
  }

  if (correctOptionsCount === 1 && data.questionType !== "Single_choice") {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Nếu chỉ có một đáp án đúng, questionType phải là 'Single_choice'.",
      path: ["questionType"]
    });
  }

  if (correctOptionsCount > 1 && data.questionType !== "Multiple_choice") {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Nếu có nhiều đáp án đúng, questionType phải là 'Multiple_choice'.",
      path: ["questionType"]
    });
  }
});

export const QuizQuestionSchema = z.object({
  questions: z.array(QuestionSchema),
});
