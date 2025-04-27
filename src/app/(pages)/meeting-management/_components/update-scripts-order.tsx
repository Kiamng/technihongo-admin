import {
    DragDropContext,
    Draggable,
    Droppable,
    DropResult,
} from "@hello-pangea/dnd";
import { FieldArrayWithId } from "react-hook-form";

import { Separator } from "@/components/ui/separator";

interface ScriptUpdateOrderProps {
    fields: FieldArrayWithId<{
        infomation: {
            title: string;
            voiceName: string;
            isActive: boolean;
            description?: string | undefined;
        };
        scripts: {
            question: string;
            scriptId: number | null;
            answer: string;
            scriptOrder: number | null;
        }[];
    }, "scripts", "id">[]
    handleDragEnd: (result: DropResult) => void;
}

const ScriptUpdateOrder = ({
    fields,
    handleDragEnd,
}: ScriptUpdateOrderProps) => {
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
                                        className="flex flex-col space-y-5 p-5 rounded-lg border-[1px] shadow-md hover:scale-105 duration-100"
                                    >
                                        <div className="text-lg font-semibold text-slate-500">
                                            {index + 1}
                                        </div>
                                        <Separator />
                                        <div className="w-full flex flex-col space-y-2 text-2xl font-bold">
                                            <div className="flex-1">{field.question}</div>
                                            <div className="flex-1 text-slate-500">
                                                {field.answer}
                                            </div>
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
    );
};

export default ScriptUpdateOrder;
