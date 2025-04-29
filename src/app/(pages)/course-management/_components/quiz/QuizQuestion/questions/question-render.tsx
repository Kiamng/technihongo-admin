import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Trash } from "lucide-react";
import { FieldValues } from "react-hook-form";
import QuestionImageUpload from "./question-image-upload";

interface QuestionRender {
    field: FieldValues,
    index: number,
    addChangedQuestion: (index: number) => void,
    handleImageSelect: (index: number, file: File) => void,
    handleDeleteImage: (index: number) => void,
    isSaving: boolean,
    hasAttempt: boolean
    isPublic: boolean
}

const QuestionRender = ({ field, index, addChangedQuestion, handleDeleteImage, isSaving, hasAttempt, handleImageSelect, isPublic }: QuestionRender) => {
    return (
        <div className="w-full flex flex-row space-x-4">
            <FormField control={field.control} name={`questions.${index}.questionText`} render={({ field }) => (
                <FormItem className="flex-1">
                    <FormLabel>Câu hỏi</FormLabel>
                    <FormControl>
                        <Textarea  {...field}
                            disabled={isSaving || hasAttempt || isPublic}
                            placeholder="Nhập câu hỏi"
                            className="resize-none w-full white-space: pre-line "
                            onChange={(e) => {
                                field.onChange(e);
                                addChangedQuestion(index);
                            }}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )} />

            <FormField control={field.control} name={`questions.${index}.explanation`} render={({ field }) => (
                <FormItem className="flex-1">
                    <FormLabel>Giải thích(Optional)</FormLabel>
                    <FormControl>
                        <Textarea  {...field}
                            disabled={isSaving || hasAttempt || isPublic}
                            placeholder="Nhập giải thích"
                            className="resize-none w-full white-space: pre-line "
                            onChange={(e) => {
                                field.onChange(e);
                                addChangedQuestion(index);
                            }} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )} />
            {!field.url ?
                (!hasAttempt || !isPublic &&
                    <QuestionImageUpload isSaving={isSaving} handleImageSelect={handleImageSelect} index={index} />
                )
                :
                <div
                    className={`border-dashed border-[2px] rounded-lg h-[92px] w-32 flex justify-end text-slate-500  ${isSaving ? "hover:cursor-not-allowed" : "hover:cursor-pointer hover:text-green-500 hover:scale-105 duration-100"}`}

                    style={{
                        backgroundImage: `url(${field.url})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center"
                    }}
                >
                    {!hasAttempt &&
                        <button disabled={isSaving || isPublic} type="button" onClick={() => handleDeleteImage(index)} className={`bg-slate-700 text-white hover:bg-red-500 p-1 h-fit ${isSaving ? "hover:cursor-not-allowed" : "hover:cursor-pointer hover:scale-105 duration-100"}`}>
                            <Trash size={16} />
                        </button>
                    }
                </div>
            }

        </div>
    )
}

export default QuestionRender
