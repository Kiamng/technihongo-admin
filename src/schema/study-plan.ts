import { z } from "zod";

export const StudyPlanSchema = z.object({
    title : z.string().min(1,"Tên kế hoạch học tập không được để trống!"),
    description :  z.string().min(1,"Hãy thêm một mô tả!"),
    hoursPerDay : z.coerce
    .number({
        required_error: "Hãy thời gian học trong một ngày",
    })
    .positive('Thời gian không thể là số 0 hoặc số âm')
    .refine((value) => value !== 0, {
      message: 'Thời gian không thể là số 0 '
    }),
    isDefault : z.boolean().optional(),
})