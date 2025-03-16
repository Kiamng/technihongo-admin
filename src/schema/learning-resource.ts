import { z } from "zod";

export const LearningResourceSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    domainId: z.number().int().optional(),
    videoUrl: z.union([
        z.string().url("Invalid URL"), // Nếu là URL từ Cloudinary
        z.instanceof(File, { message: "Video file is required" }), // Nếu là file tải lên
    ]),
    videoFilename: z.string().min(1, "Video name is required"),
    pdfUrl: z.union([
        z.string().url("Invalid URL"), // Nếu là URL từ Cloudinary
        z.instanceof(File, { message: "PDF file is required" }), // Nếu là file tải lên
    ]).optional(),
    pdfFilename: z.string().min(1, "PDF name is required").optional(),
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
