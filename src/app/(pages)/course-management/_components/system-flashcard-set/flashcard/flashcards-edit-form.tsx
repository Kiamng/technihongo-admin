import { createFlashcards, deleteFlashcard, updateFlashard, updateFlashardOrder } from "@/app/api/system-flashcard-set/system-flashcard-set.api";
import EmptyStateComponent from "@/components/empty-state";
import { Form } from "@/components/ui/form";
import { FlashcardSchema, FlashcardSetSchema } from "@/schema/flashcard";
import { Flashcard } from "@/types/flashcard";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import ImportCSVPopup from "../../spreadsheet-import/import-csv-popup";
import { handleFlashcardFileUpload } from "../../spreadsheet-import/flashcard-import-action";
import FlashcardInFormRender from "./flashcard-in-form";
import UpdateFlashcardOrder from "./update-flashcard-order";
import { DropResult } from "@hello-pangea/dnd";
import FormAction from "../../quiz/QuizQuestion/actions/form-action";
import { uploadImageCloud } from "@/app/api/image/image.api";

type FlashcardInForm = z.infer<typeof FlashcardSchema>;

interface FlashcardProps {
    initialData: Flashcard[]
    token: string
    flashcardSetId: number
    fetchSet: () => Promise<void>
}

const FlashcardsFormRender = ({ initialData, token, flashcardSetId, fetchSet }: FlashcardProps) => {
    const [isSaving, startTransition] = useTransition();
    const [isSavingNewOrder, startSavingNewOrderTransition] = useTransition();
    const [initialOrder, setInitialOrder] = useState<FlashcardInForm[]>([]);
    const [newFlashcardOrder, setNewFlashcardOrder] = useState<FlashcardInForm[]>([]);
    const [isEditingOrder, setIsEditingOrder] = useState<boolean>(false);
    const [changedFlashcards, setChangedFlashcards] = useState<FlashcardInForm[]>([]);
    const [imageUrls, setImageUrls] = useState<(string | null)[]>([]);

    const [imageFiles, setImageFiles] = useState<(File | null)[]>([]);


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

    const handleImageSelect = (index: number, file: File) => {
        const newImageFiles = [...imageFiles];
        newImageFiles[index] = file;
        setImageFiles(newImageFiles);

        const previewUrl = URL.createObjectURL(file);
        handleImageUpload(index, previewUrl);
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

    // Update order hanlde
    const handleUpdateOrderToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        const hasUnSavedFlashcards = form.getValues().flashcards.some((flashcard) => !flashcard.flashcardId) || changedFlashcards.length > 0;

        if (hasUnSavedFlashcards) {
            toast.error("You need to save all questions before updating order.");
            return;
        }

        setIsEditingOrder(!isEditingOrder);
        if (!isEditingOrder) {
            setNewFlashcardOrder([...initialOrder]);
        }
    };

    const handleDragEnd = (result: DropResult) => {
        const { destination, source } = result;

        if (!destination || destination.index === source.index) {
            return;
        }

        const newFlashcards = Array.from(form.getValues().flashcards);
        const [removed] = newFlashcards.splice(source.index, 1);
        newFlashcards.splice(destination.index, 0, removed);

        form.setValue("flashcards", newFlashcards);

        setNewFlashcardOrder([...newFlashcards]);
    };

    const handleCancelUpdateOrder = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setIsEditingOrder(false);
        form.setValue("flashcards", initialOrder);
    };

    const handleSaveNewOrder = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        startSavingNewOrderTransition(async () => {
            try {
                const newOrder = newFlashcardOrder.map((flashcard) => flashcard.cardOrder);
                console.log(newOrder);

                await updateFlashardOrder(token, flashcardSetId, newOrder as number[]);

                toast.success("Order saved successfully!");
                setInitialOrder([...newFlashcardOrder]);
                setIsEditingOrder(false);
            } catch (error) {
                console.error("Error while updating new order:", error);
                toast.error("Failed to save new order");
            }
        });
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

    const uploadImagesIfNeeded = async (
        flashcards: FlashcardInForm[],
        imageFiles: (File | null)[]
    ): Promise<FlashcardInForm[]> => {
        const updatedFlashcards = [...flashcards];

        for (let i = 0; i < flashcards.length; i++) {
            const file = imageFiles[i];
            const isTempPreview = flashcards[i].imageUrl && !flashcards[i].imageUrl?.startsWith("http");

            if (file && file instanceof File && isTempPreview) {
                const formData = new FormData();
                formData.append("file", file);
                const uploadedUrl = await uploadImageCloud(formData);

                if (uploadedUrl) {
                    updatedFlashcards[i].imageUrl = uploadedUrl;

                    const currentFormValue = [...form.getValues().flashcards];
                    currentFormValue[i].imageUrl = uploadedUrl;
                    form.setValue("flashcards", currentFormValue);
                }
            }
        }

        return updatedFlashcards;
    };


    const onSubmit = (values: z.infer<typeof FlashcardSetSchema>) => {
        const updatedFlashcards = values.flashcards;
        // console.log("Old flashcard:", oldFlashcard);
        // console.log("Changed flashcard:", changedFlashcards);
        const newFlashcards = updatedFlashcards.filter((flashcard) => !flashcard.flashcardId);
        // const formattedNewFlashcards = newFlashcards.map(flashcard => ({
        //     japaneseDefinition: flashcard.japaneseDefinition,
        //     vietEngTranslation: flashcard.vietEngTranslation,
        //     imageUrl: flashcard.imageUrl
        // }));
        // console.log("New flashcard:", formattedNewFlashcards);
        startTransition(async () => {
            try {
                const updatedNewFlashcards = await uploadImagesIfNeeded(newFlashcards, imageFiles);
                const updatedChangedFlashcards = await uploadImagesIfNeeded(changedFlashcards, imageFiles);

                if (updatedNewFlashcards.length > 0) {
                    const formattedNew = updatedNewFlashcards.map(f => ({
                        japaneseDefinition: f.japaneseDefinition,
                        vietEngTranslation: f.vietEngTranslation,
                        imageUrl: f.imageUrl
                    }));
                    await createFlashcards(token, flashcardSetId, formattedNew);
                }

                if (updatedChangedFlashcards.length > 0) {
                    for (const flashcard of updatedChangedFlashcards) {
                        console.log("➡️ Updating flashcard:", flashcard);
                        if (flashcard.flashcardId) {
                            const res = await updateFlashard(token, flashcard);
                            if (res.success === false) {
                                toast.error(`Failed to update: "${flashcard.japaneseDefinition}"`);
                            }
                        }
                    }
                }
                setChangedFlashcards([])
                await fetchSet()
            } catch (error) {
                console.error("Error while updating flashcards: ", error);
                toast.error("Failed to update flashcards");
            }
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
                        <FormAction
                            isSaving={isSaving}
                            isEditingOrder={isEditingOrder}
                            handleUpdateOrderToggle={handleUpdateOrderToggle}
                            handleCancelUpdateOrder={handleCancelUpdateOrder}
                            handleSaveNewOrder={handleSaveNewOrder}
                            isSavingNewOrder={isSavingNewOrder} />
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileImport}
                            className="hidden"
                        />
                    </div>
                    <div className="w-full space-y-8">
                        {isEditingOrder
                            ? (
                                <UpdateFlashcardOrder fields={fields} handleDragEnd={handleDragEnd} />
                            ) : (
                                fields.map((field, index) => (
                                    <div key={field.id}
                                        className={`flex flex-col space-y-5 p-5 rounded-lg border-[2px] shadow-md
                                                    ${getBorderClass(field)}`}
                                    >
                                        <FlashcardInFormRender
                                            field={field}
                                            index={index}
                                            isSaving={isSaving}
                                            addChangedFlashcard={addChangedFlashcard}
                                            handleDelete={handleDelete}
                                            handleDeleteImage={handleDeleteImage}
                                            handleImageSelect={handleImageSelect} />
                                    </div>
                                ))
                            )
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

export default FlashcardsFormRender
