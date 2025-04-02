import { z } from "zod";

export const FlashcardSchema = z.object({
    flashcardId : z.number().nullable(),
  japaneseDefinition: z.string().min(1, "Term can not be empty"), 
  vietEngTranslation: z.string().min(1, "Definition can not be empty"), 
  imageUrl : z.string().nullable(),
  cardOrder : z.number().nullable() 
});

export const FlashcardSetSchema = z.object({
  flashcards: z.array(FlashcardSchema),
});