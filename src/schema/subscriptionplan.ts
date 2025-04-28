import { z } from "zod";

export const addSubscriptionPlanSchema = z.object({
  name: z.string().nonempty("Hãy nhập tên gói đăng ký"),

  benefits: z.string().min(1, { message: "Hãy nhập lợi ích" }),

  price: z
    .coerce.number()
    .min(10000, { message: "Giá phải từ 10,000 tới 10,000,000 VND" })
    .max(10000000, { message: "Giá phải từ 10,000 tới 10,000,000 VND" }),

  durationDays: z
    .coerce.number()
    .min(30, { message: "Thời hạn phải từ 30 tới 365 days" })
    .max(365, { message: "Thời hạn phải từ 30 tới 365 days" }),

  active: z.boolean(),
});

