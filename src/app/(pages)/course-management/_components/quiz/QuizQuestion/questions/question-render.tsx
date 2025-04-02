import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Trash } from "lucide-react";
import { FieldValues } from "react-hook-form";
import QuestionImageUpload from "./question-image-upload";

interface QuestionRender {
    field: FieldValues,
    index: number,
    addChangedQuestion: (index: number) => void,
    handleImageUpload: (index: number, imageUrl: string) => void,
    handleDeleteImage: (index: number) => void,
    isSaving: boolean,
    hasAttempt: boolean
}

const QuestionRender = ({ field, index, addChangedQuestion, handleImageUpload, handleDeleteImage, isSaving, hasAttempt }: QuestionRender) => {
    return (
        <div className="w-full flex flex-row space-x-4">
            <FormField control={field.control} name={`questions.${index}.questionText`} render={({ field }) => (
                <FormItem className="flex-1">
                    <FormLabel>Question Text</FormLabel>
                    <FormControl>
                        <Textarea  {...field}
                            disabled={isSaving || hasAttempt}
                            placeholder="Enter question text"
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
                    <FormLabel>Explanation(Optional)</FormLabel>
                    <FormControl>
                        <Textarea  {...field}
                            disabled={isSaving || hasAttempt}
                            placeholder="Enter explanation"
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
                (!hasAttempt &&
                    <QuestionImageUpload isSaving={isSaving} handleImageUpload={handleImageUpload} index={index} />
                )
                :
                <div
                    className={`border-dashed border-[2px] rounded-lg h-[92px] w-32 flex justify-end text-slate-500  ${!isSaving ? "hover:cursor-not-allowed" : "hover:cursor-pointer hover:text-green-500 hover:scale-105 duration-100"}`}

                    style={{
                        backgroundImage: `url(${field.url})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center"
                    }}
                >
                    {!hasAttempt &&
                        <button disabled={isSaving} type="button" onClick={() => handleDeleteImage(index)} className="bg-slate-700 text-white hover:bg-red-500 p-1 h-fit">
                            <Trash size={16} />
                        </button>
                    }
                </div>
            }

        </div>
    )
}

export default QuestionRender
