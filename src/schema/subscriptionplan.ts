import { z } from "zod";

export const addSubscriptionPlanSchema = z.object({
  name: z.string().nonempty("Subscription plan name is required"),

  benefits: z.string().min(1, { message: "Benefit is required" }),

  price: z
    .coerce.number()
    .min(10000, { message: "Price must be from 10,000 to 10,000,000 VND" })
    .max(10000000, { message: "Price must be from 10,000 to 10,000,000 VND" }),

  durationDays: z
    .coerce.number()
    .min(30, { message: "Duration day must be from 30 to 365 days" })
    .max(365, { message: "Duration day must be from 30 to 365 days" }),

  active: z.boolean(),
});

