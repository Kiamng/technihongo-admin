import { isMostlyJapanese } from "@/lib/validation/japanese";
import { containsEmoji, containsSpecialChar } from "@/lib/validation/viet-eng";
import { z } from "zod";

export const FlashcardSchema = z.object({
    flashcardId : z.number().nullable(),
  japaneseDefinition: z.string()
    .min(1, "Từ vựng không được để trống")
    .refine(val => isMostlyJapanese(val), {
      message: "Từ vựng phải là tiếng Nhật và không được chứa icon hoặc ký tự đặc biệt",
    }).refine((val) => val.trim().split(/\s+/).length <= 100, {
      message: `Từ vựng không được quá 100 từ`,
    }),
  vietEngTranslation: z.string()
  .min(1, "Định nghĩa không được để trống")
  .refine((val) => !containsEmoji(val), {
    message: "Không được để icon hoặc emoji",
  })
  .refine((val) => !containsSpecialChar(val), {
    message: "không được để ký tự đặc biệt",
  }).refine((val) => val.trim().split(/\s+/).length <= 100, {
      message: `Định nghĩa không được quá 100 từ`,
    }), 
  imageUrl : z.string().nullable(),
  cardOrder : z.number().nullable() 
});

export const FlashcardSetSchema = z.object({
  flashcards: z.array(FlashcardSchema),
});