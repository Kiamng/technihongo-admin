// import { z } from "zod";

// export const CreateLearningPathSchema = z.object({
//   title: z.string().min(1, "Title is required"),
//   description: z.string().min(1, "Description is required"),
//   domainId: z.number({required_error: "domainID is required"})
//     .int("Domain ID must be an integer")
//     .nonnegative("Domain ID cannot be negative"),
//   isPublic: z.boolean()
// });


// export const UpdatePathCourseOrderSchema = z.object({
//   pathId: z.number(),
//   courseOrders: z.array(
//     z.object({
//       courseId: z.number(),
//       order: z.number()
//     })
//   )
// });
/* schema/learning-path.ts */
import { z } from "zod";

export const CreateLearningPathSchema = z.object({
  title: z.string().min(1, "Tên của lộ trình không được để trống"),
  description: z.string().min(1, "Hãy thêm một mô tả"),
  domainId: z.number({ required_error: "Hãy chọn 1 lĩnh vực" })
    .int("Domain ID must be an integer")
    .nonnegative("Domain ID cannot be negative"),
  isPublic: z.boolean()
});

export const UpdatePathCourseOrderSchema = z.object({
  pathId: z.number(),
  courseOrders: z.array(
    z.object({
      courseId: z.number(),
      order: z.number()
    })
  )
});