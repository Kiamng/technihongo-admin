
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import { Plus, Trash2 } from "lucide-react";

import { FieldValues, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { DropResult } from "@hello-pangea/dnd";

import { QuestionSchema, QuizQuestionSchema } from "@/schema/question";

import { Quiz } from "@/types/quiz";

import { createQuizQuestionWithQuestion, deleteQuizQestion, updateQuizQuestionOrder } from "@/app/api/quiz-question/quiz-question.api";
import UpdateQuizQuestionOrder from "./update-quiz-question-order";
import FormAction from "./QuizQuestion/actions/form-action";
import QuestionRender from "./QuizQuestion/questions/question-render";
import OptionRender from "./QuizQuestion/options/option-render";
import { updateQuestionWithOptions } from "@/app/api/question/question.api";


interface QuestionInQuizListProps {
    initialData: {
        quizQuestionId: number;
        questionOrder: number;
        questionId: number;
        questionType: "Single_choice" | "Multiple_choice";
        questionText: string;
        explanation: string;
        url: string;
        answers: {
            optionText: string;
            isCorrect: boolean;
        }[] | [];
    }[];
    isQuizQuestionsLoading: boolean
    quiz: Quiz
    fetchQuizQuestion: () => Promise<void>
    token: string
}

type QuestionInForm = z.infer<typeof QuestionSchema>;
const QuestionInQuizList = ({ initialData, isQuizQuestionsLoading, quiz, fetchQuizQuestion, token }: QuestionInQuizListProps) => {
    const [isSaving, startTransition] = useTransition();
    const [imageUrls, setImageUrls] = useState<(string | null)[]>([]);
    const [changedQuestions, setChangedQuestions] = useState<QuestionInForm[]>([]);
    const [isEditingOrder, setIsEditingOrder] = useState<boolean>(false);
    const [initialOrder, setInitialOrder] = useState<QuestionInForm[]>([]);
    const [newQuestionOrder, setNewQuestionOrder] = useState<QuestionInForm[]>([]);
    const [isSavingNewOrder, startSavingNewOrderTransition] = useTransition();
    const optionsStateRef = useRef<QuestionInForm[]>([]);

    const form = useForm<z.infer<typeof QuizQuestionSchema>>({
        resolver: zodResolver(QuizQuestionSchema),
        mode: 'onChange',
        defaultValues: {
            questions: []
        }
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "questions",
    });

    const handleUpdateOrderToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        const hasUnSavedQuestions = form.getValues().questions.some((question) => !question.quizQuestionId) || changedQuestions.length > 0;

        if (hasUnSavedQuestions) {
            toast.error("You need to save all questions before updating order.");
            return;
        }

        setIsEditingOrder(!isEditingOrder);
        if (!isEditingOrder) {
            setNewQuestionOrder([...initialOrder]);
        }
    };

    const handleCancelUpdateOrder = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setIsEditingOrder(false);
        form.setValue("questions", newQuestionOrder);
    };

    const handleDragEnd = (result: DropResult) => {
        const { destination, source } = result;

        if (!destination || destination.index === source.index) {
            return;
        }

        const newQuestions = Array.from(form.getValues().questions);
        const [removed] = newQuestions.splice(source.index, 1);
        newQuestions.splice(destination.index, 0, removed);

        form.setValue("questions", newQuestions);

        setNewQuestionOrder([...newQuestions]);
    };

    const handleSaveNewOrder = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        startSavingNewOrderTransition(async () => {
            try {
                const newOrder = newQuestionOrder.map((question) => question.initialIndex);
                console.log(newOrder);

                await updateQuizQuestionOrder(quiz.quizId, newOrder as number[]);

                toast.success("Order saved successfully!");
                setInitialOrder([...newQuestionOrder]);
                setIsEditingOrder(false);
            } catch (error) {
                console.error("Error while updating new order:", error);
                toast.error("Failed to save new order");
            }
        });
    };

    const handleDelete = (index: number) => {
        const selectedQuestion = form.getValues().questions[index];

        if (selectedQuestion.quizQuestionId) {
            deleteQuizQestion(selectedQuestion.quizQuestionId)
                .then(() => {
                    remove(index);
                    toast.success('Question deleted successfully!');
                })
                .catch((error) => {
                    console.error("Error deleting question: ", error);
                    toast.error('Failed to delete question');
                });
        } else {
            remove(index);
        }
    };

    const handleInsertNew = () => {
        append({
            quizQuestionId: null,
            questionId: null,
            questionType: "Single_choice",
            questionText: "",
            explanation: "",
            url: "",
            initialIndex: null,
            options: [
                { optionText: "", isCorrect: true },
                { optionText: "", isCorrect: false },
                { optionText: "", isCorrect: false },
                { optionText: "", isCorrect: false }
            ]
        });
    };

    const handleOptionClick = (questionIndex: number, optionIndex: number) => {
        const updatedQuestions = [...form.getValues().questions];
        const question = updatedQuestions[questionIndex];

        if (!question || !question.options || !question.options[optionIndex]) {
            console.error("Invalid question or option index.");
            return;
        }

        const options = question.options;

        const correctOptionsCount = options.filter(option => option.isCorrect).length;

        if (correctOptionsCount === 1 && options[optionIndex].isCorrect) {
            toast.error("A question must have at least one correct answer!");
            return;
        }

        options[optionIndex].isCorrect = !options[optionIndex].isCorrect;

        const newCorrectOptionsCount = options.filter(option => option.isCorrect).length;
        if (newCorrectOptionsCount === 1) {
            question.questionType = "Single_choice";
        } else if (newCorrectOptionsCount > 1) {
            question.questionType = "Multiple_choice";
        }

        const existingIndex = changedQuestions.findIndex(q => q.quizQuestionId === question.quizQuestionId);

        if (existingIndex > -1) {
            const updatedChangedQuestions = [...changedQuestions];
            updatedChangedQuestions[existingIndex] = { ...question };
            setChangedQuestions(updatedChangedQuestions);
        } else {
            const newChangedQuestion = {
                ...question,
                options: [...options],
                questionType: question.questionType,
            };

            setChangedQuestions(prev => [...prev, newChangedQuestion]);
        }
    };





    const getBorderClass = (field: FieldValues) => {
        if (!field.quizQuestionId) {
            return "border-green-500";
        }

        return changedQuestions.some(q => q.quizQuestionId === field.quizQuestionId)
            ? "border-yellow-500"
            : "";
    };

    const addChangedQuestion = (index: number) => {
        const updatedQuestions = [...form.getValues().questions];
        const question = updatedQuestions[index];

        if (!question.quizQuestionId) {
            return;
        }

        const existingIndex = changedQuestions.findIndex(q => q.quizQuestionId === question.quizQuestionId);

        if (existingIndex > -1) {
            const updatedChangedQuestions = [...changedQuestions];
            updatedChangedQuestions[existingIndex] = { ...question };
            setChangedQuestions(updatedChangedQuestions);
        } else {
            setChangedQuestions(prev => [...prev, { ...question }]);
        }
    };


    const onSubmit = (values: z.infer<typeof QuizQuestionSchema>) => {
        // const updatedQuestions = values.questions;
        // const oldQuestion = updatedQuestions.filter((question) => question.quizQuestionId);
        // console.log("Old question:", oldQuestion);
        // console.log("Changed question:", changedQuestions);
        // console.log("Option state :", optionsStateRef);
        // const newQuestions = updatedQuestions.filter((question) => !question.quizQuestionId);
        // console.log("New question:", newQuestions);
        startTransition(async () => {
            const newQuestions = values.questions.filter((question) => !question.quizQuestionId);

            if (changedQuestions.length > 0) {
                try {
                    for (const question of changedQuestions) {
                        if (question?.questionId) {
                            const updateResponse = await updateQuestionWithOptions(token, question.questionId, question);
                            if (updateResponse.success === false) {
                                toast.error(`Failed to update question: "${question?.questionText}"`);
                            }
                        }
                    }
                } catch (error) {
                    console.error("Error while updating questions: ", error);
                }
            }

            if (newQuestions.length > 0) {
                try {
                    for (const question of newQuestions) {
                        const createQuestionResponse = await createQuizQuestionWithQuestion(quiz.quizId, question);
                        if (createQuestionResponse.success === false) {
                            toast.error(`Failed to create question: "${question.questionText}"`);
                        }
                    }
                } catch (error) {
                    console.error("Error while creating new questions: ", error);
                }
            }
            setChangedQuestions([]);
            await fetchQuizQuestion();
        });
    };
    useEffect(() => {
        if (initialData && initialData.length > 0) {
            const formattedQuestions = initialData.map((quizQuestion) => ({
                quizQuestionId: quizQuestion.quizQuestionId,
                questionId: quizQuestion.questionId,
                questionText: quizQuestion.questionText,
                questionType: quizQuestion.questionType,
                explanation: quizQuestion.explanation,
                url: quizQuestion.url,
                options: quizQuestion.answers.map((answer) => ({
                    optionText: answer.optionText,
                    isCorrect: answer.isCorrect,
                })),
                initialIndex: quizQuestion.questionOrder
            }));
            optionsStateRef.current = formattedQuestions;
            form.reset({
                questions: formattedQuestions,
            });
            setInitialOrder(formattedQuestions);
            setNewQuestionOrder(formattedQuestions);
        }
    }, [initialData, form]);

    const handleImageUpload = (index: number, imageUrl: string) => {
        const updatedImageUrls = [...imageUrls];
        updatedImageUrls[index] = imageUrl;
        setImageUrls(updatedImageUrls);
        const updatedQuestions = [...form.getValues().questions];
        updatedQuestions[index].url = imageUrl;
        form.setValue("questions", updatedQuestions);
    };

    const handleDeleteImage = (index: number) => {
        const updatedImageUrls = [...imageUrls];
        updatedImageUrls[index] = null;
        setImageUrls(updatedImageUrls);
        const updatedQuestions = [...form.getValues().questions];
        updatedQuestions[index].url = "";
        form.setValue("questions", updatedQuestions);
    };

    if (isQuizQuestionsLoading) {
        return (
            <>
                <Skeleton className="w-full h-[370px]" />
                <Skeleton className="w-full h-[370px]" />
                <Skeleton className="w-full h-[370px]" />
            </>
        )
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col space-y-6">
                    <div className="w-full flex justify-between">
                        <span className="text-lg font-bold ">
                            Questions In Quiz ({isQuizQuestionsLoading ? "..." : newQuestionOrder.length})
                        </span>
                        <FormAction isEditingOrder={isEditingOrder} handleCancelUpdateOrder={handleCancelUpdateOrder} handleSaveNewOrder={handleSaveNewOrder} handleUpdateOrderToggle={handleUpdateOrderToggle} isSaving={isSaving} isSavingNewOrder={isSavingNewOrder} />
                    </div>
                    <div className="w-full space-y-8">
                        {isEditingOrder
                            ? (
                                <UpdateQuizQuestionOrder fields={fields} handleDelete={handleDelete} handleDragEnd={handleDragEnd} />
                            )
                            : (
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
                                        <QuestionRender isSaving={isSaving} field={field} index={index} addChangedQuestion={addChangedQuestion} handleImageUpload={handleImageUpload} handleDeleteImage={handleDeleteImage} />
                                        <Separator />
                                        <OptionRender isSaving={isSaving} addChangedQuestion={addChangedQuestion} field={field} index={index} handleOptionClick={handleOptionClick} />
                                    </div>
                                ))
                            )}
                    </div>
                    <button onClick={handleInsertNew} className="w-full flex h-[70px] justify-center items-center rounded-lg shadow-md border-[1px] hover:scale-105 duration-100 transition-all ease-in-out">
                        <div className="flex space-x-4">
                            <Plus /> <span className="font-medium">Add question</span>
                        </div>
                    </button>
                </div>
            </form>
        </Form>
    );
};
export default QuestionInQuizList;
