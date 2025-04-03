import { createFlashcards, deleteFlashcard, updateFlashard } from "@/app/api/system-flashcard-set/system-flashcard-set.api";
import EmptyStateComponent from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { FlashcardSchema, FlashcardSetSchema } from "@/schema/flashcard";
import { Flashcard } from "@/types/flashcard";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, LoaderCircle, Plus, Trash, Trash2 } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import { useEffect, useState, useTransition } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import ImportCSVPopup from "../../spreadsheet-import/import-csv-popup";
import { handleFlashcardFileUpload } from "../../spreadsheet-import/flashcard-import-action";

type FlashcardInForm = z.infer<typeof FlashcardSchema>;

interface FlashcardProps {
    initialData: Flashcard[]
    token: string
    flashcardSetId: number
    fetchSet: () => Promise<void>
}

const FlashcardRender = ({ initialData, token, flashcardSetId, fetchSet }: FlashcardProps) => {
    const [isSaving, startTransition] = useTransition();
    const [initialOrder, setInitialOrder] = useState<FlashcardInForm[]>([]);
    const [newFlashcardOrder, setNewFlashcardOrder] = useState<FlashcardInForm[]>([]);
    const [changedFlashcards, setChangedFlashcards] = useState<FlashcardInForm[]>([]);
    const [imageUrls, setImageUrls] = useState<(string | null)[]>([]);


    const form = useForm<z.infer<typeof FlashcardSetSchema>>({
        resolver: zodResolver(FlashcardSetSchema),
        mode: 'onChange',
        defaultValues: {
            flashcards: []
        }
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "flashcards",
    });

    const getBorderClass = (field: FlashcardInForm) => {
        if (!field.flashcardId) {
            return "border-green-500";
        }

        return changedFlashcards.some(q => q.flashcardId === field.flashcardId)
            ? "border-yellow-500"
            : "";
    };

    const handleImageUpload = (index: number, imageUrl: string) => {
        const updatedImageUrls = [...imageUrls];
        updatedImageUrls[index] = imageUrl;
        setImageUrls(updatedImageUrls);
        const updatedFlashcard = [...form.getValues().flashcards];
        updatedFlashcard[index].imageUrl = imageUrl;
        form.setValue("flashcards", updatedFlashcard);

        const updatedChangedFlashcards = [...changedFlashcards];
        const existingIndex = updatedChangedFlashcards.findIndex(q => q.flashcardId === updatedFlashcard[index].flashcardId);
        if (existingIndex > -1) {
            updatedChangedFlashcards[existingIndex] = { ...updatedFlashcard[index] };
        } else {
            updatedChangedFlashcards.push({ ...updatedFlashcard[index] });
        }
        setChangedFlashcards(updatedChangedFlashcards);
    };

    const handleDeleteImage = (index: number) => {
        const updatedImageUrls = [...imageUrls];
        updatedImageUrls[index] = null;
        setImageUrls(updatedImageUrls);
        const updatedFlashcard = [...form.getValues().flashcards];
        updatedFlashcard[index].imageUrl = "";
        form.setValue("flashcards", updatedFlashcard);

        const updatedChangedFlashcards = [...changedFlashcards];
        const existingIndex = updatedChangedFlashcards.findIndex(q => q.flashcardId === updatedFlashcard[index].flashcardId);
        if (existingIndex > -1) {
            updatedChangedFlashcards[existingIndex] = { ...updatedFlashcard[index] };
        } else {
            updatedChangedFlashcards.push({ ...updatedFlashcard[index] });
        }
        setChangedFlashcards(updatedChangedFlashcards);
    };

    const handleInsertNew = () => {
        append({
            flashcardId: null,
            japaneseDefinition: "",
            vietEngTranslation: "",
            imageUrl: "",
            cardOrder: 0
        });
    };

    const handleDelete = (index: number) => {
        const selectedQuestion = form.getValues().flashcards[index];

        remove(index);

        if (selectedQuestion.flashcardId) {
            deleteFlashcard(token, selectedQuestion.flashcardId)
                .then(() => {
                    toast.success('Flashcard deleted successfully!');
                })
                .catch((error) => {
                    console.error("Error deleting flashcard: ", error);
                    toast.error('Failed to delete flashcard');
                });
        } else {
            toast.success('Flashcard deleted successfully!');
        }
    };

    const addChangedFlashcard = (index: number) => {
        const updatedFlashcards = [...form.getValues().flashcards];
        const flashcard = updatedFlashcards[index];

        if (!flashcard.flashcardId) {
            return;
        }

        const existingIndex = changedFlashcards.findIndex(q => q.flashcardId === flashcard.flashcardId);

        if (existingIndex > -1) {
            const updatedChangedQuestions = [...changedFlashcards];
            updatedChangedQuestions[existingIndex] = { ...flashcard };
            setChangedFlashcards(updatedChangedQuestions);
        } else {
            setChangedFlashcards(prev => [...prev, { ...flashcard }]);
        }
    };

    const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }
        handleFlashcardFileUpload(file)
            .then((flashcards) => {
                flashcards.forEach((flashcard) => {
                    append({
                        flashcardId: null,
                        japaneseDefinition: flashcard.japaneseDefinition,
                        vietEngTranslation: flashcard.vietEngTranslation,
                        imageUrl: "",
                        cardOrder: 0
                    });
                });
            })
            .catch((error) => {
                console.error("Error importing CSV:", error);
            });
        e.target.value = '';
    };
    useEffect(() => {
        if (initialData && initialData.length > 0) {
            const flashcards = initialData.map((flashcard) => ({
                flashcardId: flashcard.flashcardId,
                japaneseDefinition: flashcard.japaneseDefinition,
                vietEngTranslation: flashcard.vietEngTranslation,
                imageUrl: flashcard.imageUrl,
                cardOrder: flashcard.cardOrder
            }));
            form.reset({
                flashcards: flashcards,
            });
            setInitialOrder(flashcards);
            setNewFlashcardOrder(flashcards);
        }
    }, [initialData, form]);

    const onSubmit = (values: z.infer<typeof FlashcardSetSchema>) => {
        const updatedFlashcards = values.flashcards;
        const oldFlashcard = updatedFlashcards.filter((flashcard) => flashcard.flashcardId);
        console.log("Old flashcard:", oldFlashcard);
        console.log("Changed flashcard:", changedFlashcards);
        const newFlashcards = updatedFlashcards.filter((flashcard) => !flashcard.flashcardId);
        const formattedNewFlashcards = newFlashcards.map(flashcard => ({
            japaneseDefinition: flashcard.japaneseDefinition,
            vietEngTranslation: flashcard.vietEngTranslation,
            imageUrl: flashcard.imageUrl
        }));
        console.log("New flashcard:", formattedNewFlashcards);
        startTransition(async () => {
            if (newFlashcards.length > 0) {
                try {
                    const repsonse = await createFlashcards(token, flashcardSetId, formattedNewFlashcards)
                    console.log(repsonse);
                } catch (error) {
                    console.error("Error while creating new flashcards: ", error);
                }
            }

            if (changedFlashcards.length > 0) {
                try {
                    for (const flashcard of changedFlashcards) {
                        if (flashcard?.flashcardId) {
                            const updateResponse = await updateFlashard(token, flashcard);
                            if (updateResponse.success === false) {
                                toast.error(`Failed to update question: "${flashcard?.japaneseDefinition}"`);
                            }
                        }
                    }
                } catch (error) {
                    console.error("Error while updating questions: ", error);
                }
            }
            setChangedFlashcards([])
            await fetchSet()
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col space-y-6">
                    <div className="w-full flex justify-between">
                        <div className="flex space-x-4 items-center">
                            <span className="text-lg font-bold ">
                                Flashcard ({newFlashcardOrder.length})
                            </span>
                            <ImportCSVPopup type="flashcard" />
                        </div>
                        <Button disabled={isSaving} type="submit">
                            {isSaving
                                ? <><LoaderCircle className="animate-spin" /> Saving ...</>
                                : "Save"}
                        </Button>
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileImport}
                            className="hidden"
                        />
                    </div>
                    <div className="w-full space-y-8">
                        {
                            fields.map((field, index) => (
                                <div key={field.id}
                                    className={`flex flex-col space-y-5 p-5 rounded-lg border-[2px] shadow-md
                                        ${getBorderClass(field)}`}
                                >
                                    <div className="flex justify-between">
                                        <div className="text-lg font-semibold text-slate-500">{index + 1}</div>
                                        <button disabled={isSaving} type="button" onClick={() => handleDelete(index)} className="text-red-400 hover:text-red-500 duration-100 hover:scale-125">
                                            <Trash2 />
                                        </button>
                                    </div>
                                    <Separator />
                                    <div className="w-full flex flex-row space-x-4">
                                        <FormField control={form.control} name={`flashcards.${index}.japaneseDefinition`} render={({ field }) => (
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
                                        <FormField control={form.control} name={`flashcards.${index}.vietEngTranslation`} render={({ field }) => (
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
                                        {!field.imageUrl
                                            ? (
                                                <CldUploadWidget
                                                    uploadPreset={process.env.NEXT_PUBLIC_CLOUD_IMAGE_UPLOAD_PRESET}
                                                    options={{ sources: ["local", "camera", "url"], resourceType: "auto" }}
                                                    onSuccess={(result) => {
                                                        if (typeof result.info === "object" && result.info !== null) {
                                                            const uploadInfo = result.info;
                                                            const imageUrl = uploadInfo.secure_url;
                                                            handleImageUpload(index, imageUrl);
                                                        }
                                                    }}
                                                >
                                                    {({ open }) => (
                                                        <button
                                                            disabled={isSaving}
                                                            type='button'
                                                            className="border-dashed border-[2px] rounded-lg h-[92px] w-32 flex items-center justify-center text-slate-500 hover:cursor-pointer hover:text-green-500 hover:scale-105 duration-100"
                                                            onClick={() => open()}
                                                        >
                                                            <ImagePlus />
                                                        </button>
                                                    )}
                                                </CldUploadWidget>
                                            )
                                            : (
                                                <div
                                                    className={`border-dashed border-[2px] rounded-lg h-[92px] w-32 flex justify-end text-slate-500  ${!isSaving ? "hover:cursor-not-allowed" : "hover:cursor-pointer hover:text-green-500 hover:scale-105 duration-100"}`}

                                                    style={{
                                                        backgroundImage: `url(${field.imageUrl})`,
                                                        backgroundSize: "cover",
                                                        backgroundPosition: "center"
                                                    }}
                                                >
                                                    <button disabled={isSaving} type="button" onClick={() => handleDeleteImage(index)} className="bg-slate-700 text-white hover:bg-red-500 p-1 h-fit">
                                                        <Trash size={16} />
                                                    </button>
                                                </div>
                                            )}
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    {fields.length === 0 && <EmptyStateComponent imgageUrl="https://allpromoted.co.uk/image/no-data.svg" message="This set does not have any flashcard" size={400} />}
                    <button type="button" onClick={handleInsertNew} className="w-full flex h-[70px] justify-center items-center rounded-lg shadow-md border-[1px] hover:scale-95 duration-100 transition-all ease-in-out">
                        <div className="flex space-x-4">
                            <Plus /> <span className="font-medium">Add flashcard</span>
                        </div>
                    </button>
                </div>
            </form>
        </Form>
    )
}

export default FlashcardRender
