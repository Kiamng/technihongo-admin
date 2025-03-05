import { z } from "zod";

export const CreateCourseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  domainId: z.number().int().min(1, "Domain is required"),
  thumbnailUrl: z.union([
    z.string().url("Invalid URL"), // Nếu là URL từ Cloudinary
    z.instanceof(File, { message: "File is required" }), // Nếu là file tải lên
  ]),
  estimatedDuration: z.string().min(1, "Estimated duration is required"),
});

export const updateCourseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  domainId: z.number().int().min(1, "Domain is required"),
  thumbnailUrl: z.union([
    z.string().url("Invalid URL"), // Nếu là URL từ Cloudinary
    z.instanceof(File, { message: "File is required" }), // Nếu là file tải lên
  ]),
  estimatedDuration: z.string().min(1, "Estimated duration is required"),
  isPremium : z.boolean(),
  isPublic : z.boolean()
});