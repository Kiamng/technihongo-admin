import { z } from "zod";

export const LearningResourceSchema = z.object({
    title: z.string().min(1, "Hãy nhập tên bài giảng"),
    description: z.string().optional(),
    videoUrl: z.union([
        z.string().url("Invalid URL"), // Nếu là URL từ Cloudinary
        z.instanceof(File, { message: "Hãy chon 1 video" }), // Nếu là file tải lên
    ]),
    videoFilename: z.string().min(1, "Tên video name không được để trống"),
    pdfUrl: z.union([
        z.string().url("Invalid URL"), // Nếu là URL từ Cloudinary
        z.instanceof(File, { message: "Hãy chon 1 pdf" }), // Nếu là file tải lên
    ]).optional(),
    pdfFilename: z.string().optional(),
    premium: z.boolean(),
}).refine((data) => {
  // Nếu có pdfUrl thì phải có pdfFilename
  if (data.pdfUrl && !data.pdfFilename) {
    return false;
  }
  return true;
}, {
  message: "PDF filename is required if PDF file is provided",
  path: ["pdfFilename"],
});
