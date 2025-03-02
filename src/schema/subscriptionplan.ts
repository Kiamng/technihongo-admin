import { z } from "zod";

export const addSubscriptionPlanSchema = z.object({
  name: z
    .string()
    .nonempty("Tên gói không được để trống") // Bắt buộc nhập
    .min(3, { message: "Tên gói phải có ít nhất 3 ký tự" })
    .max(100, { message: "Tên gói không được vượt quá 100 ký tự" }),

  benefits: z
    .string()
    .min(10, { message: "Benefits phải có ít nhất 10 ký tự" })
    .max(500, { message: "Benefits không được vượt quá 500 ký tự" }),

  price: z
    .number({
      required_error: "Giá không được để trống",
      invalid_type_error: "Giá phải là một số hợp lệ",
    })
    .min(10000, { message: "Giá phải từ 10,000 đến 10,000,000 VND" })
    .max(10000000, { message: "Giá phải từ 10,000 đến 10,000,000 VND" }),

  durationDays: z
    .number({
      required_error: "Thời gian không được để trống",
      invalid_type_error: "Thời gian phải là một số hợp lệ",
    })
    .min(60, { message: "Thời gian phải từ 60 đến 3650 ngày" })
    .max(3650, { message: "Thời gian phải từ 60 đến 3650 ngày" }),

  active: z.boolean(),
});
