import { FieldArrayWithId } from "react-hook-form";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface UpdateQuizQuestionOrderProps {
    fields: FieldArrayWithId<{
        questions: {
            questionText: string;
            quizQuestionId: number | null;
            questionId: number | null;
            explanation: string;
            url: string;
            initialIndex: number | null;
            options: {
                optionText: string;
                isCorrect: boolean;
            }[];
        }[];
    }, "questions", "id">[],
    handleDragEnd: (result: DropResult) => void,
    handleDelete: (index: number) => void
}

const UpdateQuizQuestionOrder = ({ fields, handleDragEnd, handleDelete }: UpdateQuizQuestionOrderProps) => {
    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="question-list" type="question">
                {(provided) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="space-y-4"
                    >
                        {fields.map((field, index) => (
                            <Draggable key={field.id} draggableId={field.id} index={index}>
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className="flex flex-col space-y-5 p-5 rounded-lg border-[1px] shadow-md"
                                    >
                                        <div className="flex justify-between">
                                            <div className="text-lg font-semibold text-slate-500">{index + 1}</div>
                                            <button type="button" onClick={() => handleDelete(index)} className="text-red-400 hover:text-red-500 duration-100 hover:scale-125">
                                                <Trash2 />
                                            </button>
                                        </div>
                                        <Separator />
                                        <div className="text-slate-500">{field.questionText}
                                        </div>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    )
}

export default UpdateQuizQuestionOrder
