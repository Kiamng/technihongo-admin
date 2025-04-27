import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Volume2 } from "lucide-react";
import { FieldValues } from "react-hook-form";


interface ScriptsInFormProps {
    field: FieldValues,
    index: number,
    isSaving: boolean,
    addChangedScript: (index: number) => void,
    handleDelete: (index: number) => void,
    speakQuestion: (question: string) => void
}

const ScriptsInForm = ({ field, index, isSaving, addChangedScript, handleDelete, speakQuestion }: ScriptsInFormProps) => {
    return (
        <>
            <div className="flex justify-between">
                <div className="text-lg font-semibold text-slate-500">{index + 1}</div>
                {!isSaving && <button disabled={isSaving} type="button" onClick={() => handleDelete(index)} className="text-red-400 hover:text-red-500 duration-100 hover:scale-125">
                    <Trash2 />
                </button>}
            </div>
            <Separator />
            <div className="w-full flex flex-row space-x-4">
                <FormField control={field.control} name={`scripts.${index}.question`} render={({ field }) => (
                    <FormItem className="flex-1">
                        <FormLabel>Câu hỏi</FormLabel>
                        <div className="flex flex-row space-x-2 items-center">
                            <FormControl>
                                <Textarea  {...field}
                                    disabled={isSaving}
                                    placeholder="Nhập câu hỏi"
                                    className="resize-none w-full white-space: pre-line flex-1"
                                />
                            </FormControl>
                            <Button
                                className="rounded-full hover:scale-105 transition-all duration-300 text-gray-600 hover:text-green-500"
                                size={"icon"}
                                variant={"ghost"}
                                type="button"
                                onClick={() => {
                                    speechSynthesis.cancel();
                                    speakQuestion(field.value)
                                }}
                            >
                                <Volume2 size={28} />
                            </Button>
                        </div>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={field.control} name={`scripts.${index}.answer`} render={({ field }) => (
                    <FormItem className="flex-1">
                        <FormLabel>Phản hồi</FormLabel>
                        <FormControl>
                            <Textarea  {...field}
                                disabled={isSaving}
                                placeholder="Nhập phản hồi"
                                className="resize-none w-full white-space: pre-line "
                                onChange={(e) => {
                                    field.onChange(e);
                                    addChangedScript(index);
                                }} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
            </div>
        </>
    )
}

export default ScriptsInForm
