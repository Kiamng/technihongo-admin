import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, Trash, Trash2 } from "lucide-react";
import { FieldValues } from "react-hook-form";


interface FlashcardInFormProps {
    field: FieldValues,
    index: number,
    isSaving: boolean,
    addChangedFlashcard: (index: number) => void,
    handleDelete: (index: number) => void,
    handleDeleteImage: (index: number) => void,
    handleImageSelect: (index: number, file: File) => void,
}

const FlashcardInFormRender = ({ field, index, isSaving, addChangedFlashcard, handleDelete, handleDeleteImage, handleImageSelect }: FlashcardInFormProps) => {
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
                <FormField control={field.control} name={`flashcards.${index}.japaneseDefinition`} render={({ field }) => (
                    <FormItem className="flex-1">
                        <FormLabel>Term</FormLabel>
                        <FormControl>
                            <Textarea  {...field}
                                disabled={isSaving}
                                placeholder="Enter question text"
                                className="resize-none w-full white-space: pre-line"
                                onChange={(e) => {
                                    field.onChange(e);
                                    addChangedFlashcard(index);
                                }}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={field.control} name={`flashcards.${index}.vietEngTranslation`} render={({ field }) => (
                    <FormItem className="flex-1">
                        <FormLabel>Definition</FormLabel>
                        <FormControl>
                            <Textarea  {...field}
                                disabled={isSaving}
                                placeholder="Enter explanation"
                                className="resize-none w-full white-space: pre-line "
                                onChange={(e) => {
                                    field.onChange(e);
                                    addChangedFlashcard(index);
                                }} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                {!field.imageUrl ? (
                    <>
                        <input
                            type="file"
                            accept="image/*"
                            id={`upload-${index}`}
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    handleImageSelect(index, file);
                                }
                            }}
                        />
                        <label htmlFor={`upload-${index}`}>
                            <div className="border-dashed border-[2px] rounded-lg h-[92px] w-32 flex items-center justify-center text-slate-500 hover:text-green-500 hover:scale-105 duration-100 cursor-pointer">
                                <ImagePlus />
                            </div>
                        </label>
                    </>
                ) : (
                    <div
                        className={`border-dashed border-[2px] rounded-lg h-[92px] w-32 flex justify-end text-slate-500 ${isSaving
                            ? "hover:cursor-not-allowed"
                            : "hover:cursor-pointer hover:text-green-500 hover:scale-105 duration-100"
                            }`}
                        style={{
                            backgroundImage: `url(${field.imageUrl})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center"
                        }}
                    >
                        <button
                            disabled={isSaving}
                            type="button"
                            onClick={() => handleDeleteImage(index)}
                            className={`bg-slate-700 text-white hover:bg-red-500 p-1 h-fit ${!isSaving ? "hover:cursor-not-allowed" : "hover:cursor-pointer hover:scale-105 duration-100"}`}
                        >
                            <Trash size={16} />
                        </button>
                    </div>
                )}
            </div>
        </>
    )
}

export default FlashcardInFormRender
