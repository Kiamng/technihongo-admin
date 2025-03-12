import { z } from "zod";

export const StudyPlanSchema = z.object({
    title : z.string().min(1,"Title is required !"),
    description :  z.string().min(1,"Title is required !"),
    hoursPerDay : z.coerce
    .number({
        required_error: "Price is required",
    })
    .positive('This can not be 0 or negative')
    .refine((value) => value !== 0, {
      message: 'This cannot be 0'
    }),
    isDefault : z.boolean().optional(),
    isActive : z.boolean().optional()
})