import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { CircleCheckBig } from "lucide-react";
import { useEffect, useState } from "react";
import { FieldValues } from "react-hook-form";
import { z } from "zod";
import { OptionSchema } from "@/schema/question";

export type OptionType = z.infer<typeof OptionSchema>;
interface OptionRenderProps {
    field: FieldValues;
    index: number;
    handleOptionClick: (questionIndex: number, optionIndex: number) => void;
    addChangedQuestion: (index: number) => void;
    isSaving: boolean
}

const OptionRender = ({ field, index, handleOptionClick, addChangedQuestion, isSaving }: OptionRenderProps) => {
    const [options, setOptions] = useState<OptionType[]>(field.options || []); // Luôn khởi tạo thành mảng nếu undefined

    useEffect(() => {
        setOptions(field.options || []); // Đồng bộ lại options khi có thay đổi từ props
    }, [field.options]);

    const handleOptionToggle = (optionIndex: number) => {
        // Kiểm tra số lượng đáp án đúng hiện tại
        const correctOptionsCount = options.filter(option => option.isCorrect).length;

        // Nếu chỉ còn 1 đáp án đúng và người dùng đang cố bỏ chọn nó, thì không cho phép
        if (correctOptionsCount === 1 && options[optionIndex].isCorrect) {
            return; // Nếu chỉ còn 1 đáp án đúng, không cho phép thay đổi
        }

        const updatedOptions = options.map((option, idx) => {
            if (idx === optionIndex) {
                return { ...option, isCorrect: !option.isCorrect };
            }
            return option;
        });

        setOptions(updatedOptions); // Cập nhật state options tại local
    };
    return (
        <>
            <div className="text-sm font-medium">
                Options :
            </div>
            <div className="w-full grid grid-cols-2 gap-4">
                {options.map((option: { optionText: string; isCorrect: boolean }, optionIndex: number) => (
                    <div key={`option-${index}-${optionIndex}`} className="w-full flex flex-row gap-2">
                        <FormField
                            control={field.control}
                            name={`questions.${index}.options.${optionIndex}.optionText`}
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormControl>
                                        <Textarea
                                            disabled={isSaving}
                                            {...field}
                                            className="resize-none w-full white-space: pre-line text-slate-500"
                                            placeholder="Enter answer option"
                                            onChange={(e) => {
                                                field.onChange(e);
                                                addChangedQuestion(index);
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <button
                            type="button"
                            disabled={isSaving}
                            onClick={() => {
                                handleOptionToggle(optionIndex);
                                handleOptionClick(index, optionIndex);
                            }}
                            className={`cursor-pointer p-2 rounded-full transition-all duration-100 hover:scale-125 ${option.isCorrect ? "text-green-500" : "text-gray-400"}`}
                        >
                            <CircleCheckBig />
                        </button>
                    </div>
                ))}
            </div>
        </>
    );
};

export default OptionRender;
