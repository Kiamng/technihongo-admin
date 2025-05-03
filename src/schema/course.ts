import { z } from "zod";

export const CreateCourseSchema = z.object({
  title: z.string().min(1, "Tên khóa học không được để trống"),
  description: z.string().min(1, "Hãy thêm một mô tả"),
  domainId: z.number().int().min(1, "Hãy chọn 1 lĩnh vực"),
  difficultyLevelId: z.number().int().min(1, "Hãy chọn 1 độ khó"),
  thumbnailUrl: z.union([
    z.string().url("URL không hợp lệ"), // Nếu là URL từ Cloudinary
    z.instanceof(File, { message: "File không được để trống" }), // Nếu là file tải lên
  ]),
  estimatedDuration: z.string().min(1, "Hãy nhập thời gian học ước tính"),
  isPremium : z.boolean(),
});

export const updateCourseSchema = z.object({
  title: z.string().min(1, "Tên khóa học không được để trống"),
  description: z.string().min(1, "Hãy thêm một mô tả"),
  domainId: z.number().int().min(1, "Hãy chọn 1 lĩnh vực"),
  difficultyLevelId: z.number().int().min(1, "Hãy chọn 1 độ khó"),
  thumbnailUrl: z.union([
    z.string().url("Invalid URL"), // Nếu là URL từ Cloudinary
    z.instanceof(File, { message: "File không được để trống" }), // Nếu là file tải lên
  ]),
  estimatedDuration: z.string().min(1, "Hãy nhập thời gian học ước tính"),
  isPremium : z.boolean(),
});