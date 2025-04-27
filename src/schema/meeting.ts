import { isMostlyJapanese } from "@/lib/validation/japanese";
import { z } from "zod";

export const ScriptSchema =   z.object({
    scriptId: z.number().nullable(),
    question : z.string()
    .min(1, "Câu hỏi không được để trống !")
    .refine(val => isMostlyJapanese(val), {
          message: "Phải là tiếng Nhật và không được chứa icon hay ký tự đặc biệt",
        }),
    answer :  z.string()
    .min(1, "Phản hồi không được để trống !")
    .refine(val => isMostlyJapanese(val), {
          message: "Phải là tiếng Nhật và không được chứa icon hay ký tự đặc biệt",
        }),
    scriptOrder : z.number().nullable() 
})

export const MeetingSchema = z.object({
  infomation: z.object({
                title: z.string().min(1, "Tên không được để trống !"), 
                description: z.string().optional(),
                voiceName : z.string().min(1, "Vui lòng chọn 1 giọng nói !"),
                isActive : z.boolean()  
            }),
    scripts : z.array(ScriptSchema)
});