import { isMostlyJapanese } from "@/lib/validation/japanese";
import { containsEmoji, containsSpecialChar, isVietnameseOrEnglish } from "@/lib/validation/viet-eng";
import { z } from "zod";

export const FlashcardSchema = z.object({
    flashcardId : z.number().nullable(),
  japaneseDefinition: z.string()
    .min(1, "Term can not be empty")
    .refine(val => isMostlyJapanese(val), {
      message: "Term must be at least 80% Japanese and must not contain emoji or special icons",
    }),
  vietEngTranslation: z.string()
  .min(1, "Definition can not be empty")
  .refine((val) => !containsEmoji(val), {
    message: "No emoji or icon allowed",
  })
  .refine((val) => !containsSpecialChar(val), {
    message: "No special characters like @, #, % allowed",
  })
  .refine((val) => isVietnameseOrEnglish(val), {
    message: "Must be in Vietnamese or English",
  }),
  imageUrl : z.string().nullable(),
  cardOrder : z.number().nullable() 
});

export const FlashcardSetSchema = z.object({
  flashcards: z.array(FlashcardSchema),
});